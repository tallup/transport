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

        // For MySQL/MariaDB, update existing 'bi_weekly' records first, then modify enum
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            // Update existing bookings from 'bi_weekly' to 'weekly'
            DB::table('bookings')
                ->where('plan_type', 'bi_weekly')
                ->update(['plan_type' => 'weekly']);

            // Update existing pricing_rules from 'bi_weekly' to 'weekly'
            DB::table('pricing_rules')
                ->where('plan_type', 'bi_weekly')
                ->update(['plan_type' => 'weekly']);
            
            // Now modify the enum to remove 'bi_weekly'
            DB::statement("ALTER TABLE bookings MODIFY COLUMN plan_type ENUM('weekly', 'monthly', 'academic_term', 'annual')");
            DB::statement("ALTER TABLE pricing_rules MODIFY COLUMN plan_type ENUM('weekly', 'monthly', 'academic_term', 'annual')");
        } elseif ($driverName === 'pgsql') {
            // PostgreSQL enum modification - convert to VARCHAR, update data, then convert to new ENUM
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::table('bookings')
                ->where('plan_type', 'bi_weekly')
                ->update(['plan_type' => 'weekly']);
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE ENUM('weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
            
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::table('pricing_rules')
                ->where('plan_type', 'bi_weekly')
                ->update(['plan_type' => 'weekly']);
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE ENUM('weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
        } else {
            // For SQLite, CHECK constraints prevent direct updates
            // SQLite doesn't support modifying CHECK constraints without recreating tables
            // We'll attempt to update, but if CHECK constraints exist and are enforced,
            // the update will fail and manual intervention may be required
            
            try {
                DB::statement('PRAGMA foreign_keys=OFF');
                DB::statement("UPDATE bookings SET plan_type = 'weekly' WHERE plan_type = 'bi_weekly'");
                DB::statement("UPDATE pricing_rules SET plan_type = 'weekly' WHERE plan_type = 'bi_weekly'");
                DB::statement('PRAGMA foreign_keys=ON');
            } catch (\Exception $e) {
                DB::statement('PRAGMA foreign_keys=ON');
                // If CHECK constraint prevents update, log warning but don't fail migration
                \Log::warning('SQLite CHECK constraint prevented plan_type update. Manual intervention may be required: ' . $e->getMessage());
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driverName = DB::connection()->getDriverName();

        // For MySQL/MariaDB, add 'bi_weekly' back to enum
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            // Add 'bi_weekly' back to enum (won't restore previous data)
            DB::statement("ALTER TABLE bookings MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual')");
            DB::statement("ALTER TABLE pricing_rules MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual')");
        } elseif ($driverName === 'pgsql') {
            // Add 'bi_weekly' back to enum
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
            
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
        } else {
            // For SQLite, enum is just a CHECK constraint
            // No action needed - application-level validation will allow 'bi_weekly' again
        }
    }
};
