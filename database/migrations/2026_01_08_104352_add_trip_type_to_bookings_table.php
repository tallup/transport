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
            // SQLite doesn't support adding enum columns directly
            // We'll add it as a string column with a check constraint
            Schema::table('bookings', function (Blueprint $table) {
                $table->string('trip_type')->default('two_way')->after('plan_type');
            });

            // Add check constraint via raw SQL
            DB::statement("ALTER TABLE bookings ADD CONSTRAINT bookings_trip_type_check CHECK (trip_type IN ('one_way', 'two_way'))");
        } else {
            Schema::table('bookings', function (Blueprint $table) {
                $table->enum('trip_type', ['one_way', 'two_way'])->default('two_way')->after('plan_type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('trip_type');
        });
    }
};
