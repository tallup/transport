<?php

namespace App\Notifications;

use App\Models\StudentAbsence;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DriverStudentAbsence extends Notification
{
    use Queueable;

    protected $absence;

    public function __construct(StudentAbsence $absence)
    {
        $this->absence = $absence;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $student = $this->absence->student;
        $date = $this->absence->absence_date->format('M d, Y');
        $period = strtoupper($this->absence->period);
        $route = $this->absence->booking->route;

        return (new MailMessage)
            ->subject("Student Absence: {$student->name} - {$date}")
            ->greeting("Hello Driver,")
            ->line("A student on your route ({$route->name}) has been reported absent.")
            ->line("Student: {$student->name}")
            ->line("Date: {$date}")
            ->line("Period: {$period}")
            ->line("You don't need to pick up this student for the specified period.")
            ->line("Reason: " . ($this->absence->reason ?: 'No reason provided'))
            ->line('Safe driving!');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'student_absence',
            'student_name' => $this->absence->student->name,
            'absence_date' => $this->absence->absence_date->toDateString(),
            'period' => $this->absence->period,
            'route_name' => $this->absence->booking->route->name,
            'url' => route('driver.roster.index')
        ];
    }
}
