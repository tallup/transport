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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'registration_approved_at')) {
                $table->timestamp('registration_approved_at')->nullable()->after('is_active');
            }
        });

        // Existing parents should remain approved
        DB::table('users')
            ->where('role', 'parent')
            ->whereNull('registration_approved_at')
            ->update(['registration_approved_at' => DB::raw('created_at')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'registration_approved_at')) {
                $table->dropColumn('registration_approved_at');
            }
        });
    }
};
