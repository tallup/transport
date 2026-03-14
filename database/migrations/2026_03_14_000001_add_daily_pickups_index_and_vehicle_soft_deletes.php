<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add daily_pickups composite index (recommended in 6.3)
        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->index(['booking_id', 'pickup_date', 'period'], 'daily_pickups_booking_date_period_index');
        });

        // Add soft_deleted_at to vehicles table (recommended in 5.2)
        if (!Schema::hasColumn('vehicles', 'deleted_at')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->dropIndex('daily_pickups_booking_date_period_index');
        });

        if (Schema::hasColumn('vehicles', 'deleted_at')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
