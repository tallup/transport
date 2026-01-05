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
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'route_id')) {
                $table->foreignId('route_id')->nullable()->after('grade')->constrained('routes')->nullOnDelete();
            }
            if (!Schema::hasColumn('students', 'pickup_point_id')) {
                $table->foreignId('pickup_point_id')->nullable()->after('route_id')->constrained('pickup_points')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'pickup_point_id')) {
                $table->dropForeign(['pickup_point_id']);
                $table->dropColumn('pickup_point_id');
            }
            if (Schema::hasColumn('students', 'route_id')) {
                $table->dropForeign(['route_id']);
                $table->dropColumn('route_id');
            }
        });
    }
};
