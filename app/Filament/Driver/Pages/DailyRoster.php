<?php

namespace App\Filament\Driver\Pages;

use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\Route;
use Carbon\Carbon;
use Filament\Pages\Page;

class DailyRoster extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'Daily Roster';

    protected static string $view = 'filament.driver.pages.daily-roster';

    public ?string $selectedDate = null;

    public $route = null;
    public $bookings = [];
    public $groupedBookings = [];

    public function mount(): void
    {
        $this->selectedDate = Carbon::today()->format('Y-m-d');
        $this->loadRoster();
    }

    public function loadRoster(): void
    {
        $driver = auth()->user();
        $date = Carbon::parse($this->selectedDate);

        // Get driver's route
        $this->route = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->first();

        if (!$this->route) {
            return;
        }

        // Check if it's a school day
        $isSchoolDay = !CalendarEvent::where('date', $date->format('Y-m-d'))
            ->whereIn('type', ['holiday', 'closure'])
            ->exists();

        if (!$isSchoolDay) {
            return;
        }

        // Get active bookings for the date
        $this->bookings = Booking::where('route_id', $this->route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            })
            ->with(['student', 'pickupPoint'])
            ->get();

        // Group by pickup point
        $this->groupedBookings = $this->bookings
            ->groupBy('pickup_point_id')
            ->map(function ($bookings) {
                $pickupPoint = $bookings->first()->pickupPoint;
                return [
                    'pickup_point' => $pickupPoint,
                    'bookings' => $bookings->sortBy('student.name'),
                    'pickup_time' => $pickupPoint->pickup_time,
                    'dropoff_time' => $pickupPoint->dropoff_time,
                ];
            })
            ->sortBy('pickup_point.sequence_order')
            ->values();
    }

    public function updatedSelectedDate(): void
    {
        $this->loadRoster();
    }
}
