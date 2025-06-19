<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Courses extends Model
{
    // 資料欄位 : (course_id、semester)PK、course_name、depart_id、note、choose_limit
    // 、classroom_id、credit、type、outline、grade、class、detail_time
    protected $primaryKey = 'course_id';

    protected $fillable = [
        'semester',
        'course_name',
        'depart_id',
        'note',
        'choose_limit',
        'classroom_id',
        'credit',
        'type',
        'outline',
        'grade',
        'class',
        'detail_time'
    ];

    protected $casts = [
        'semester' => 'string',
        'course_name' => 'string',
        'depart_id' => 'integer',
        'note' => 'string',
        'choose_limit' => 'integer',
        'classroom_id' => 'integer',
        'credit' => 'integer',
        'type' => 'string',
        'outline' => 'string',
        'grade' => 'string',
        'class' => 'string',
        'detail_time' => 'string'
    ];

    public function department()
    {
        return $this->belongsTo(Departments::class, 'depart_id', 'depart_id');
    }

    public function classroom()
    {
        return $this->belongsTo(Classrooms::class, 'classroom_id', 'classroom_id');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teachers::class, 'teach_histories', 'course_id', 'teacher_id')
                    ->withPivot('semester');
    }

    public function users()
    {
        return $this->belongsToMany(Users::class, 'enrollments', 'course_id', 'user_id')
                    ->withPivot('semester');
    }

    public function course_times()
    {
        return $this->hasMany(CourseTimes::class, 'course_id', 'course_id');
    }


}
