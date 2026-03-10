<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();
        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'awaiting_approval', 'active', 'cancelled', 'expired', 'completed') DEFAULT 'pending'");
        }
        // SQLite/PostgreSQL: status is already a string column; 'awaiting_approval' is valid. No schema change needed.
    }

    public function down(): void
    {
        $driver = DB::connection()->getDriverName();
        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'active', 'cancelled', 'expired', 'completed') DEFAULT 'pending'");
        }
    }
};

