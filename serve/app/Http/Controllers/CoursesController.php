<?php

namespace App\Http\Controllers;

use App\Models\Courses;
use App\Models\TeachHistory;
use App\Models\Teachers;
use App\Models\Classrooms;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Exception;

class CoursesController extends Controller
{
    // [Courses] GET /courses
    // 取得所有課程，支持分頁和學期過濾
    public function index(Request $request)
    {
        try {

            $query = Courses::query();

            if ($request->has('term')) {
                $query->where('semester', $request->term);
            }

            if ($request->has('departmentId')) {
                $query->where('depart_id', $request->departmentId);
            }

            if ($request->has('grade')) {
                $query->where('grade', $request->grade);
            }

            if ($request->has('page')) {
                $page = (int) $request->input('page', 1);
                $perPage = 10;
                $courses = $query->with(['department', 'classroom', 'teachers'])
                                ->withCount('users')
                                ->paginate($perPage, ['*'], 'page', $page);
                
                return response()->json([
                    'message' => 'Get courses successful',
                    'data' => collect($courses->items())->map(function ($course) {
                        return $this->formatCourseResponse($course);
                    }),
                    'pagination' => [
                        'current_page' => $courses->currentPage(),
                        'last_page' => $courses->lastPage(),
                        'per_page' => $courses->perPage(),
                        'total' => $courses->total(),
                    ]
                ], 200);
            } else {
                $courses = $query->with(['department', 'classroom', 'teachers'])->withCount('users')->get();
                
                return response()->json([
                    'message' => 'Get courses successful',
                    'data' => $courses->map(function ($course) {
                        return $this->formatCourseResponse($course);
                    })
                ], 200);
            }

        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error when retrieving courses.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'An unexpected error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    // [Courses] POST /courses
    // 建立一個新課程
    public function store(Request $request)
    {
        try {
            $userID = $request->userID;            
            $data = $request->validate([
                'departmentId' => 'required|integer|exists:departments,depart_id',
                'courseName' => 'required|string|max:255',
                'note' => 'nullable|string',
                'outline' => 'nullable|string',
                'detailTime' => 'required|string',
                'classroomName' => 'required|string|max:255',
                'chooseLimit' => 'required|integer|min:1',
                'credit' => 'required|integer|min:1',
                'type' => 'required|string',
                'grade' => 'required|string',
                'class' => 'required|string',
                'semester' => 'required|string',
                'teacher' => 'required|string',
            ]);

            $classroom = Classrooms::firstOrCreate(
                ['classroom_name' => $data['classroomName']],
                ['depart_id' => $data['departmentId']]
            );

            $course = Courses::create([
                'semester' => $data['semester'],
                'course_name' => $data['courseName'],
                'depart_id' => $data['departmentId'],
                'note' => $data['note'] ?? null,
                'choose_limit' => $data['chooseLimit'],
                'classroom_id' => $classroom->classroom_id,
                'credit' => $data['credit'],
                'type' => $data['type'],
                'outline' => $data['outline'] ?? null,
                'grade' => $data['grade'],
                'class' => $data['class'],
                'detail_time' => $data['detailTime'],
            ]);

            $teacher = Teachers::firstOrCreate(
                ['teacher_name' => $data['teacher']],
                ['depart_id' => $data['departmentId']]
            );

            TeachHistory::create([
                'teacher_id' => $teacher->teacher_id,
                'course_id' => $course->course_id,
                'semester' => $data['semester'],
            ]);

            $course->users_count = 0;

            return response()->json([
                'message' => 'Course created successfully',
                'data' => $this->formatCourseResponse($course->load(['department', 'classroom', 'teachers']))
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error creating course.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error creating course.', 'error' => $e->getMessage()], 500);
        }
    }

    
    // [Courses] GET /courses/{courseId}
    // 取得單個課程詳細資訊
    public function show(string $courseId)
    {
        try {
            $course = Courses::with(['department', 'classroom', 'teachers'])
                            ->withCount('users')
                            ->find($courseId);

            if (!$course) {
                return response()->json(['message' => 'Course not found'], 404);
            }

            return response()->json([
                'message' => 'Get course successful',
                'data' => $this->formatCourseResponse($course)
            ], 200);

        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error retrieving course.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'An unexpected error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    // [Courses] PATCH /courses/{courseId}
    // 更新課程資訊
    public function update(Request $request, string $courseId)
    {
        // 將所有操作包在一個資料庫交易中
        DB::beginTransaction();

        try {
            $userID = $request->userID;
            $course = Courses::findOrFail($courseId);

            $data = $request->validate([
                'departmentId' => 'sometimes|integer|exists:departments,depart_id',
                'courseName' => 'sometimes|string|max:255',
                'note' => 'nullable|string',
                'outline' => 'nullable|string',
                'detailTime' => 'sometimes|string',
                'classroomName' => 'sometimes|string|max:255',
                'chooseLimit' => 'sometimes|integer|min:0',
                'credit' => 'sometimes|integer|min:1',
                'type' => 'sometimes|string',
                'grade' => 'sometimes|string',
                'class' => 'sometimes|string',
                'semester' => 'sometimes|string',
                'teacher' => 'sometimes|string',
            ]);

            if (isset($data['classroomName'])) {
                $classroom = Classrooms::firstOrCreate(
                    ['classroom_name' => $data['classroomName']],
                    ['depart_id' => $data['departmentId'] ?? $course->depart_id]
                );
                $course->classroom_id = $classroom->classroom_id;
            }

            if (isset($data['teacher'])) {
                $newTeacher = Teachers::firstOrCreate(
                    ['teacher_name' => $data['teacher']],
                    ['depart_id' => $data['departmentId'] ?? $course->depart_id]
                );

                TeachHistory::where('course_id', $course->course_id)
                            ->where('semester', $data['semester'] ?? $course->semester)
                            ->update(['teacher_id' => $newTeacher->teacher_id]);
            }
            
            $courseUpdateData = [];
            if (isset($data['courseName'])) $courseUpdateData['course_name'] = $data['courseName'];
            if (isset($data['departmentId'])) $courseUpdateData['depart_id'] = $data['departmentId'];
            if (array_key_exists('note', $data)) $courseUpdateData['note'] = $data['note'];
            if (array_key_exists('outline', $data)) $courseUpdateData['outline'] = $data['outline'];
            if (isset($data['detailTime'])) $courseUpdateData['detail_time'] = $data['detailTime'];
            if (isset($data['chooseLimit'])) $courseUpdateData['choose_limit'] = $data['chooseLimit'];
            if (isset($data['credit'])) $courseUpdateData['credit'] = $data['credit'];
            if (isset($data['type'])) $courseUpdateData['type'] = $data['type'];
            if (isset($data['grade'])) $courseUpdateData['grade'] = $data['grade'];
            if (isset($data['class'])) $courseUpdateData['class'] = $data['class'];
            if (isset($data['semester'])) $courseUpdateData['semester'] = $data['semester'];

            if (!empty($courseUpdateData)) {
                $course->update($courseUpdateData);
            }
            
            $course->save();

            DB::commit();

            return response()->json([
                'message' => 'Course updated successfully',
                'data' => $this->formatCourseResponse($course->fresh()->load(['department', 'classroom', 'teachers'])->loadCount('users'))
            ], 200);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Course not found'], 404);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Database error updating course.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error updating course.', 'error' => $e->getMessage()], 500);
        }
    }

    // [Courses] DELETE /courses/{courseId}
    // 刪除課程
    public function destroy(Request $request, string $courseId)
    {
        try {
            $userID = $request->userID;
            $course = Courses::find($courseId);

            if (!$course) {
                return response()->json(['message' => 'Course not found'], 404);
            }

            $isTeacher = TeachHistory::where('course_id', $courseId)->exists();
            if (!$isTeacher) {
                return response()->json(['message' => 'Unauthorized to delete this course'], 403);
            }

            TeachHistory::where('course_id', $courseId)->delete();

            $course->delete();
            return response()->json(null, 204);

        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error deleting course.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error deleting course.', 'error' => $e->getMessage()], 500);
        }
    }    

    private function formatCourseResponse($course)
    {
        return [
            'courseId' => $course->course_id,
            'departmentId' => $course->depart_id,
            'departmentName' => $course->department->depart_name ?? null,
            'teacherId' => $course->teachers->first()->teacher_id ?? null,
            'teacherName' => $course->teachers->first()->teacher_name ?? null,
            'courseName' => $course->course_name,
            'note' => $course->note,
            'outline' => $course->outline,
            'detailTime' => $course->detail_time,
            'classroomName' => $course->classroom->classroom_name ?? null,
            'chooseLimit' => $course->choose_limit,
            'currentEnrollment' => $course->users_count ?? 0,
            'credit' => $course->credit,
            'type' => $course->type,
            'grade' => $course->grade,
            'class' => $course->class,
            'semester' => $course->semester,
        ];
    }
}
