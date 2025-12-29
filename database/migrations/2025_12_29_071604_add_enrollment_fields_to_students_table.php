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
            $table->text('home_address')->nullable()->after('date_of_birth');
            $table->string('grade')->nullable()->after('home_address');
            $table->json('authorized_pickup_persons')->nullable()->after('grade');
            $table->text('special_instructions')->nullable()->after('authorized_pickup_persons');
            $table->text('medical_notes')->nullable()->after('special_instructions');
            
            // Emergency Contact #2
            $table->string('emergency_contact_2_name')->nullable()->after('emergency_contact_name');
            $table->string('emergency_contact_2_phone')->nullable()->after('emergency_contact_2_name');
            $table->string('emergency_contact_2_relationship')->nullable()->after('emergency_contact_2_phone');
            
            // Doctor Information
            $table->string('doctor_name')->nullable()->after('emergency_contact_2_relationship');
            $table->string('doctor_phone')->nullable()->after('doctor_name');
            
            // Signatures
            $table->timestamp('authorization_to_transport_signed_at')->nullable()->after('doctor_phone');
            $table->string('authorization_to_transport_signature')->nullable()->after('authorization_to_transport_signed_at');
            $table->timestamp('payment_agreement_signed_at')->nullable()->after('authorization_to_transport_signature');
            $table->string('payment_agreement_signature')->nullable()->after('payment_agreement_signed_at');
            $table->timestamp('liability_waiver_signed_at')->nullable()->after('payment_agreement_signature');
            $table->string('liability_waiver_signature')->nullable()->after('liability_waiver_signed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'home_address',
                'grade',
                'authorized_pickup_persons',
                'special_instructions',
                'medical_notes',
                'emergency_contact_2_name',
                'emergency_contact_2_phone',
                'emergency_contact_2_relationship',
                'doctor_name',
                'doctor_phone',
                'authorization_to_transport_signed_at',
                'authorization_to_transport_signature',
                'payment_agreement_signed_at',
                'payment_agreement_signature',
                'liability_waiver_signed_at',
                'liability_waiver_signature',
            ]);
        });
    }
};
