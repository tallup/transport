<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Original migration used string() (VARCHAR 255). Typed names fit; drawn data:image signatures do not.
 */
return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE students MODIFY authorization_to_transport_signature LONGTEXT NULL');
            DB::statement('ALTER TABLE students MODIFY payment_agreement_signature LONGTEXT NULL');
            DB::statement('ALTER TABLE students MODIFY liability_waiver_signature LONGTEXT NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE students ALTER COLUMN authorization_to_transport_signature TYPE TEXT');
            DB::statement('ALTER TABLE students ALTER COLUMN payment_agreement_signature TYPE TEXT');
            DB::statement('ALTER TABLE students ALTER COLUMN liability_waiver_signature TYPE TEXT');
        }
    }

    public function down(): void
    {
        // Reverting to VARCHAR(255) can truncate data; leave columns as-is in production.
    }
};
