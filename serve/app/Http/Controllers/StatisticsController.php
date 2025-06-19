<?php

namespace App\Http\Controllers;

use App\Models\Users;
use App\Models\Courses;
use App\Models\Teachers;
use App\Models\Departments;
use App\Models\Enrollments;
use App\Models\TeachHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Overall Stats
            $totalUsers = Users::count();
            $totalCourses = Courses::count();
            $totalTeachers = Teachers::count();
            $totalDepartments = Departments::count();

            // Department Stats
            $courseCounts = Courses::select('depart_id', DB::raw('count(*) as course_count'))
                ->groupBy('depart_id')
                ->pluck('course_count', 'depart_id');

            $studentCounts = DB::table('enrollments')
                ->join('courses', 'enrollments.course_id', '=', 'courses.course_id')
                ->select('courses.depart_id', DB::raw('count(distinct enrollments.user_id) as student_count'))
                ->groupBy('courses.depart_id')
                ->pluck('student_count', 'depart_id');

            $departments = Departments::all();
            $departmentStats = $departments->map(function ($dept) use ($courseCounts, $studentCounts) {
                $courseCount = $courseCounts->get($dept->depart_id) ?? 0;
                $studentCount = $studentCounts->get($dept->depart_id) ?? 0;
                return [
                    'id' => $dept->depart_id,
                    'name' => $dept->depart_name,
                    'courseCount' => $courseCount,
                    'studentCount' => $studentCount,
                    'averagePerCourse' => $courseCount > 0 ? round($studentCount / $courseCount, 1) : 0,
                ];
            });

            // Enrollment Stats
            $enrollmentStats = Enrollments::select('semester', DB::raw('count(*) as total_enrollments'))
                ->groupBy('semester')
                ->orderBy('semester', 'desc')
                ->get()
                ->map(function ($stat) {
                    $courseCountInSemester = Courses::where('semester', $stat->semester)->count();
                    return [
                        'semester' => $stat->semester,
                        'totalEnrollments' => (int)$stat->total_enrollments,
                        'averagePerCourse' => $courseCountInSemester > 0 ? round($stat->total_enrollments / $courseCountInSemester, 1) : 0,
                    ];
                });

            // System Usage Stats
            $totalEnrollmentsCount = Enrollments::count();
            $totalCapacity = Courses::sum('choose_limit');
            $courseFillRate = $totalCapacity > 0 ? round(($totalEnrollmentsCount / $totalCapacity) * 100) : 0;

            $studentsWithEnrollments = Enrollments::distinct('user_id')->count();
            $totalStudents = Users::where('role', 'student')->count();
            $studentEnrollmentRate = $totalStudents > 0 ? round(($studentsWithEnrollments / $totalStudents) * 100) : 0;

            $teachersWithCourses = TeachHistory::distinct('teacher_id')->count();
            $teacherTeachingRate = $totalTeachers > 0 ? round(($teachersWithCourses / $totalTeachers) * 100) : 0;

            // Assemble the final response
            return response()->json([
                'message' => 'Statistics retrieved successfully',
                'data' => [
                    'totalUsers' => $totalUsers,
                    'totalCourses' => $totalCourses,
                    'totalTeachers' => $totalTeachers,
                    'totalDepartments' => $totalDepartments,
                    'departmentStats' => $departmentStats,
                    'enrollmentStats' => $enrollmentStats,
                    'usageStats' => [
                        'courseFillRate' => $courseFillRate,
                        'studentEnrollmentRate' => $studentEnrollmentRate,
                        'teacherTeachingRate' => $teacherTeachingRate,
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
