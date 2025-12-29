<?php

namespace Database\Seeders;

use App\Models\Policy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $policies = [
            [
                'title' => 'Pickup Policy',
                'content' => "• Children must be ready at the scheduled pick-up time.\n• Drivers will wait a maximum of 3 minutes.\n• Parents must notify the business of absences at least 1 hour before pick-up.",
                'category' => 'transport',
                'order' => 1,
                'active' => true,
            ],
            [
                'title' => 'Safety Requirements',
                'content' => "• Seat belts must be worn at all times.\n• No eating in the vehicle.\n• Repeated unsafe behavior may result in suspension from service.",
                'category' => 'safety',
                'order' => 1,
                'active' => true,
            ],
            [
                'title' => 'Payment Policy',
                'content' => "• Payments are due as specified in your booking agreement.\n• Late payment fees may apply.\n• Late pick-up fees may apply depending on the schedule.",
                'category' => 'payment',
                'order' => 1,
                'active' => true,
            ],
            [
                'title' => 'Service Information',
                'content' => "Transportation is pre-arranged only and not an on-demand service. All bookings must be made in advance through the parent portal.",
                'category' => 'general',
                'order' => 1,
                'active' => true,
            ],
        ];

        foreach ($policies as $policy) {
            Policy::firstOrCreate(
                ['title' => $policy['title'], 'category' => $policy['category']],
                $policy
            );
        }
    }
}
