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

        // Update existing data first - change 'semester' to 'academic_term'
        DB::table('bookings')
            ->where('plan_type', 'semester')
            ->update(['plan_type' => 'academic_term']);

        DB::table('pricing_rules')
            ->where('plan_type', 'semester')
            ->update(['plan_type' => 'academic_term']);

        // For MySQL/MariaDB, modify the enum
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            DB::statement("ALTER TABLE bookings MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual')");
            DB::statement("ALTER TABLE pricing_rules MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual')");
        } elseif ($driverName === 'pgsql') {
            // PostgreSQL enum modification
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
            
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual') USING plan_type::text::plan_type");
        }
        // For SQLite, the enum constraint is not enforced, so data update is sufficient
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driverName = DB::connection()->getDriverName();

        // Revert data first
        DB::table('bookings')
            ->where('plan_type', 'academic_term')
            ->update(['plan_type' => 'semester']);

        DB::table('pricing_rules')
            ->where('plan_type', 'academic_term')
            ->update(['plan_type' => 'semester']);

        // For MySQL/MariaDB, revert the enum
        if ($driverName === 'mysql' || $driverName === 'mariadb') {
            DB::statement("ALTER TABLE bookings MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual')");
            DB::statement("ALTER TABLE pricing_rules MODIFY COLUMN plan_type ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual')");
        } elseif ($driverName === 'pgsql') {
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE bookings ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual') USING plan_type::text::plan_type");
            
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE VARCHAR(20)");
            DB::statement("ALTER TABLE pricing_rules ALTER COLUMN plan_type TYPE ENUM('weekly', 'bi_weekly', 'monthly', 'semester', 'annual') USING plan_type::text::plan_type");
        }
    }
};
