<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnnouncementsController;
use App\Http\Controllers\CoursesController;
use App\Http\Controllers\EnrollmentsController;

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;

Route::middleware([
    AddQueuedCookiesToResponse::class,
    \App\Http\Middleware\EncryptCookies::class,
])->post('/users', [UsersController::class, 'create']);
Route::post('/users/{user_id}',[UsersController::class, 'update']);

Route::middleware([
    AddQueuedCookiesToResponse::class,
    \App\Http\Middleware\EncryptCookies::class,
])->post('/sessions', [AuthController::class, 'login']);
Route::middleware([
    AddQueuedCookiesToResponse::class,
    \App\Http\Middleware\EncryptCookies::class,
])->delete('/sessions', [AuthController::class, 'logout']);

Route::get('/announcements', [AnnouncementsController::class, 'index']);
Route::get('/announcements/{id}', [AnnouncementsController::class, 'show']);

Route::get('/courses', [CoursesController::class, 'index']);
Route::get('/courses/{courseId}', [CoursesController::class, 'show']);

Route::middleware('auth.session')->group(function () {
    Route::post('/announcements', [AnnouncementsController::class, 'store']);
    Route::patch('/announcements/{id}', [AnnouncementsController::class, 'update']);
    Route::delete('/announcements/{id}', [AnnouncementsController::class, 'destroy']);
    
    Route::post('/courses', [CoursesController::class, 'store']);
    Route::patch('/courses/{courseId}', [CoursesController::class, 'update']);
    Route::delete('/courses/{courseId}', [CoursesController::class, 'destroy']);

    Route::get('/users/{userId}/enrollments', [EnrollmentsController::class, 'getUserEnrollments']);
    Route::get('/courses/{courseId}/enrollments', [EnrollmentsController::class, 'getCourseEnrollments']);
    Route::post('/users/{userId}/enrollments/{courseId}', [EnrollmentsController::class, 'store']);
    Route::delete('/users/{userId}/enrollments/{courseId}', [EnrollmentsController::class, 'destroy']);
    Route::post('/courses/enrollments', [EnrollmentsController::class, 'batchProcess']);
});