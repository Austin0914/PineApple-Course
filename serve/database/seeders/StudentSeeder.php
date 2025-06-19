<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            [
                'name' => '張三',
                'email' => 'zhang.san@example.com',
                'department' => '資訊工程',
                'student_id' => 'A12345678',
                'grade' => 3,
            ],
            [
                'name' => '李四',
                'email' => 'li.si@example.com',
                'department' => '電機工程',
                'student_id' => 'B12345678',
                'grade' => 2,
            ],
            [
                'name' => '王五',
                'email' => 'wang.wu@example.com',
                'department' => '資訊管理',
                'student_id' => 'C12345678',
                'grade' => 4,
            ],
            [
                'name' => '趙六',
                'email' => 'zhao.liu@example.com',
                'department' => '資料科學',
                'student_id' => 'D12345678',
                'grade' => 1,
            ],
            [
                'name' => '錢七',
                'email' => 'qian.qi@example.com',
                'department' => '人工智能',
                'student_id' => 'E12345678',
                'grade' => 3,
            ],
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
}
