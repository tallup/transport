<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_threads', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // booking, route, direct
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('route_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('participant_1_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('participant_2_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->index(['participant_1_id', 'participant_2_id']);
            $table->index('booking_id');
            $table->index('route_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_threads');
    }
};
