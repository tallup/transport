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

        Schema::create('daily_pickups', function (Blueprint $table) use ($driverName) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->foreignId('route_id')->constrained('routes')->onDelete('cascade');
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->date('pickup_date');
            $table->foreignId('pickup_point_id')->nullable()->constrained('pickup_points')->onDelete('set null');
            $table->timestamp('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            if ($driverName === 'mysql' || $driverName === 'mariadb') {
                $table->enum('period', ['am', 'pm'])->default('am');
            } elseif ($driverName === 'pgsql') {
                $table->string('period')->default('am');
            } else {
                // SQLite - use string type
                $table->string('period')->default('am');
            }

            // Unique constraint: one pickup per booking per day per period
            $table->unique(['booking_id', 'pickup_date', 'period'], 'unique_booking_date_period');
            
            // Indexes for performance
            $table->index(['route_id', 'pickup_date', 'period']);
            $table->index(['driver_id', 'pickup_date', 'period']);
            $table->index('pickup_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_pickups');
    }
};
