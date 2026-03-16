<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingStartingSoon extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $studentName = $this->booking->student->name;
        $startDate = $this->booking->start_date->format('l, F j, Y');
        $routeName = $this->booking->route->name ?? 'N/A';
        $pickupTime = $this->booking->pickupPoint?->pickup_time ?? $this->booking->route?->pickup_time ?? 'TBD';

        return (new MailMessage)
            ->subject('Reminder: School Transport Booking Starting Soon')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line("This is a friendly reminder that the school transport service for **{$studentName}** is scheduled to start on **{$startDate}**.")
            ->line("Route: **{$routeName}**")
            ->line("Scheduled Pickup Time: **{$pickupTime}**")
            ->action('View Booking Details', route('parent.bookings.show', $this->booking))
            ->line('Please ensure your child is ready at the pickup point at least 5 minutes before the scheduled time.')
            ->line('Thank you for using our transport system!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'student_name' => $this->booking->student->name,
            'start_date' => $this->booking->start_date->format('Y-m-d'),
            'message' => "Transport service for {$this->booking->student->name} starts on {$this->booking->start_date->format('M j')}.",
            'type' => 'booking_starting_soon',
        ];
    }
}
