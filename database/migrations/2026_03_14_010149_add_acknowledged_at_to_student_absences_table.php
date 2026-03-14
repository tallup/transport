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
        Schema::table('student_absences', function (Blueprint $table) {
            $table->timestamp('acknowledged_at')->nullable()->after('reported_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_absences', function (Blueprint $table) {
            $table->dropColumn('acknowledged_at');
        });
    }
};
