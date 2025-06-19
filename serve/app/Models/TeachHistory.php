<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeachHistory extends Model
{
    // (teacher_id、(course_id、semester))
    protected $primaryKey = 'teacher_id';
    protected $fillable = [
        'teacher_id',
        'course_id',
        'semester',
    ];
    protected $casts = [
        'teacher_id' => 'integer',
        'course_id' => 'integer',
        'semester' => 'string',
    ];
    // 關聯到 Teachers 模型
    public function teacher()
    {
        return $this->belongsTo(Teachers::class, 'teacher_id', 'teacher_id');
    }
    // 關聯到 Courses 模型
    public function course()
    {
        return $this->belongsTo(Courses::class, 'course_id', 'course_id');
    }
}
