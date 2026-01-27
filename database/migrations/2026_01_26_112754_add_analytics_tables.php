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
        // Create driver_performance_metrics table for cached metrics
        Schema::create('driver_performance_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->date('metric_date');
            $table->integer('total_routes')->default(0);
            $table->integer('total_bookings')->default(0);
            $table->integer('total_completions')->default(0);
            $table->integer('total_pickups')->default(0);
            $table->integer('on_time_pickups')->default(0);
            $table->decimal('on_time_rate', 5, 2)->default(0);
            $table->decimal('avg_completion_time_minutes', 10, 2)->nullable();
            $table->timestamps();

            $table->unique(['driver_id', 'metric_date']);
            $table->index('metric_date');
        });

        // Create route_efficiency_metrics table for cached route stats
        Schema::create('route_efficiency_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('route_id')->constrained('routes')->onDelete('cascade');
            $table->date('metric_date');
            $table->integer('active_bookings')->default(0);
            $table->decimal('utilization_percent', 5, 2)->default(0);
            $table->integer('pickup_points_count')->default(0);
            $table->decimal('avg_bookings_per_day', 10, 2)->default(0);
            $table->decimal('avg_pickups_per_day', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['route_id', 'metric_date']);
            $table->index('metric_date');
        });

        // Add indexes for performance
        Schema::table('bookings', function (Blueprint $table) {
            $table->index(['route_id', 'status']);
            $table->index(['student_id', 'status']);
            $table->index(['created_at', 'status']);
            $table->index('start_date');
            $table->index('end_date');
        });

        Schema::table('routes', function (Blueprint $table) {
            $table->index(['driver_id', 'active']);
            $table->index('active');
        });

        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->index(['driver_id', 'pickup_date']);
            $table->index(['route_id', 'pickup_date']);
            $table->index('pickup_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove indexes
        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->dropIndex(['driver_id', 'pickup_date']);
            $table->dropIndex(['route_id', 'pickup_date']);
            $table->dropIndex(['pickup_date']);
        });

        Schema::table('routes', function (Blueprint $table) {
            $table->dropIndex(['driver_id', 'active']);
            $table->dropIndex(['active']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['route_id', 'status']);
            $table->dropIndex(['student_id', 'status']);
            $table->dropIndex(['created_at', 'status']);
            $table->dropIndex(['start_date']);
            $table->dropIndex(['end_date']);
        });

        // Drop analytics tables
        Schema::dropIfExists('route_efficiency_metrics');
        Schema::dropIfExists('driver_performance_metrics');
    }
};
