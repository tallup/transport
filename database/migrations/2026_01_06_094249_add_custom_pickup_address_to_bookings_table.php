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
        Schema::table('bookings', function (Blueprint $table) {
            // Make pickup_point_id nullable to allow custom addresses
            $table->foreignId('pickup_point_id')->nullable()->change();
            
            // Add custom pickup address fields
            $table->text('pickup_address')->nullable()->after('pickup_point_id');
            $table->decimal('pickup_latitude', 10, 8)->nullable()->after('pickup_address');
            $table->decimal('pickup_longitude', 11, 8)->nullable()->after('pickup_latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Drop custom pickup fields
            $table->dropColumn(['pickup_address', 'pickup_latitude', 'pickup_longitude']);
            
            // Note: We can't easily revert pickup_point_id to NOT NULL if there are null values
            // This would need manual data cleanup first
        });
    }
};
