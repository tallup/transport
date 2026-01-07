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
        // Add indexes to bookings table
        Schema::table('bookings', function (Blueprint $table) {
            // route_id already has index from foreign key, but add composite indexes
            $table->index('status', 'bookings_status_index');
            $table->index('start_date', 'bookings_start_date_index');
            $table->index('end_date', 'bookings_end_date_index');
            $table->index(['route_id', 'status'], 'bookings_route_status_index');
            $table->index(['student_id', 'status'], 'bookings_student_status_index');
            $table->index(['status', 'start_date'], 'bookings_status_start_date_index');
        });

        // Add indexes to students table
        Schema::table('students', function (Blueprint $table) {
            // parent_id already has index from foreign key
            $table->index('school_id', 'students_school_id_index');
            $table->index(['parent_id', 'school_id'], 'students_parent_school_index');
        });

        // Add indexes to routes table
        Schema::table('routes', function (Blueprint $table) {
            // driver_id and vehicle_id already have indexes from foreign keys
            $table->index('active', 'routes_active_index');
            $table->index(['active', 'driver_id'], 'routes_active_driver_index');
        });

        // Add indexes to pricing_rules table
        Schema::table('pricing_rules', function (Blueprint $table) {
            $table->index(['plan_type', 'active'], 'pricing_rules_plan_active_index');
            $table->index(['route_id', 'plan_type', 'active'], 'pricing_rules_route_plan_active_index');
        });

        // Add indexes to calendar_events table
        Schema::table('calendar_events', function (Blueprint $table) {
            $table->index('date', 'calendar_events_date_index');
            $table->index(['date', 'type'], 'calendar_events_date_type_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_status_index');
            $table->dropIndex('bookings_start_date_index');
            $table->dropIndex('bookings_end_date_index');
            $table->dropIndex('bookings_route_status_index');
            $table->dropIndex('bookings_student_status_index');
            $table->dropIndex('bookings_status_start_date_index');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex('students_school_id_index');
            $table->dropIndex('students_parent_school_index');
        });

        Schema::table('routes', function (Blueprint $table) {
            $table->dropIndex('routes_active_index');
            $table->dropIndex('routes_active_driver_index');
        });

        Schema::table('pricing_rules', function (Blueprint $table) {
            $table->dropIndex('pricing_rules_plan_active_index');
            $table->dropIndex('pricing_rules_route_plan_active_index');
        });

        Schema::table('calendar_events', function (Blueprint $table) {
            $table->dropIndex('calendar_events_date_index');
            $table->dropIndex('calendar_events_date_type_index');
        });
    }
};
