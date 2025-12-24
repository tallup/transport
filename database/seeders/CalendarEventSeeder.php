<?php

namespace Database\Seeders;

use App\Models\CalendarEvent;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CalendarEventSeeder extends Seeder
{
    public function run(): void
    {
        $today = Carbon::today();
        $year = $today->year;

        // Add major holidays
        $holidays = [
            ['date' => Carbon::create($year, 1, 1), 'type' => 'holiday', 'description' => 'New Year\'s Day'],
            ['date' => Carbon::create($year, 7, 4), 'type' => 'holiday', 'description' => 'Independence Day'],
            ['date' => Carbon::create($year, 11, 11), 'type' => 'holiday', 'description' => 'Veterans Day'],
            ['date' => Carbon::create($year, 11, 28), 'type' => 'holiday', 'description' => 'Thanksgiving Day'],
            ['date' => Carbon::create($year, 12, 25), 'type' => 'holiday', 'description' => 'Christmas Day'],
        ];

        foreach ($holidays as $holiday) {
            CalendarEvent::firstOrCreate(
                ['date' => $holiday['date']->format('Y-m-d')],
                [
                    'type' => $holiday['type'],
                    'description' => $holiday['description'],
                ]
            );
        }

        // Add some closures for next 30 days
        $closures = [
            ['date' => $today->copy()->addDays(5), 'description' => 'School closure for maintenance'],
            ['date' => $today->copy()->addDays(12), 'description' => 'Teacher training day'],
        ];

        foreach ($closures as $closure) {
            CalendarEvent::firstOrCreate(
                ['date' => $closure['date']->format('Y-m-d')],
                [
                    'type' => 'closure',
                    'description' => $closure['description'],
                ]
            );
        }
    }
}
