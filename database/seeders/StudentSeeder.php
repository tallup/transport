<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $parents = User::where('role', 'parent')->get();

        if ($parents->isEmpty()) {
            $this->command->warn('No parent users found. Please run UserSeeder first.');
            return;
        }

        $students = [
            [
                'parent_id' => $parents->first()->id,
                'name' => 'Emma Johnson',
                'school' => 'Lincoln Elementary School',
                'date_of_birth' => '2015-03-15',
                'emergency_phone' => '555-0101',
                'emergency_contact_name' => 'Sarah Johnson',
            ],
            [
                'parent_id' => $parents->first()->id,
                'name' => 'Noah Johnson',
                'school' => 'Lincoln Elementary School',
                'date_of_birth' => '2017-07-22',
                'emergency_phone' => '555-0101',
                'emergency_contact_name' => 'Sarah Johnson',
            ],
            [
                'parent_id' => $parents->skip(1)->first()->id,
                'name' => 'Olivia Brown',
                'school' => 'Roosevelt Middle School',
                'date_of_birth' => '2012-11-08',
                'emergency_phone' => '555-0102',
                'emergency_contact_name' => 'David Brown',
            ],
            [
                'parent_id' => $parents->skip(2)->first()->id,
                'name' => 'Liam Davis',
                'school' => 'Washington High School',
                'date_of_birth' => '2010-05-19',
                'emergency_phone' => '555-0103',
                'emergency_contact_name' => 'Emily Davis',
            ],
            [
                'parent_id' => $parents->skip(2)->first()->id,
                'name' => 'Sophia Davis',
                'school' => 'Washington High School',
                'date_of_birth' => '2013-09-30',
                'emergency_phone' => '555-0103',
                'emergency_contact_name' => 'Emily Davis',
            ],
            [
                'parent_id' => $parents->skip(3)->first()->id,
                'name' => 'Mason Wilson',
                'school' => 'Lincoln Elementary School',
                'date_of_birth' => '2016-02-14',
                'emergency_phone' => '555-0104',
                'emergency_contact_name' => 'Michael Wilson',
            ],
            [
                'parent_id' => $parents->skip(4)->first()->id,
                'name' => 'Ava Martinez',
                'school' => 'Roosevelt Middle School',
                'date_of_birth' => '2014-08-25',
                'emergency_phone' => '555-0105',
                'emergency_contact_name' => 'Jessica Martinez',
            ],
        ];

        foreach ($students as $student) {
            Student::firstOrCreate(
                [
                    'parent_id' => $student['parent_id'],
                    'name' => $student['name'],
                ],
                $student
            );
        }
    }
}
