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
        // 建立或取得系所：'5154' 對應 '財務金融學系'
        $department = Departments::firstOrCreate(
            ['depart_id' => 5154],
            ['depart_name' => '財務金融學系']
        );

        $coursesData = [
            [
                'grade' => 1, 'class' => '01', 'course_name' => "計算機概論\nIntroduction to Computer", 'teacher_name' => '陳立文',
                'credit' => 3, 'type' => '必修', 'detail_time' => '三7,8,9', 'classroom_name' => '資訊處217教室', 'choose_limit' => 47,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5151007_01', 'note' => "保留新生47人; 支援財金系一年級A班B班.限本系生修.,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "初級會計學（一）\nAccounting (I)", 'teacher_name' => '顏子瑜',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二4,5 四4,5', 'classroom_name' => '管理學院101', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5151032_01', 'note' => "保留新生60人; 支援財金系一年級.限本系生修.,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "統計學（一）\nStatistics (I)", 'teacher_name' => '劉議謙',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二3 四3,4,5', 'classroom_name' => '管理學院120', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5152020_01', 'note' => "先修科目(2101001)微積分（一）(曾經修習) (2101002)微積分（二）(曾經修習) (2101003)微積分（一）(曾經修習) (2101004)微積分（二）(曾經修習) (2101010)微積分(曾經修習) (2101018)微積分(曾經修習) (只要符合任一先修條件)支援財金系資管系資管所二年級三年級四年級.限本系生修.,列入程式設計學程科目,列入財務經濟學程科目,列入大數據與資料科學學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "商事法\nCommercial Law", 'teacher_name' => '王文忠',
                'credit' => 2, 'type' => '必修', 'detail_time' => '三10,11', 'classroom_name' => '管理學院120', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5152092_01', 'note' => "限本系生修.,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '02', 'course_name' => "商事法\nCommercial Law", 'teacher_name' => '王文忠',
                'credit' => 2, 'type' => '必修', 'detail_time' => '三12,13', 'classroom_name' => '管理學院120', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5152092_02', 'note' => "限本系生修.,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "財務管理（一）\nFinancial Management (I)", 'teacher_name' => '李佩璇',
                'credit' => 3, 'type' => '必修', 'detail_time' => '三4,5,6', 'classroom_name' => '管理學院201', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5152100_01', 'note' => "先修科目(5151033)初級會計學（二）(曾經修習) (5151032)初級會計學（一）(曾經修習) (5261104)初級會計學（一）(曾經修習) (5261105)初級會計學（二）(曾經修習) (5261101)初級會計學(一)(曾經修習) (5261102)初級會計學(二)(曾經修習) (5261020)初等會計學（一）(曾經修習) (5261022)初級會計學（一）(曾經修習) (只要符合任一先修條件)支援財金系二年級A班B班.限本系生修.,列入管理經濟學程科目,列入財務經濟學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '02', 'course_name' => "財務管理（一）\nFinancial Management (I)", 'teacher_name' => '黃冠瑛',
                'credit' => 3, 'type' => '必修', 'detail_time' => '三4,5,6', 'classroom_name' => '管理學院120', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5152100_02', 'note' => "先修科目(5261017)初級會計學（二）(曾經修習) (5261019)初等會計學（二）(曾經修習) (5261020)初等會計學（一）(曾經修習) (5261022)初級會計學（一）(曾經修習) (5261104)初級會計學（一）(曾經修習) (5261105)初級會計學（二）(曾經修習) (5151032)初級會計學（一）(曾經修習) (5151033)初級會計學（二）(曾經修習) (只要符合任一先修條件)支援財金系二年級A班B班.限本系生修.,列入管理經濟學程科目,列入財務經濟學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '03', 'course_name' => "財務管理（一）\nFinancial Management (I)\n(全英語授課/English-taught)", 'teacher_name' => '余曉靜',
                'credit' => 3, 'type' => '必修', 'detail_time' => '五4,5,6', 'classroom_name' => '管理學院350', 'choose_limit' => 25,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5152100_03', 'note' => "先修科目(5261017)初級會計學（二）(曾經修習) (5261019)初等會計學（二）(曾經修習) (5261020)初等會計學（一）(曾經修習) (5261022)初級會計學（一）(曾經修習) (5261104)初級會計學（一）(曾經修習) (5261105)初級會計學（二）(曾經修習) (5151032)初級會計學（一）(曾經修習) (5151033)初級會計學（二）(曾經修習) (只要符合任一先修條件)限本系生修.,列入管理經濟學程科目,列入財務經濟學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 2, 'class' => '04', 'course_name' => "財務管理（一）\nFinancial Management (I)", 'teacher_name' => '陳立文',
                'credit' => 3, 'type' => '選修', 'detail_time' => '四7,8,9', 'classroom_name' => '管理學院426會議室', 'choose_limit' => 70,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5152100_04', 'note' => "先修科目(5261104)初級會計學（一）(曾經修習) (5261105)初級會計學（二）(曾經修習) (只要符合任一先修條件)支援經濟學系二年級三年級四年級.限本系生修.,列入管理經濟學程科目,列入財務經濟學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "金融倫理學\nEthics in Finance", 'teacher_name' => '林子綾',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一7,8,9', 'classroom_name' => '管理學院120', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5153173_01', 'note' => "先修科目(5152100)財務管理（一）(曾經修習) (5152101)財務管理（二）(曾經修習) (5152200)投資學(曾經修習) (所有先修條件都必須符合)限本系生修.,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '02', 'course_name' => "金融倫理學\nEthics in Finance", 'teacher_name' => '何宗興',
                'credit' => 3, 'type' => '必修', 'detail_time' => '三4,5,6', 'classroom_name' => '管理學院101', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5153173_02', 'note' => "先修科目(5152100)財務管理（一）(曾經修習) (5152101)財務管理（二）(曾經修習) (5152200)投資學(曾經修習) (所有先修條件都必須符合)限本系生修.,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "金融市場與機構\nFinancial Markets and Institutions", 'teacher_name' => '何月芳',
                'credit' => 3, 'type' => '必修', 'detail_time' => '四7,8,9', 'classroom_name' => '管理學院101', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5153300_01', 'note' => "先修科目(5152100)財務管理（一）(及格) (5152101)財務管理（二）(及格) (5152200)投資學(及格) (所有先修條件都必須符合)支援財金系三年級A班B班.限本系生修.,列入財務經濟學程科目,列入金融科技學分學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '02', 'course_name' => "金融市場與機構\nFinancial Markets and Institutions\n(全英語授課/English-taught)", 'teacher_name' => '林佳賢',
                'credit' => 3, 'type' => '必修', 'detail_time' => '四4,5,6', 'classroom_name' => '管理學院201', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5153300_02', 'note' => "先修科目(5152100)財務管理（一）(及格) (5152101)財務管理（二）(及格) (5152200)投資學(及格) (所有先修條件都必須符合),列入財務經濟學程科目,列入金融科技學分學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "期貨與選擇權\nFutures and Options", 'teacher_name' => '賴靖宜',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二4,5,6', 'classroom_name' => '管理學院120', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5153340_01', 'note' => "先修科目(5152100)財務管理（一）(及格) (5152101)財務管理（二）(及格) (所有先修條件都必須符合)支援財金系三年級A班B班.限本系生修.,列入財務經濟學程科目,列入國際菁英學分學程科目"
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "投資組合分析\nPortfolio Analysis", 'teacher_name' => '蔡佩蓉',
                'credit' => 3, 'type' => '選修', 'detail_time' => '三7,8,9', 'classroom_name' => '管理學院201', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5154210_01', 'note' => '先修科目(5152100)財務管理（一）(曾經修習) (5152101)財務管理（二）(曾經修習) (所有先修條件都必須符合)限本系生修.'
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "財務大數據分析\nBig data analysis in finance", 'teacher_name' => '雲慕書',
                'credit' => 3, 'type' => '選修', 'detail_time' => '五4,5,6', 'classroom_name' => '管理學院401之3', 'choose_limit' => 35,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5154317_01', 'note' => "先修科目(5152020)統計學（一）(及格) (5152021)統計學（二）(及格) (所有先修條件都必須符合)限本系生修.,列入大數據與資料科學學程科目,列入金融科技學分學程科目,列入人工智慧與電腦審計學程科目"
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "創業投資與私募股權\nVenture Capital and Private Equity\n(全英語授課/English-taught)", 'teacher_name' => '李佩璇',
                'credit' => 3, 'type' => '選修', 'detail_time' => '二7,8,9', 'classroom_name' => '管理學院401之3', 'choose_limit' => 35,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5154321_01', 'note' => '先修科目(5152200)投資學(曾經修習) 限本系生修.'
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "另類投資\nAlternative Investment\n(全英語授課/English-taught)", 'teacher_name' => '黃冠瑛',
                'credit' => 3, 'type' => '選修', 'detail_time' => '二10,11,12', 'classroom_name' => '管理學院401之3', 'choose_limit' => 35,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5154322_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "風險管理與保險\nRisk Management and Insurance", 'teacher_name' => '林文昌',
                'credit' => 3, 'type' => '選修', 'detail_time' => '三4,5,6', 'classroom_name' => '管理學院401之3', 'choose_limit' => 35,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5154400_01', 'note' => "限本系生修.,列入精算經濟學分學程科目"
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "不動產概論\nPrinciple of Real Estate", 'teacher_name' => '花良釗',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一3,4,5', 'classroom_name' => '管理學院201', 'choose_limit' => 60,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_5154441_01', 'note' => '限本系生修.'
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

        echo "Department 5154 (Finance) CSV data has been imported successfully.\n";

    } catch (Exception $e) {
        // 記錄錯誤並輸出訊息
        Log::error('Tinker script for Finance (5154) failed: ' . $e->getMessage());
        echo "An error occurred during the import for the Finance department: " . $e->getMessage() . "\n";
        // 若發生錯誤，交易會自動回滾
    }
});
