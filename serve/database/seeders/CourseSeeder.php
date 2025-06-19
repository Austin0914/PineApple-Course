<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'name' => '資料庫管理',
                'code' => 'DB101',
                'description' => '資料庫設計、SQL語法、資料庫正規化和交易管理',
                'credits' => 3,
            ],
            [
                'name' => '資料結構',
                'code' => 'DS102',
                'description' => '陣列、連結串列、堆疊、佇列、樹狀結構和圖形演算法',
                'credits' => 3,
            ],
            [
                'name' => '系統設計',
                'code' => 'SD103',
                'description' => '軟體系統設計原則、設計模式和架構模式',
                'credits' => 3,
            ],
            [
                'name' => '網頁程式設計',
                'code' => 'WP104',
                'description' => 'HTML, CSS, JavaScript 和前端框架',
                'credits' => 3,
            ],
            [
                'name' => '演算法分析',
                'code' => 'AL105',
                'description' => '演算法設計與分析、計算複雜度、排序和搜尋',
                'credits' => 3,
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
