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
        if (Schema::hasTable('routes') && !Schema::hasColumn('routes', 'service_type')) {
            Schema::table('routes', function (Blueprint $table) {
                $table->enum('service_type', ['am', 'pm', 'both'])->default('both')->after('capacity');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('routes') && Schema::hasColumn('routes', 'service_type')) {
            Schema::table('routes', function (Blueprint $table) {
                $table->dropColumn('service_type');
            });
        }
    }
};







