<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departments extends Model
{
    protected $primaryKey = 'depart_id';
    
    protected $fillable = [
        'depart_name',
    ];

    protected $casts = [
        'depart_name' => 'string',
    ];

    // 關聯到 Users 模型
    public function users()
    {
        return $this->hasMany(Users::class, 'depart_id','depart_id');
    }
    // 關聯到 Courses 模型
    public function courses()
    {
        return $this->hasMany(Courses::class,'depart_id','depart_id');
    }
    // 關聯到 Classrooms 模型
    public function classrooms()
    {
        return $this->hasMany(Classrooms::class, 'depart_id', 'depart_id');
    }
}
