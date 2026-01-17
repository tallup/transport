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
     * Send notification to all admins
     */
    public function notifyAdmins($notification)
    {
        $admins = $this->getAdmins();
        
        if ($admins->isEmpty()) {
            \Log::warning('No admin users found to send notification', [
                'notification_class' => get_class($notification)
            ]);
            return;
        }
        
        // Filter out users without valid emails
        $admins = $admins->filter(function ($admin) {
            return filter_var($admin->email, FILTER_VALIDATE_EMAIL);
        });
        
        if ($admins->isEmpty()) {
            \Log::warning('No admin users with valid email addresses', [
                'notification_class' => get_class($notification)
            ]);
            return;
        }
        
        try {
            Notification::send($admins, $notification);
            \Log::info('Admin notification sent successfully', [
                'notification_class' => get_class($notification),
                'admin_count' => $admins->count(),
                'admin_emails' => $admins->pluck('email')->toArray()
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send admin notification', [
                'notification_class' => get_class($notification),
                'error' => $e->getMessage(),
                'admin_emails' => $admins->pluck('email')->toArray()
            ]);
        }
    }
}

