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
        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->timestamp('arrived_at')->nullable()->after('completed_at');
            $table->timestamp('departed_at')->nullable()->after('arrived_at');
            $table->json('checkpoints')->nullable()->after('departed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_pickups', function (Blueprint $table) {
            $table->dropColumn(['arrived_at', 'departed_at', 'checkpoints']);
        });
    }
};
