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
        // 建立或取得系所：假設 '4104' 對應 '資訊工程學系'
        $department = Departments::firstOrCreate(
            ['depart_id' => 4104],
            ['depart_name' => '資訊工程學系']
        );

        $coursesData = [
            [
                'grade' => 1, 'class' => '01', 'course_name' => "程式語言\nProgramming Languages", 'teacher_name' => '王志航',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一F,G', 'classroom_name' => '創新大樓341', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4100008_01', 'note' => "保留新生50人; 支援數學系一年級.,列入程式設計學程科目,列入大數據經濟分析學分學程科目支援數學，資工系學生不可選修"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "程式語言\nProgramming Languages", 'teacher_name' => '王俊堯',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二F 四F', 'classroom_name' => '資訊處215教室', 'choose_limit' => 70,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101002_01', 'note' => "保留新生42人; 支援機械系光機電整合工程組機械系機械工程組一年級.,列入大數據經濟分析學分學程科目支援機械，資工系學生不可選修"
            ],
            [
                'grade' => 1, 'class' => '02', 'course_name' => "程式語言\nProgramming Languages", 'teacher_name' => '蔡政宇',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二B 四B', 'classroom_name' => '創新大樓201', 'choose_limit' => 42,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101002_02', 'note' => "保留新生42人; 支援機械系光機電整合工程組機械系機械工程組一年級.,列入大數據經濟分析學分學程科目支援機械，資工系學生不可選修"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "單板機與深度學習應用入門\nSingle-board Computer and Deep Learning", 'teacher_name' => '蔡政宇',
                'credit' => 1, 'type' => '選修', 'detail_time' => '三5', 'classroom_name' => '活動中心B1自造基地', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101021_01', 'note' => ",列入青銀共創跨域學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "物聯網與網頁應用程式開發\nIoT and Web Application Development", 'teacher_name' => '蔡政宇',
                'credit' => 1, 'type' => '選修', 'detail_time' => '三4', 'classroom_name' => '活動中心B1自造基地', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101022_01', 'note' => ",列入青銀共創跨域學分學程科目"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "程式設計（一）\nProgram Design (I)\n(全英語授課/English-taught)", 'teacher_name' => '程芙茵',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二E 四E', 'classroom_name' => '工學院A館101', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101031_01', 'note' => "保留新生50人限本系生修.,列入電子商務學程科目,列入軟體工程學程科目,列入功能性基因體學程科目,列入程式設計學程科目,列入大數據經濟分析學分學程科目,列入金融科技學分學程科目,列入人工智慧與電腦審計學程科目限修80人"
            ],
            [
                'grade' => 1, 'class' => '02', 'course_name' => "程式設計（一）\nProgram Design (I)", 'teacher_name' => '王銘宏',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二C 四C', 'classroom_name' => '創新大樓341', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101031_02', 'note' => "保留新生50人限本系生修.,列入電子商務學程科目,列入軟體工程學程科目,列入功能性基因體學程科目,列入程式設計學程科目,列入大數據經濟分析學分學程科目,列入金融科技學分學程科目,列入人工智慧與電腦審計學程科目限修80人"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "程式設計實習（一）\nProgramming Lab for Program Design (I)", 'teacher_name' => '程芙茵',
                'credit' => 1, 'type' => '必修', 'detail_time' => '一13,14', 'classroom_name' => '創新大樓341', 'choose_limit' => 40,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101033_01', 'note' => "保留新生25人限本系生修.,列入電子商務學程科目限修40人"
            ],
            [
                'grade' => 1, 'class' => '02', 'course_name' => "程式設計實習（一）\nProgramming Lab for Program Design (I)", 'teacher_name' => '程芙茵',
                'credit' => 1, 'type' => '必修', 'detail_time' => '三13,14', 'classroom_name' => '創新大樓341', 'choose_limit' => 40,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101033_02', 'note' => "保留新生25人限本系生修.,列入電子商務學程科目限修40人"
            ],
            [
                'grade' => 1, 'class' => '03', 'course_name' => "程式設計實習（一）\nProgramming Lab for Program Design (I)", 'teacher_name' => '王銘宏',
                'credit' => 1, 'type' => '必修', 'detail_time' => '二13,14', 'classroom_name' => '創新大樓341', 'choose_limit' => 40,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101033_03', 'note' => "保留新生25人限本系生修.,列入電子商務學程科目限修40人"
            ],
            [
                'grade' => 1, 'class' => '04', 'course_name' => "程式設計實習（一）\nProgramming Lab for Program Design (I)", 'teacher_name' => '王銘宏',
                'credit' => 1, 'type' => '必修', 'detail_time' => '四13,14', 'classroom_name' => '創新大樓341', 'choose_limit' => 40,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101033_04', 'note' => "保留新生25人限本系生修.,列入電子商務學程科目限修40人"
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "智慧計算系統\nIntelligent Computing System\n(遠距教學/Distant learning)", 'teacher_name' => '游寶達',
                'credit' => 1, 'type' => '選修', 'detail_time' => '三7', 'classroom_name' => '活動中心B1自造基地', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101036_01', 'note' => 'https://ecourse2.ccu.edu.tw/'
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "量子基礎數學\nQuantum Fundamental Mathematics\n(遠距教學/Distant learning)", 'teacher_name' => '游寶達',
                'credit' => 1, 'type' => '選修', 'detail_time' => '三8', 'classroom_name' => '活動中心B1自造基地', 'choose_limit' => 80,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101037_01', 'note' => 'https://ecourse2.ccu.edu.tw/'
            ],
            [
                'grade' => 1, 'class' => '01', 'course_name' => "線性代數\nLinear Algebra", 'teacher_name' => '柳金章',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一B 三B', 'classroom_name' => '工學院A館104', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101155_01', 'note' => "保留新生50人限本系生修.,列入程式設計學程科目限修63人"
            ],
            [
                'grade' => 1, 'class' => '02', 'course_name' => "線性代數\nLinear Algebra", 'teacher_name' => '柯仁松',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一B 三B', 'classroom_name' => '工學院A館101', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4101155_02', 'note' => "保留新生50人限本系生修.,列入程式設計學程科目限修63人"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "數位電子學\nElectronic Circuits and Electronics", 'teacher_name' => '林維暘',
                'credit' => 3, 'type' => '必修', 'detail_time' => '三E,F', 'classroom_name' => '工學院A館001', 'choose_limit' => 126,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102001_01', 'note' => '限本系生修.限修126人'
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "數位電子學實驗\nElectronic Circuits and Electronics Lab.", 'teacher_name' => '林維暘',
                'credit' => 1, 'type' => '必修', 'detail_time' => '二13,14', 'classroom_name' => '工學院A館206', 'choose_limit' => 48,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102003_01', 'note' => '限本系生修.限修48人'
            ],
            [
                'grade' => 2, 'class' => '02', 'course_name' => "數位電子學實驗\nElectronic Circuits and Electronics Lab.", 'teacher_name' => '林維暘',
                'credit' => 1, 'type' => '必修', 'detail_time' => '四13,14', 'classroom_name' => '工學院A館206', 'choose_limit' => 48,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102003_02', 'note' => '限本系生修.限修48人'
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "機率論\nProbability Theory", 'teacher_name' => '盧沛怡',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二B 四B', 'classroom_name' => '工學院A館104', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102013_01', 'note' => "限本系生修.,列入大數據經濟分析學分學程科目,列入精算經濟學分學程科目限修63人"
            ],
            [
                'grade' => 2, 'class' => '02', 'course_name' => "機率論\nProbability Theory", 'teacher_name' => '黃啟富',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一G 三G', 'classroom_name' => '創新大樓324', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102013_02', 'note' => "限本系生修.,列入大數據經濟分析學分學程科目,列入精算經濟學分學程科目限修63人"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "組合語言\nAssembly Language\n(遠距教學/Distant learning)", 'teacher_name' => '陳鵬升',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一C 三C', 'classroom_name' => '工學院A館001', 'choose_limit' => 120,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102050_01', 'note' => '限本系生修.https://ecourse2.ccu.edu.tw/'
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "資料結構\nData Structure", 'teacher_name' => '郭建志',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二F 四F', 'classroom_name' => '工學院A館101', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102062_01', 'note' => "先修科目(4101005)計算機概論（一）(及格) (4101006)計算機概論（二）(及格) (4101031)程式設計（一）(及格) (4101032)程式設計（二）(及格) (只要符合任一先修條件)限本系生修.,列入組織工程學程科目,列入軟體工程學程科目,列入功能性基因體學程科目,列入程式設計學程科目,列入大數據經濟分析學分學程科目,列入金融科技學分學程科目,列入人工智慧與電腦審計學程科目限修63人"
            ],
            [
                'grade' => 2, 'class' => '02', 'course_name' => "資料結構\nData Structure\n(遠距教學/Distant learning)(全英語授課/English-taught)", 'teacher_name' => '薛幼苓',
                'credit' => 3, 'type' => '必修', 'detail_time' => '四E,F', 'classroom_name' => '創新大樓322', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102062_02', 'note' => "先修科目(4101005)計算機概論（一）(及格) (4101006)計算機概論（二）(及格) (4101031)程式設計（一）(及格) (4101032)程式設計（二）(及格) (只要符合任一先修條件)限本系生修.,列入組織工程學程科目,列入軟體工程學程科目,列入功能性基因體學程科目,列入程式設計學程科目,列入大數據經濟分析學分學程科目,列入金融科技學分學程科目,列入人工智慧與電腦審計學程科目限修63人  https://ecourse2.ccu.edu.tw/"
            ],
            [
                'grade' => 2, 'class' => '01', 'course_name' => "工程數學\nEngineering Mathematics\n(遠距教學/Distant learning)", 'teacher_name' => '鍾菁哲',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一E,F', 'classroom_name' => '工學院A館001', 'choose_limit' => 120,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4102090_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "作業系統概論\nIntroduction  to Operating System\n(遠距教學/Distant learning)", 'teacher_name' => '羅習五',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二E,F', 'classroom_name' => '創新大樓326', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103001_01', 'note' => '限本系生修.限修63人  https://ecourse2.ccu.edu.tw/'
            ],
            [
                'grade' => 3, 'class' => '02', 'course_name' => "作業系統概論\nIntroduction  to Operating System", 'teacher_name' => '梁郁珮',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二G 四G', 'classroom_name' => '工學院A館101', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103001_02', 'note' => '限本系生修.限修63人'
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "軟體工程\nSoftware Engineering\n(遠距教學/Distant learning)", 'teacher_name' => '熊博安',
                'credit' => 3, 'type' => '選修', 'detail_time' => '三E,F', 'classroom_name' => '工學院A館101', 'choose_limit' => 90,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103022_01', 'note' => "限本系生修.,列入軟體工程學程科目,列入程式設計學程科目https://ecourse2.ccu.edu.tw/"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "多媒體技術概論\nIntroduction to Multimedia Technology\n(全英語授課/English-taught)", 'teacher_name' => '江振國',
                'credit' => 3, 'type' => '選修', 'detail_time' => '四E,F', 'classroom_name' => '創新大樓324', 'choose_limit' => 70,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103026_01', 'note' => "限本系生修.,列入長者人權門診跨域學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "賽局理論與計算方法\nGame Theory and Computation Method", 'teacher_name' => '陳立軒',
                'credit' => 3, 'type' => '選修', 'detail_time' => '五C,D', 'classroom_name' => '工學院A館104', 'choose_limit' => 65,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103031_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "計算機組織\nComputer Organization", 'teacher_name' => '林泰吉',
                'credit' => 3, 'type' => '必修', 'detail_time' => '一C 三C', 'classroom_name' => '工學院A館101', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103055_01', 'note' => '限本系生修.限修63人'
            ],
            [
                'grade' => 3, 'class' => '02', 'course_name' => "計算機組織\nComputer Organization\n(遠距教學/Distant learning)", 'teacher_name' => '張榮貴',
                'credit' => 3, 'type' => '必修', 'detail_time' => '二B 四B', 'classroom_name' => '工學院A館101', 'choose_limit' => 63,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103055_02', 'note' => '限本系生修.限修63人 https://ecourse2.ccu.edu.tw/'
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "數值分析\nNumerical Analysis", 'teacher_name' => '邱志義',
                'credit' => 3, 'type' => '選修', 'detail_time' => '一D 三D', 'classroom_name' => '創新大樓324', 'choose_limit' => 70,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103061_01', 'note' => "限本系生修.,列入程式設計學程科目,列入大數據經濟分析學分學程科目"
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "資訊工程研討\nComputer Science Seminars", 'teacher_name' => '教師未定',
                'credit' => 1, 'type' => '必修', 'detail_time' => '一8,9', 'classroom_name' => '工學院A館101', 'choose_limit' => 90,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103800_01', 'note' => '限本系生修.'
            ],
            [
                'grade' => 3, 'class' => '01', 'course_name' => "工程倫理\nEngineering Ethics", 'teacher_name' => '林迺衛',
                'credit' => 3, 'type' => '選修', 'detail_time' => '三7,8,9', 'classroom_name' => '工學院A館205', 'choose_limit' => 65,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4103900_01', 'note' => '開放大三大四'
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "電信網路概論\nIntroduction  to Telecommunication Network", 'teacher_name' => '江為國',
                'credit' => 3, 'type' => '選修', 'detail_time' => '三C 五C', 'classroom_name' => '工學院A館205', 'choose_limit' => 65,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4104046_01', 'note' => '限本系生修.開放大三大四選修'
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "巨量資料運算導論\nIntroduction to Big Data Computing\n(遠距教學/Distant learning)", 'teacher_name' => '蘇育生',
                'credit' => 3, 'type' => '選修', 'detail_time' => '四C,D', 'classroom_name' => '創新大樓324', 'choose_limit' => 20,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4104072_01', 'note' => "限本系生修.限修20人，優先給資工系大三及大四選修, https://ecourse2.ccu.edu.tw/"
            ],
            [
                'grade' => 4, 'class' => '01', 'course_name' => "專題實驗（二）\nComputer Project (II)", 'teacher_name' => '教師未定',
                'credit' => 2, 'type' => '必修', 'detail_time' => '五12,13,14,15', 'classroom_name' => '工學院A館101', 'choose_limit' => 90,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4104801_01', 'note' => "限本系生修.,列入資通安全學程(1091起停辦)科目限多媒體訊號處理領域: 柳金章、林維暘、劉興民、劉偉名、江振國、程芙茵、邱志義、盧沛怡老師之指導專題生選修。"
            ],
            [
                'grade' => 4, 'class' => '02', 'course_name' => "專題實驗（二）\nComputer Project (II)", 'teacher_name' => '教師未定',
                'credit' => 2, 'type' => '必修', 'detail_time' => '五12,13,14,15', 'classroom_name' => '工學院A館001', 'choose_limit' => 120,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4104801_02', 'note' => "限本系生修.,列入資通安全學程(1091起停辦)科目限計算機理論領域: 黃耀廷、陳立軒老師之專題生選修。"
            ],
            [
                'grade' => 4, 'class' => '03', 'course_name' => "專題實驗（二）\nComputer Project (II)", 'teacher_name' => '林柏青',
                'credit' => 2, 'type' => '必修', 'detail_time' => '五12,13,14,15', 'classroom_name' => '工學院A館104', 'choose_limit' => 65,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4104801_03', 'note' => "限本系生修.,列入資通安全學程(1091起停辦)科目限網路與數位學習領域: 游寶達、林柏青、柯仁松、江為國、黃啟富、郭建志、蘇育生、阮文齡老師之專題生選修。"
            ],
            [
                'grade' => 4, 'class' => '04', 'course_name' => "專題實驗（二）\nComputer Project (II)", 'teacher_name' => '黃耀廷',
                'credit' => 2, 'type' => '必修', 'detail_time' => '五12,13,14,15', 'classroom_name' => '工學院A館103', 'choose_limit' => 20,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4104801_04', 'note' => "限本系生修.,列入資通安全學程(1091起停辦)科目限SOC領域: 張榮貴、鍾菁哲、陳鵬升、林泰吉、梁郁珮老師之專題生選修"
            ],
            [
                'grade' => 4, 'class' => '05', 'course_name' => "專題實驗（二）\nComputer Project (II)", 'teacher_name' => '熊博安',
                'credit' => 2, 'type' => '必修', 'detail_time' => '五12,13,14,15', 'classroom_name' => '工學院A館204', 'choose_limit' => 40,
                'outline' => 'https://syllabus.ccu.edu.tw/index.php?cour_no=114_1_4104801_05', 'note' => "限本系生修.,列入資通安全學程(1091起停辦)科目限系統軟體領域: 熊博安、羅習五、薛幼苓、王銘宏老師專題生選修。"
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
            TeachHistory::create([
                'teacher_id' => $teacher->teacher_id,
                'course_id' => $course->course_id,
                'semester' => '114-1'
            ]);
        }

        echo "Department 4104 CSV data has been imported successfully.\n";

    } catch (Exception $e) {
        Log::error('Tinker script for CS failed: ' . $e->getMessage());
        echo "An error occurred: " . $e->getMessage() . "\n";
        // 若發生錯誤，交易會自動回滾
    }
});