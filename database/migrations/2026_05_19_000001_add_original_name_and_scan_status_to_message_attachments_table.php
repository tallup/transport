<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('message_attachments', function (Blueprint $table) {
            $table->string('original_name')->nullable()->after('file_name');
            $table->string('scan_status')->default('pending')->after('mime_type');
        });
    }

    public function down(): void
    {
        Schema::table('message_attachments', function (Blueprint $table) {
            $table->dropColumn(['original_name', 'scan_status']);
        });
    }
};
