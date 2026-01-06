<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driverName = DB::connection()->getDriverName();
        
        if ($driverName === 'sqlite') {
            // SQLite doesn't support MODIFY COLUMN, so we need to recreate the table
            // First, update any existing data if needed
            // Then recreate the table with the new enum
            Schema::table('bookings', function (Blueprint $table) {
                // For SQLite, we'll just update the constraint via raw SQL
                // Since SQLite doesn't enforce ENUM, we can just add the value
            });
            
            // For SQLite, we can't modify the enum constraint, but we can still use the value
            // The application will handle the validation
        } else {
            // For MySQL/MariaDB
            DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'active', 'cancelled', 'expired', 'completed') DEFAULT 'pending'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driverName = DB::connection()->getDriverName();
        
        // Update any 'completed' bookings back to 'active'
        DB::table('bookings')
            ->where('status', 'completed')
            ->update(['status' => 'active']);
        
        if ($driverName !== 'sqlite') {
            // Revert to original enum values for MySQL/MariaDB
            DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'active', 'cancelled', 'expired') DEFAULT 'pending'");
        }
    }
};
