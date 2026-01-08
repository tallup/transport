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

        // For MySQL/MariaDB, first add 'academic_term' to the enum, then update data
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            // First, add 'academic_term' to the enum (keeping 'semester' temporarily)
            DB::statement("ALTER TABLE bookings MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'academic_term', 'annual')");
            DB::statement("ALTER TABLE pricing_rules MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'academic_term', 'annual')");
            
            // Now update existing data from 'semester' to 'academic_term'
            DB::table('bookings')
                ->where('plan_type', 'semester')
                ->update(['plan_type' => 'academic_term']);

            DB::table('pricing_rules')
                ->where('plan_type', 'semester')
                ->update(['plan_type' => 'academic_term']);
            
            // Note: MySQL doesn't support removing enum values directly, 
            // but 'semester' will no longer be used in new records
            // We can optionally recreate the enum without 'semester' if needed, but it requires more complex migration
        } elseif ($driverName === 'pgsql') {
            // PostgreSQL enum modification - convert to VARCHAR, update data, then convert to new ENUM
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::table('bookings')
                ->where('plan_type', 'semester')
                ->update(['plan_type' => 'academic_term']);
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
            
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::table('pricing_rules')
                ->where('plan_type', 'semester')
                ->update(['plan_type' => 'academic_term']);
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
        } else {
            // For SQLite, CHECK constraints prevent direct updates
            // SQLite doesn't support modifying CHECK constraints without recreating tables
            // We'll attempt to update, but if CHECK constraints exist and are enforced,
            // the update will fail and manual intervention may be required
            // For development environments, you may need to manually update the data
            // or recreate the tables with the new enum values
            
            try {
                DB::statement('PRAGMA foreign_keys=OFF');
                DB::statement("UPDATE bookings SET plan_type = 'academic_term' WHERE plan_type = 'semester'");
                DB::statement("UPDATE pricing_rules SET plan_type = 'academic_term' WHERE plan_type = 'semester'");
                DB::statement('PRAGMA foreign_keys=ON');
            } catch (\Exception $e) {
                DB::statement('PRAGMA foreign_keys=ON');
                // If CHECK constraint prevents update, log warning but don't fail migration
                // Manual data update may be required for SQLite
                \Log::warning('SQLite CHECK constraint prevented plan_type update. Manual intervention may be required: ' . $e->getMessage());
            }
            
            // Note: If CHECK constraints are enforced in SQLite, the column definition
            // won't be updated automatically. Application-level validation will ensure
            // only valid values are used going forward, but existing 'semester' values
            // in the database will need to be manually updated or tables recreated.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driverName = DB::connection()->getDriverName();

        // For MySQL/MariaDB, first add 'semester' back to enum if needed, then revert data
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            // Revert data first (while both values exist in enum)
            DB::table('bookings')
                ->where('plan_type', 'academic_term')
                ->update(['plan_type' => 'semester']);

            DB::table('pricing_rules')
                ->where('plan_type', 'academic_term')
                ->update(['plan_type' => 'semester']);
            
            // Revert enum back to original (keeping 'semester', removing 'academic_term')
            DB::statement("ALTER TABLE bookings MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual')");
            DB::statement("ALTER TABLE pricing_rules MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual')");
        } elseif ($driverName === 'pgsql') {
            // Revert data
            DB::table('bookings')
                ->where('plan_type', 'academic_term')
                ->update(['plan_type' => 'semester']);

            DB::table('pricing_rules')
                ->where('plan_type', 'academic_term')
                ->update(['plan_type' => 'semester']);
            
            // Revert enum
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual') USING plan_type::text::plan_type");
            
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual') USING plan_type::text::plan_type");
        } else {
            // For SQLite, just revert data
            DB::table('bookings')
                ->where('plan_type', 'academic_term')
                ->update(['plan_type' => 'semester']);

            DB::table('pricing_rules')
                ->where('plan_type', 'academic_term')
                ->update(['plan_type' => 'semester']);
        }
    }
};
