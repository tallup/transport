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
        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'dropoff_point_id')) {
                $table->foreignId('dropoff_point_id')->nullable()->after('pickup_point_id')->constrained('pickup_points')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'dropoff_point_id')) {
                $table->dropForeign(['dropoff_point_id']);
                $table->dropColumn('dropoff_point_id');
            }
        });
    }
};
