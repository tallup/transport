<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Jobs\ScanUploadedFile;
use App\Models\Booking;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\MessageThread;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Get threads for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $threads = MessageThread::where(function ($query) use ($user) {
            $query->where('participant_1_id', $user->id)
                ->orWhere('participant_2_id', $user->id);
        })
            ->with([
                'participant1',
                'participant2',
                'booking.student',
                'route',
                'messages' => fn ($q) => $q->latest()->limit(1),
            ])
            ->withCount(['messages as unread_count' => function ($query) use ($user) {
                $query->where('recipient_id', $user->id)->whereNull('read_at');
            }])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($thread) use ($user) {
                $otherParticipant = $thread->getOtherParticipant($user);
                $lastMessage = $thread->messages->first();

                return [
                    'id' => $thread->id,
                    'type' => $thread->type,
                    'other_participant' => $otherParticipant ? [
                        'id' => $otherParticipant->id,
                        'name' => $otherParticipant->name,
                        'role' => $otherParticipant->role,
                    ] : null,
                    'booking' => $thread->booking ? [
                        'id' => $thread->booking->id,
                        'student_name' => $thread->booking->student->name ?? null,
                    ] : null,
                    'route' => $thread->route ? [
                        'id' => $thread->route->id,
                        'name' => $thread->route->name,
                    ] : null,
                    'last_message' => $lastMessage ? [
                        'message' => $lastMessage->message,
                        'created_at' => $lastMessage->created_at->toIso8601String(),
                    ] : null,
                    'unread_count' => $thread->unread_count,
                    'last_message_at' => $thread->last_message_at?->toIso8601String(),
                ];
            });

        return Inertia::render('Messages/Index', [
            'threads' => $threads,
        ]);
    }

    /**
     * Show messages for a specific thread.
     */
    public function show(Request $request, MessageThread $thread)
    {
        $user = $request->user();

        // Verify user is a participant
        if ($thread->participant_1_id !== $user->id && $thread->participant_2_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $messages = $thread->messages()
            ->with(['sender', 'attachments'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender->name,
                    'message' => $message->message,
                    'type' => $message->type,
                    'read_at' => $message->read_at?->toIso8601String(),
                    'created_at' => $message->created_at->toIso8601String(),
                    'attachments' => $message->attachments->map(function ($attachment) {
                        return [
                            'id' => $attachment->id,
                            'file_name' => $attachment->file_name,
                            'file_size' => $attachment->file_size,
                            'mime_type' => $attachment->mime_type,
                            'url' => $attachment->url,
                        ];
                    }),
                ];
            });

        // Mark messages as read
        $thread->messages()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $otherParticipant = $thread->getOtherParticipant($user);

        return Inertia::render('Messages/Show', [
            'thread' => [
                'id' => $thread->id,
                'type' => $thread->type,
                'other_participant' => $otherParticipant ? [
                    'id' => $otherParticipant->id,
                    'name' => $otherParticipant->name,
                    'role' => $otherParticipant->role,
                ] : null,
                'booking' => $thread->booking ? [
                    'id' => $thread->booking->id,
                    'student_name' => $thread->booking->student->name ?? null,
                ] : null,
                'route' => $thread->route ? [
                    'id' => $thread->route->id,
                    'name' => $thread->route->name,
                ] : null,
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Create or get a thread and send a message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'nullable|exists:users,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'route_id' => 'nullable|exists:routes,id',
            'message' => 'required|string|max:5000',
            'attachments' => 'nullable|array',
            // Whitelist message attachment types; reject executables and unexpected formats.
            'attachments.*' => 'file|max:10240|mimes:jpeg,jpg,png,gif,webp,pdf,doc,docx,txt', // 10MB max
        ]);

        $user = $request->user();

        // Determine thread type and find or create thread
        $thread = null;
        if ($validated['booking_id']) {
            $booking = Booking::with('route')->findOrFail($validated['booking_id']);

            // Only the booking's parent, an admin, or the route's driver may message about it.
            if (! $this->canMessageAboutBooking($user, $booking)) {
                abort(403, 'You are not authorized to message about this booking.');
            }

            $thread = MessageThread::firstOrCreate(
                [
                    'type' => 'booking',
                    'booking_id' => $validated['booking_id'],
                ],
                [
                    'participant_1_id' => $user->id,
                    'participant_2_id' => $booking->student->parent_id ?? $validated['recipient_id'],
                ]
            );
        } elseif ($validated['route_id']) {
            $route = Route::findOrFail($validated['route_id']);

            // Only an admin, the assigned driver, or a parent with a booking on the route may message about it.
            if (! $this->canMessageAboutRoute($user, $route)) {
                abort(403, 'You are not authorized to message about this route.');
            }

            $thread = MessageThread::firstOrCreate(
                [
                    'type' => 'route',
                    'route_id' => $validated['route_id'],
                ],
                [
                    'participant_1_id' => $user->id,
                    'participant_2_id' => $route->driver_id ?? $validated['recipient_id'],
                ]
            );
        } else {
            // Direct message
            $recipientId = $validated['recipient_id'];
            if (! $recipientId) {
                return response()->json(['error' => 'Recipient is required for direct messages'], 422);
            }

            $thread = MessageThread::where('type', 'direct')
                ->where(function ($query) use ($user, $recipientId) {
                    $query->where(function ($q) use ($user, $recipientId) {
                        $q->where('participant_1_id', $user->id)
                            ->where('participant_2_id', $recipientId);
                    })->orWhere(function ($q) use ($user, $recipientId) {
                        $q->where('participant_1_id', $recipientId)
                            ->where('participant_2_id', $user->id);
                    });
                })
                ->first();

            if (! $thread) {
                $thread = MessageThread::create([
                    'type' => 'direct',
                    'participant_1_id' => $user->id,
                    'participant_2_id' => $recipientId,
                ]);
            }
        }

        // Determine recipient
        $recipientId = $thread->getOtherParticipant($user)?->id;

        // Create message
        $message = Message::create([
            'thread_id' => $thread->id,
            'sender_id' => $user->id,
            'recipient_id' => $recipientId,
            'message' => $validated['message'],
            'type' => 'text',
        ]);

        // Handle attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->storeAs('message-attachments', $file->hashName(), 'public');

                $attachment = MessageAttachment::create([
                    'message_id' => $message->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'scan_status' => 'pending',
                ]);

                ScanUploadedFile::dispatch(MessageAttachment::class, $attachment->id, 'file_path')->onQueue('default');

                $message->type = 'file';
            }
            $message->save();
        }

        // Update thread's last message timestamp
        $thread->update(['last_message_at' => now()]);

        // Broadcast the message
        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'success' => true,
            'message' => $message->load(['sender', 'attachments']),
        ]);
    }

    /**
     * Whether the user may open/post to a thread about the given booking.
     */
    private function canMessageAboutBooking(\App\Models\User $user, Booking $booking): bool
    {
        if (in_array($user->role, ['super_admin', 'transport_admin', 'admin'], true)) {
            return true;
        }

        // Parent who owns the booking's student.
        if ((int) ($booking->student?->parent_id) === (int) $user->id) {
            return true;
        }

        // Driver assigned to the booking's route.
        return $user->role === 'driver'
            && (int) ($booking->route?->driver_id) === (int) $user->id;
    }

    /**
     * Whether the user may open/post to a thread about the given route.
     */
    private function canMessageAboutRoute(\App\Models\User $user, Route $route): bool
    {
        if (in_array($user->role, ['super_admin', 'transport_admin', 'admin'], true)) {
            return true;
        }

        // Driver assigned to the route.
        if ($user->role === 'driver' && (int) $route->driver_id === (int) $user->id) {
            return true;
        }

        // Parent with at least one booking on the route (via their students).
        return Booking::where('route_id', $route->id)
            ->whereHas('student', fn ($q) => $q->where('parent_id', $user->id))
            ->exists();
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Request $request, MessageThread $thread)
    {
        $user = $request->user();

        $thread->messages()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
