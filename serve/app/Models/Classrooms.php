<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classrooms extends Model
{
    //classroom_id、depart_id、class_name
    protected $primaryKey = 'classroom_id';
    protected $fillable = [
        'depart_id',
        'classroom_name'
    ];
    protected $casts = [
        'depart_id' => 'integer',
        'classroom_name' => 'string'
    ];
    // 關聯到 Departments 模型
    public function department()
    {
        return $this->belongsTo(Departments::class, 'depart_id', 'depart_id');
    }
    // 關聯到 Courses 模型
    public function courses()
    {
        return $this->hasMany(Courses::class, 'classroom_id', 'classroom_id');
    }
    // 關聯到 Users 模型
    public function users()
    {
        return $this->hasMany(Users::class, 'classroom_id', 'classroom_id');
    }
}
