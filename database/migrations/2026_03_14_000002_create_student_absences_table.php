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
        Schema::create('student_absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->date('absence_date');
            $table->enum('period', ['am', 'pm', 'both'])->default('both');
            $table->string('reason')->nullable();
            $table->foreignId('reported_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['booking_id', 'absence_date', 'period'], 'unique_absence');
        });

        // Add status to daily_pickups to distinguish between completed, no_show, etc.
        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->string('status')->default('completed')->after('period'); // completed, no_show, parent_reported_absent
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_absences');

        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
