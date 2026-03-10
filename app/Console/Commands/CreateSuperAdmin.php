<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create-super-admin {--name=} {--email=} {--password=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a super admin user';

    /**
     * Execute the console command.
     * If the email already exists, that user is upgraded to super_admin (password optional).
     * When --email is provided, the command does not prompt (safe for Forge/cron).
     */
    public function handle()
    {
        $email = $this->option('email');

        if (empty($email)) {
            $this->error('Email is required. Run with --email=support@ontimetransportwa.com');
            return Command::FAILURE;
        }

        $email = strtolower(trim($email));
        $name = $this->option('name') ?: 'Super Admin';
        $passwordOption = $this->option('password');
        $password = $passwordOption ?: null;

        $existing = User::where('email', $email)->first();

        if ($existing) {
            $existing->update(['role' => 'super_admin', 'name' => $name]);
            if ($password !== null && $password !== '') {
                $existing->update(['password' => Hash::make($password)]);
                $this->info('Password updated.');
            }
            $this->info("User {$email} is now super admin.");
            return Command::SUCCESS;
        }

        if (empty($password)) {
            $password = Str::random(12);
            $this->line("Generated password: {$password}");
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $this->info('Super admin created successfully.');
        $this->info("Email: {$email}");
        if (!$passwordOption) {
            $this->warn("Save this password: {$password}");
        }

        return Command::SUCCESS;
    }
}
