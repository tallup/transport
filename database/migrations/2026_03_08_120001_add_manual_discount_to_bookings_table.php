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
        if (!Schema::hasColumn('bookings', 'manual_discount_type')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->string('manual_discount_type', 20)->nullable()->after('paypal_order_id'); // 'percentage' or 'fixed'
                $table->decimal('manual_discount_value', 10, 2)->nullable()->after('manual_discount_type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['manual_discount_type', 'manual_discount_value']);
        });
    }
};
