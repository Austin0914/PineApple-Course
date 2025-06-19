<?php

namespace App\Http\Controllers;

use App\Models\Enrollments;
use App\Models\Courses;
use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class EnrollmentsController extends Controller
{
    // [Enrollments] GET /users/{userId}/enrollments
    // 學生或管理員可以查看特定學生的選課列表。
    public function getUserEnrollments(Request $request, $userId)
    {
        $requestingUser = Users::find($request->userID);

        if ($requestingUser->user_id != $userId && $requestingUser->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $enrollments = Enrollments::where('user_id', $userId)
                ->with(['course.department', 'course.teachers', 'course.classroom'])
                ->paginate(15);

            return response()->json([
                'message' => 'Successfully retrieved user enrollments',
                'data' => $enrollments->map(function ($enrollment) {
                    return $this->formatUserEnrollmentResponse($enrollment);
                }),
                'pagination' => [
                    'current_page' => $enrollments->currentPage(),
                    'last_page' => $enrollments->lastPage(),
                    'per_page' => $enrollments->perPage(),
                    'total' => $enrollments->total(),
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json(['message' => 'An unexpected error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    // [Enrollments] GET /courses/{courseId}/enrollments
    // 管理員或該課程的授課老師可以查看。
    public function getCourseEnrollments(Request $request, $courseId)
    {
        try {
            $course = Courses::findOrFail($courseId);
            $requestingUser = Users::find($request->userID);

            if ($requestingUser->role != 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $enrollments = Enrollments::where('course_id', $courseId)->paginate(15);

            return response()->json([
                'message' => 'Successfully retrieved course enrollments',
                'data' => $enrollments->map(function ($enrollment) {
                    return $this->formatCourseEnrollmentResponse($enrollment);
                }),
                'pagination' => [
                    'current_page' => $enrollments->currentPage(),
                    'last_page' => $enrollments->lastPage(),
                    'per_page' => $enrollments->perPage(),
                    'total' => $enrollments->total(),
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Course not found'], 404);
        } catch (Exception $e) {
            return response()->json(['message' => 'An unexpected error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    
    // [Enrollments] POST /users/{userId}/enrollments/{courseId}
    // 選生選課
    public function store(Request $request, $userId, $courseId)
    {
        if ($request->userID != $userId) {
            return response()->json(['message' => 'Unauthorized. You can only enroll yourself.'], 403);
        }

        DB::beginTransaction();

        try {
            $course = Courses::findOrFail($courseId);

            $currentEnrollmentCount = Enrollments::where('course_id', $courseId)->count();
            
            if ($currentEnrollmentCount >= $course->choose_limit) {
                DB::rollBack();
                return response()->json(['message' => 'Enrollment failed: Course is full.'], 409);
            }

            $alreadyEnrolled = Enrollments::where('user_id', $userId)
                ->where('course_id', $courseId)
                ->exists();

            if ($alreadyEnrolled) {
                DB::rollBack();
                return response()->json(['message' => 'Enrollment failed: Already enrolled in this course.'], 409);
            }
            
            // TODO: 檢查衝堂邏輯 (較複雜，暫緩)

            $enrollment = Enrollments::create([
                'user_id' => $userId,
                'course_id' => $courseId,
                'semester' => $course->semester,
                'state' => 'enrolled',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Successfully enrolled in course.',
                'data' => $this->formatUserEnrollmentResponse($enrollment->load('course'))
            ], 201);

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Course not found.'], 404);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Database error during enrollment.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An error occurred during enrollment.', 'error' => $e->getMessage()], 500);
        }
    }
    
    // [Enrollments] DELETE /users/{userId}/enrollments/{courseId}
    // 刪除選課
    public function destroy(Request $request, $userId, $courseId)
    {
        if ($request->userID != $userId) {
            return response()->json(['message' => 'Unauthorized. You can only withdraw yourself.'], 403);
        }

        DB::beginTransaction();

        try {
            $enrollment = Enrollments::where('user_id', $userId)
                ->where('course_id', $courseId)
                ->firstOrFail();

            $enrollment->delete();

            DB::commit();

            return response()->json(null, 204);

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Enrollment record not found.'], 404);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Database error during withdrawal.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An error occurred during withdrawal.', 'error' => $e->getMessage()], 500);
        }
    }
    
    
    // [Enrollments] POST /courses/enrollments
    // 執行篩選 (批次處理)
    public function batchProcess(Request $request)
    {
        // TODO : 實作批次處理篩選邏輯
        return response()->json(['message' => 'Batch enrollment request accepted for processing.'], 202);
    }


    private function formatUserEnrollmentResponse($enrollment)
    {
        $course = $enrollment->course;
        if (!$course) return null;

        return [
            'enrollmentId' => $enrollment->id,
            'state' => $enrollment->state,
            'course' => [
                'courseId' => $course->course_id,
                'courseName' => $course->course_name,
                'semester' => $course->semester,
                'departmentName' => $course->department->depart_name ?? null,
                'teacherName' => $course->teachers->first()->teacher_name ?? null,
                'credit' => $course->credit,
                'detailTime' => $course->detail_time,
                'classroomName' => $course->classroom->classroom_name ?? null,
            ]
        ];
    }

    private function formatCourseEnrollmentResponse($enrollment)
    {
        $user = $enrollment->user;
        if (!$user) return null;

        return [
            'enrollmentId' => $enrollment->id,
            'state' => $enrollment->state,
            'user' => [
                'userId' => $user->user_id,
                'userName' => $user->name,
                'userGrade' => $user->grade,
                'departmentName' => $user->department->depart_name ?? null,
            ]
        ];
    }
}
