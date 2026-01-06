<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class UpdateUserRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:update-role {email} {role}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update a user\'s role (super_admin, transport_admin, driver, parent)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $role = $this->argument('role');

        $validRoles = ['super_admin', 'transport_admin', 'driver', 'parent'];
        
        if (!in_array($role, $validRoles)) {
            $this->error("Invalid role. Must be one of: " . implode(', ', $validRoles));
            return 1;
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }

        $oldRole = $user->role;
        $user->role = $role;
        $user->save();

        $this->info("User '{$user->name}' ({$email}) role updated from '{$oldRole}' to '{$role}'.");
        
        return 0;
    }
}




