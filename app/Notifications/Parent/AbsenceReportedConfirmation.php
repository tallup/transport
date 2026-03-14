<?php

namespace App\Notifications\Parent;

use App\Models\StudentAbsence;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AbsenceReportedConfirmation extends Notification
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
            ->subject("Absence Report Confirmation: {$student->name}")
            ->greeting("Hello " . $notifiable->name . ",")
            ->line("We have received your absence report for {$student->name}.")
            ->line("Date: {$date}")
            ->line("Period: {$period}")
            ->line("Driver and administration have been notified.")
            ->line("The driver will acknowledge seeing this report soon.")
            ->action('View My Absence Reports', route('parent.absences.index'))
            ->line('Thank you for keeping us informed.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'absence_reported',
            'student_name' => $this->absence->student->name,
            'absence_date' => $this->absence->absence_date->toDateString(),
            'period' => $this->absence->period,
            'url' => route('parent.absences.index')
        ];
    }
}
