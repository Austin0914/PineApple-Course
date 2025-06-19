use App\Models\Courses;
use App\Models\Departments;
use App\Models\Teachers;
use App\Models\Classrooms;
use App\Models\TeachHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// 將所有操作包在一個資料庫交易中，確保資料一致性
DB::transaction(function () {
    try {
        // 建立或取得系所：假設 '5304' 對應 '資訊管理學系'
        $department = Departments::firstOrCreate(
            ['depart_id' => 5304],
            ['depart_name' => '資訊管理學系']
        );

        $coursesData = [
            [
                'grade' => 1, 'class' => '01', 'course_name' => "計算機概論\nIntroduction to Computer\n(全英語授課/English-taught)", 'teacher_name' => '許經國',
                'credit' => 3, 'type' => '必修', 'detail_time' => '三E 五E', 'classroom_name' => '管理學院221', 'choose_limit' => 75,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5301105_01', 'note' => "保留新生50人限本系生修.,列入功能性基因體學程科目,列入程式設計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '02', 'course_name' => "計算機概論\nIntroduction to Computer", 'teacher_name' => '簡立仁',
                'credit' => 3, 'type' => '必修', 'detail_time' => '五4,5,6', 'classroom_name' => '創新大樓341', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5301105_02', 'note' => "保留新生50人; 支援企管系一年級B班.限本系生修.,列入功能性基因體學程科目,列入程式設計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '03', 'course_name' => "計算機概論\nIntroduction to Computer", 'teacher_name' => '簡立仁',
                'credit' => 3, 'type' => '必修', 'detail_time' => '五7,8,9', 'classroom_name' => '創新大樓341', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5301105_03', 'note' => "保留新生50人; 支援企管系一年級A班.限本系生修.,列入功能性基因體學程科目,列入程式設計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '04', 'course_name' => "計算機概論\nIntroduction to Computer", 'teacher_name' => '江宗韋',
                'credit' => 3, 'type' => '必修', 'detail_time' => '五4,5,6', 'classroom_name' => '管理學院107', 'choose_limit' => 125,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5301105_04', 'note' => "保留新生75人; 支援經濟學系一年級.限本系生修.,列入功能性基因體學程科目,列入程式設計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '05', 'course_name' => "計算機概論\nIntroduction to Computer", 'teacher_name' => '林克偉',
                'credit' => 3, 'type' => '必修', 'detail_time' => '五4,5,6', 'classroom_name' => '資訊處215教室', 'choose_limit' => 70,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5301105_05', 'note' => "保留新生50人; 支援財金系一年級.限本系生修.,列入功能性基因體學程科目,列入程式設計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "物件導向技術（一）－JAVA\nObject-Oriented Technology (I)-JAVA\n(全英語授課/English-taught)", 'teacher_name' => '薩尼',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一4,5 三4,5', 'classroom_name' => '管理學院221', 'choose_limit' => 75,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5301214_01', 'note' => "保留新生50人限本系生修.,列入程式設計學程科目,列入人工智慧與電腦審計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "資料結構\nData Structure", 'teacher_name' => '許巍嚴',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二7 四7,8,9', 'classroom_name' => '管理學院221', 'choose_limit' => 75,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5302203_01', 'note' => "先修科目(5301216)程式設計(曾經修習) 限本系生修.,列入軟體工程學程科目,列入程式設計學程科目,列入金融科技學分學程科目,列入人工智慧與電腦審計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "科技法律\nLaw in Science and Technology", 'teacher_name' => '黃維民',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一G 三G', 'classroom_name' => '管理學院221', 'choose_limit' => 75,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5302218_01', 'note' => "限本系生修.,列入金融科技學分學程科目,列入人工智慧與電腦審計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "醫療資訊管理概論\nIntroduction to Healthcare Information Management", 'teacher_name' => '佘明玲',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一7,8,9', 'classroom_name' => '管理學院608', 'choose_limit' => 15,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5302221_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "搜尋引擎優化\nSearch Engine Optimization\n(全英語授課/English-taught)", 'teacher_name' => '林勝為',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一5 三4,5', 'classroom_name' => '管理學院349', 'choose_limit' => 50,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5302223_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "系統分析與設計\nSystem Analysis & Design", 'teacher_name' => '阮金聲',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一4,5,6', 'classroom_name' => '管理學院616A', 'choose_limit' => 65,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5303102_01', 'note' => "限本系生修.,列入軟體工程學程科目,列入人工智慧與電腦審計學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "醫務管理\nManagement for Healthcare Organizations\n(全英語授課/English-taught)", 'teacher_name' => '林育秀',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一7,8 三7', 'classroom_name' => '管理學院616B', 'choose_limit' => 20,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5303224_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "電子商務\nElectronic Commerce\n(全英語授課/English-taught)", 'teacher_name' => '林勝為',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一F 三F', 'classroom_name' => '管理學院221', 'choose_limit' => 75,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5303227_01', 'note' => "限本系生修.,列入電子商務學程科目,列入金融科技學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "專案開發（一）\nProject Development I", 'teacher_name' => '吳帆',
                'credit' => 2, 'type' => '必修', 'detail_time' => '一1 三1', 'classroom_name' => '管理學院415', 'choose_limit' => 70,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5303229_01', 'note' => "限本系生修.,列入電子商務學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "專案開發(二)\nProject Development (II)", 'teacher_name' => '洪新原',
                'credit' => 2, 'type' => '必修', 'detail_time' => '二1 四1', 'classroom_name' => '管理學院415', 'choose_limit' => 70,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5303233_01', 'note' => "限本系生修.,列入電子商務學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "消費者行為\nConsumer Behavior\n(全英語授課/English-taught)", 'teacher_name' => '沙拉溫',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一B 三B', 'classroom_name' => '管理學院616B', 'choose_limit' => 20,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5303236_01', 'note' => ''
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "物聯網技術與應用\nInternet of Things Technology and Application\n(全英語授課/English-taught)", 'teacher_name' => '許經國',
                'credit' => 3, 'type' => '選修', 'detail_time' => '三4 五4,5', 'classroom_name' => '管理學院616A', 'choose_limit' => 65,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5303245_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "策略資訊管理\nStrategic Information Management\n(全英語授課/English-taught)", 'teacher_name' => '薩尼',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二4,5 四4,5', 'classroom_name' => '管理學院221', 'choose_limit' => 75,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5304219_01', 'note' => '先修科目(5303229)專案開發（一）(曾經修習) (5303233)專案開發(二)(曾經修習) (所有先修條件都必須符合)限本系生修.'
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "資訊管理個案研究\nCase Studies in MIS", 'teacher_name' => '廖則竣',
                'credit' => 3, 'type' => '選修', 'detail_time' => '四8,9,10', 'classroom_name' => '管理學院616B', 'choose_limit' => 20,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5304220_01', 'note' => ''
            ],
        ];

        foreach ($coursesData as $data) {
            // 建立或取得老師
            $teacher = Teachers::firstOrCreate(
                ['teacher_name' => $data['teacher_name']],
                ['depart_id' => $department->depart_id]
            );

            // 建立或取得教室
            $classroom = Classrooms::firstOrCreate(
                ['classroom_name' => $data['classroom_name']],
                ['depart_id' => $department->depart_id]
            );

            // 建立課程
            $course = Courses::create([
                'semester' => '114-1',
                'course_name' => $data['course_name'],
                'depart_id' => $department->depart_id,
                'note' => $data['note'],
                'choose_limit' => $data['choose_limit'],
                'classroom_id' => $classroom->classroom_id,
                'credit' => $data['credit'],
                'type' => $data['type'],
                'outline' => $data['outline'],
                'grade' => $data['grade'],
                'class' => $data['class'],
                'detail_time' => $data['detail_time']
            ]);

            // 關聯老師與課程
            // **注意**: 請確保 TeachHistory 模型中的 'teacher_id' 是可以被批量賦值的 (fillable)
            TeachHistory::create([
                'teacher_id' => $teacher->teacher_id,
                'course_id' => $course->course_id,
                'semester' => '114-1'
            ]);
        }

        echo "Department 5304 CSV data has been imported successfully.\n";

    } catch (Exception $e) {
        Log::error('Tinker script failed: ' . $e->getMessage());
        echo "An error occurred: " . $e->getMessage() . "\n";
        // 若發生錯誤，交易會自動回滾
    }
});

// 執行指令: php artisan tinker --execute="$(cat tinker.php)"