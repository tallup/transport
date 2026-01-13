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

        // For MySQL/MariaDB, we need to drop foreign key constraints first
        // because they might be using the unique index
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            // Get foreign key constraint names
            $foreignKeys = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'route_completions' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ");

            // Drop foreign key constraints
            foreach ($foreignKeys as $fk) {
                $constraintName = $fk->CONSTRAINT_NAME;
                DB::statement("ALTER TABLE route_completions DROP FOREIGN KEY {$constraintName}");
            }
        }

        // Drop the old unique constraint
        Schema::table('route_completions', function (Blueprint $table) use ($driverName) {
            $table->dropUnique('unique_route_driver_date');
        });

        // Add the new columns
        Schema::table('route_completions', function (Blueprint $table) use ($driverName) {
            // Add period field
            if ($driverName === 'mysql' || $driverName === 'mariadb') {
                $table->enum('period', ['am', 'pm'])->default('am')->after('completion_date');
            } elseif ($driverName === 'pgsql') {
                $table->string('period')->default('am')->after('completion_date');
            } else {
                // SQLite - use string type
                $table->string('period')->default('am')->after('completion_date');
            }

            // Add review field (keeping notes for backward compatibility)
            $table->text('review')->nullable()->after('notes');
        });

        // Update existing records to have period = 'am' (default)
        DB::table('route_completions')->whereNull('period')->update(['period' => 'am']);

        // Re-add foreign key constraints for MySQL/MariaDB
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            Schema::table('route_completions', function (Blueprint $table) {
                $table->foreign('route_id')->references('id')->on('routes')->onDelete('cascade');
                $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // Re-add unique constraint with period included
        Schema::table('route_completions', function (Blueprint $table) {
            $table->unique(['route_id', 'driver_id', 'completion_date', 'period'], 'unique_route_driver_date_period');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('route_completions', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique('unique_route_driver_date_period');

            // Remove the fields
            $table->dropColumn(['period', 'review']);

            // Re-add the old unique constraint
            $table->unique(['route_id', 'driver_id', 'completion_date'], 'unique_route_driver_date');
        });
    }
};
