<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarEventController extends Controller
{
    public function index()
    {
        $calendarEvents = CalendarEvent::orderBy('date', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/CalendarEvents/Index', [
            'calendarEvents' => $calendarEvents,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CalendarEvents/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:school_day,holiday,closure',
            'description' => 'required|string|max:500',
        ]);

        CalendarEvent::create($validated);

        return redirect()->route('admin.calendar-events.index')
            ->with('success', 'Calendar event created successfully.');
    }

    public function edit(CalendarEvent $calendarEvent)
    {
        return Inertia::render('Admin/CalendarEvents/Edit', [
            'calendarEvent' => $calendarEvent,
        ]);
    }

    public function update(Request $request, CalendarEvent $calendarEvent)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:school_day,holiday,closure',
            'description' => 'required|string|max:500',
        ]);

        $calendarEvent->update($validated);

        return redirect()->route('admin.calendar-events.index')
            ->with('success', 'Calendar event updated successfully.');
    }

    public function destroy(CalendarEvent $calendarEvent)
    {
        $calendarEvent->delete();

        return redirect()->route('admin.calendar-events.index')
            ->with('success', 'Calendar event deleted successfully.');
    }
}
