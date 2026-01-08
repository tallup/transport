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

        // Check if column already exists (in case of migration retry)
        if (!Schema::hasColumn('bookings', 'trip_type')) {
            if ($driverName === 'sqlite') {
                // SQLite doesn't support adding enum columns or CHECK constraints via ALTER TABLE
                // We'll add it as a string column - application validation will enforce valid values
                Schema::table('bookings', function (Blueprint $table) {
                    $table->string('trip_type')->default('two_way')->after('plan_type');
                });
            } else {
                Schema::table('bookings', function (Blueprint $table) {
                    $table->enum('trip_type', ['one_way', 'two_way'])->default('two_way')->after('plan_type');
                });
            }
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
