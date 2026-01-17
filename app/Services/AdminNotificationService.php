<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Notification;

class AdminNotificationService
{
    /**
     * Get all admin users
     */
    public function getAdmins()
    {
        return User::where('role', 'admin')->get();
    }

    /**
     * Send notification to all admins
     */
    public function notifyAdmins($notification)
    {
        $admins = $this->getAdmins();
        
        if ($admins->isEmpty()) {
            \Log::warning('No admin users found to send notification');
            return;
        }
        
        Notification::send($admins, $notification);
    }
}

