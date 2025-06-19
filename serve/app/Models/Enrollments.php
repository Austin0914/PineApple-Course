<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollments extends Model
{
    // (user_id、(course_id、semester))、state、enrollment_time
    protected $fillable = [
        'user_id',
        'course_id',
        'semester',
        'state',
    ];
    protected $casts = [
        'user_id' => 'integer',
        'course_id' => 'integer',
        'semester' => 'string',
        'state' => 'string',
    ];

    // 關聯到 Users 模型
    public function user()
    {
        return $this->belongsTo(Users::class, 'user_id', 'user_id');
    }

    // 關聯到 Courses 模型
    public function course()
    {
        return $this->belongsTo(Courses::class, 'course_id', 'course_id');
    }
}
