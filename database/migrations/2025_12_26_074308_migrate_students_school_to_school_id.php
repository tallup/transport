<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\School;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('students') && Schema::hasColumn('students', 'school') && !Schema::hasColumn('students', 'school_id')) {
            // Add school_id column
            Schema::table('students', function (Blueprint $table) {
                $table->foreignId('school_id')->nullable()->after('name')->constrained('schools')->onDelete('set null');
            });

            // Migrate existing school data
            $uniqueSchools = DB::table('students')
                ->whereNotNull('school')
                ->where('school', '!=', '')
                ->distinct()
                ->pluck('school')
                ->filter()
                ->unique();

            foreach ($uniqueSchools as $schoolName) {
                // Create school if it doesn't exist
                $school = School::firstOrCreate(
                    ['name' => $schoolName],
                    ['active' => true]
                );

                // Update students with this school name
                DB::table('students')
                    ->where('school', $schoolName)
                    ->update(['school_id' => $school->id]);
            }

            // Drop the old school column
            Schema::table('students', function (Blueprint $table) {
                $table->dropColumn('school');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('students') && Schema::hasColumn('students', 'school_id') && !Schema::hasColumn('students', 'school')) {
            // Add school column back
            Schema::table('students', function (Blueprint $table) {
                $table->string('school')->nullable()->after('name');
            });

            // Migrate data back
            $students = DB::table('students')
                ->join('schools', 'students.school_id', '=', 'schools.id')
                ->select('students.id', 'schools.name as school_name')
                ->get();

            foreach ($students as $student) {
                DB::table('students')
                    ->where('id', $student->id)
                    ->update(['school' => $student->school_name]);
            }

            // Drop school_id column
            Schema::table('students', function (Blueprint $table) {
                $table->dropForeign(['school_id']);
                $table->dropColumn('school_id');
            });
        }
    }
};

