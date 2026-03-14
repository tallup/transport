<?php

namespace App\Notifications\Admin;

use App\Models\StudentAbsence;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentAbsenceAlert extends Notification
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

        return (new MailMessage)
            ->subject("Absence Reported: {$student->name} ({$date})")
            ->greeting("Hello Admin,")
            ->line("A student absence has been reported.")
            ->line("Student: {$student->name}")
            ->line("Date: {$date}")
            ->line("Period: {$period}")
            ->line("Reason: " . ($this->absence->reason ?: 'No reason provided'))
            ->action('View Student', route('filament.admin.resources.students.view', $student->id))
            ->line('The driver has also been notified.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'student_absence',
            'student_name' => $this->absence->student->name,
            'absence_date' => $this->absence->absence_date->toDateString(),
            'period' => $this->absence->period,
            'reason' => $this->absence->reason,
            'url' => '#' // Add actual URL if exists in Filament
        ];
    }
}
