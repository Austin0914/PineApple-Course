<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teachers extends Model
{
    
    protected $primaryKey = 'teacher_id';
    
    protected $fillable = [
        'teacher_name',
        'depart_id',
    ];

    // 關聯到 Departments 模型
    public function department()
    {
        return $this->belongsTo(Departments::class, 'depart_id', 'depart_id');
    }
    public function teachHistory()
    {
        return $this->hasMany(TeachHistory::class, 'teacher_id', 'teacher_id');
    }
}
