<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseTimes extends Model
{
    //(course_id、semester、weekdays、period)
    protected $primaryKey = 'course_id';
    protected $fillable = [
        'course_id',
        'semester',
        'weekdays',
        'period',
    ];
    protected $casts = [
        'course_id' => 'integer',
        'semester' => 'string',
        'weekdays' => 'string',
        'period' => 'string',
    ];
    // 關聯到 Courses 模型
    public function course()
    {
        return $this->belongsTo(Courses::class, 'course_id', 'course_id');
    }
    
}
