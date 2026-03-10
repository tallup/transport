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
     */
    public function handle()
    {
        $name = $this->option('name') ?: $this->ask('Enter admin name', 'Super Admin');
        $email = $this->option('email') ?: $this->ask('Enter admin email');
        $passwordOption = $this->option('password');
        $password = $passwordOption ?: $this->secret('Enter admin password (leave empty to generate or to only upgrade role)');

        $existing = User::where('email', $email)->first();

        if ($existing) {
            $existing->update(['role' => 'super_admin']);
            if ($password !== null && $password !== '') {
                $existing->update(['password' => Hash::make($password)]);
                $this->info("Password updated.");
            }
            $this->info("User {$email} is now super admin.");
            return Command::SUCCESS;
        }

        if (empty($password)) {
            $password = Str::random(12);
            $this->info("Generated password: {$password}");
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $this->info("Super admin created successfully!");
        $this->info("Email: {$email}");
        if (!$passwordOption) {
            $this->warn("Please save this password: {$password}");
        }

        return Command::SUCCESS;
    }
}
