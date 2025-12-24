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
     */
    public function handle()
    {
        $name = $this->option('name') ?: $this->ask('Enter admin name', 'Super Admin');
        $email = $this->option('email') ?: $this->ask('Enter admin email');
        $password = $this->option('password') ?: $this->secret('Enter admin password (leave empty to generate)');

        if (empty($password)) {
            $password = Str::random(12);
            $this->info("Generated password: {$password}");
        }

        if (User::where('email', $email)->exists()) {
            $this->error("User with email {$email} already exists!");
            return Command::FAILURE;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $this->info("Super admin created successfully!");
        $this->info("Email: {$email}");
        if (!$this->option('password')) {
            $this->warn("Please save this password: {$password}");
        }

        return Command::SUCCESS;
    }
}
