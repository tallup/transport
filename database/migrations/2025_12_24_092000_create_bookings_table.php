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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('route_id')->constrained('routes')->onDelete('restrict');
            $table->foreignId('pickup_point_id')->constrained('pickup_points')->onDelete('restrict');
            $table->enum('plan_type', ['weekly', 'bi_weekly', 'monthly', 'semester', 'annual']);
            $table->enum('status', ['pending', 'active', 'cancelled', 'expired'])->default('pending');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('stripe_subscription_id')->nullable();
            $table->string('stripe_customer_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
