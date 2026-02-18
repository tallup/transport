<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Notification;

class AdminNotificationService
{
    /**
     * Get all admin users (including super_admin and transport_admin)
     */
    public function getAdmins()
    {
        return User::whereIn('role', ['admin', 'super_admin', 'transport_admin'])
            ->whereNotNull('email')
            ->get();
    }

    /**
     * Send notification to all admins and optionally to ADMIN_NOTIFICATION_EMAIL.
     * Set ADMIN_NOTIFICATION_EMAIL in .env (e.g. support@ontimetransportwa.com) so that
     * address always receives admin notifications even if no admin user exists in the DB.
     */
    public function notifyAdmins($notification)
    {
        $admins = $this->getAdmins();
        $admins = $admins->filter(function ($admin) {
            return filter_var($admin->email, FILTER_VALIDATE_EMAIL);
        });

        $adminEmails = $admins->pluck('email')->toArray();
        $copyEmail = config('mail.admin_notification_email');

        if ($admins->isEmpty() && empty($copyEmail)) {
            \Log::warning('No admin users with valid email and no ADMIN_NOTIFICATION_EMAIL set', [
                'notification_class' => get_class($notification),
            ]);
            return;
        }

        try {
            if ($admins->isNotEmpty()) {
                Notification::send($admins, $notification);
            }
            // Always send a copy to the configured admin inbox so support@ gets every admin alert
            if (!empty($copyEmail) && filter_var($copyEmail, FILTER_VALIDATE_EMAIL)) {
                Notification::route('mail', $copyEmail)->notify($notification);
            }
            \Log::info('Admin notification sent', [
                'notification_class' => get_class($notification),
                'admin_count' => $admins->count(),
                'admin_emails' => $adminEmails,
                'copy_to' => $copyEmail ?: null,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send admin notification', [
                'notification_class' => get_class($notification),
                'error' => $e->getMessage(),
                'admin_emails' => $adminEmails,
            ]);
            throw $e;
        }
    }
}

