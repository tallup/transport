<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class VerifyUserEmail extends Command
{
    protected $signature = 'user:verify-email {email : The user email to mark as verified}';

    protected $description = 'Mark a user\'s email as verified so they can log in (e.g. support@ontimetransportwa.com)';

    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email')));

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return Command::FAILURE;
        }

        if ($user->hasVerifiedEmail()) {
            $this->info("{$email} is already verified.");
            return Command::SUCCESS;
        }

        $user->forceFill(['email_verified_at' => now()])->save();
        $this->info("{$email} has been marked as verified. They can log in now.");

        return Command::SUCCESS;
    }
}
