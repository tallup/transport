<?php

namespace App\Notifications\Parent;

use App\Models\StudentAbsence;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AbsenceAcknowledged extends Notification implements ShouldQueue
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
        $routeName = $this->absence->booking->route->name ?? 'the school route';

        return (new MailMessage)
            ->subject("Absence Acknowledged: {$student->name}")
            ->greeting("Hello " . ($notifiable->name ?: 'Parent') . ",")
            ->line("The driver for {$routeName} has acknowledged your child's absence for {$date} ({$period}).")
            ->line("This confirms they are aware and will not stop for pickup during the specified time.")
            ->action('View My Students', route('parent.students.index'))
            ->line('Thank you for keeping us informed!');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'absence_acknowledged',
            'student_name' => $this->absence->student->name,
            'absence_date' => $this->absence->absence_date->toDateString(),
            'period' => $this->absence->period,
            'acknowledged_at' => now()->toDateTimeString(),
            'url' => route('parent.absences.index')
        ];
    }
}
