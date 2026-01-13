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
            // Get the database name
            $databaseName = DB::connection()->getDatabaseName();
            
            // Get foreign key constraint names
            $foreignKeys = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = 'route_completions' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ", [$databaseName]);

            // Drop foreign key constraints
            foreach ($foreignKeys as $fk) {
                $constraintName = $fk->CONSTRAINT_NAME;
                try {
                    DB::statement("ALTER TABLE `route_completions` DROP FOREIGN KEY `{$constraintName}`");
                } catch (\Exception $e) {
                    // If constraint doesn't exist or already dropped, continue
                    \Log::warning("Could not drop foreign key constraint {$constraintName}: " . $e->getMessage());
                }
            }
        }

        // Drop the old unique constraint
        // Use try-catch to handle cases where it might not exist
        try {
            Schema::table('route_completions', function (Blueprint $table) {
                $table->dropUnique('unique_route_driver_date');
            });
        } catch (\Exception $e) {
            // If unique constraint doesn't exist, try dropping via raw SQL
            if ($driverName === 'mysql' || $driverName === 'mariadb') {
                try {
                    DB::statement('ALTER TABLE `route_completions` DROP INDEX `unique_route_driver_date`');
                } catch (\Exception $e2) {
                    \Log::warning("Could not drop unique index unique_route_driver_date: " . $e2->getMessage());
                }
            }
        }

        // Add the new columns
        Schema::table('route_completions', function (Blueprint $table) use ($driverName) {
            // Check if period column already exists
            if (!Schema::hasColumn('route_completions', 'period')) {
                // Add period field
                if ($driverName === 'mysql' || $driverName === 'mariadb') {
                    $table->enum('period', ['am', 'pm'])->default('am')->after('completion_date');
                } elseif ($driverName === 'pgsql') {
                    $table->string('period')->default('am')->after('completion_date');
                } else {
                    // SQLite - use string type
                    $table->string('period')->default('am')->after('completion_date');
                }
            }

            // Check if review column already exists
            if (!Schema::hasColumn('route_completions', 'review')) {
                // Add review field (keeping notes for backward compatibility)
                $table->text('review')->nullable()->after('notes');
            }
        });

        // Update existing records to have period = 'am' (default)
        DB::table('route_completions')->whereNull('period')->update(['period' => 'am']);

        // Re-add foreign key constraints for MySQL/MariaDB
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            // Check if foreign keys already exist before adding
            $existingFks = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = 'route_completions' 
                AND COLUMN_NAME = 'route_id' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ", [DB::connection()->getDatabaseName()]);

            if (empty($existingFks)) {
                Schema::table('route_completions', function (Blueprint $table) {
                    $table->foreign('route_id')->references('id')->on('routes')->onDelete('cascade');
                });
            }

            $existingFks = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = 'route_completions' 
                AND COLUMN_NAME = 'driver_id' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ", [DB::connection()->getDatabaseName()]);

            if (empty($existingFks)) {
                Schema::table('route_completions', function (Blueprint $table) {
                    $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
                });
            }
        }

        // Re-add unique constraint with period included
        // Check if it already exists first
        $indexExists = DB::select("
            SELECT COUNT(*) as count 
            FROM information_schema.statistics 
            WHERE table_schema = ? 
            AND table_name = 'route_completions' 
            AND index_name = 'unique_route_driver_date_period'
        ", [DB::connection()->getDatabaseName()]);

        if (isset($indexExists[0]) && $indexExists[0]->count == 0) {
            Schema::table('route_completions', function (Blueprint $table) {
                $table->unique(['route_id', 'driver_id', 'completion_date', 'period'], 'unique_route_driver_date_period');
            });
        }
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
