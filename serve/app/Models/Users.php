<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Users extends Model
{
    // 指定主鍵
    protected $primaryKey = 'user_id';
    
    // 可以批量賦值的欄位
    protected $fillable = [
        'user_id',
        'public_number',
        'name',
        'depart_id',
        'grade',
        'role',
    ];

    protected $cast = [
        'user_id' => 'integer',
        'public_number' => 'string',
        'name' => 'string',
        'depart_id' => 'integer',
        'grade' => 'integer',
        'role' => 'string',
    ];
    
    public function userRegister()
    {
        return $this->hasOne(UserRegister::class, 'user_id', 'user_id');
    }

    // 與 Department 的關聯
    public function department()
    {
        return $this->belongsTo(Departments::class, 'depart_id','depart_id');
    }

    // 與 Sessions 的關聯
    public function sessions()
    {
        return $this->hasMany(Session::class, 'user_id', 'user_id');
    }

    // 與 Announcements 的關聯（作為發布者）
    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'user_id','announcer_id');
    }

    // 與 Enrollments 的關聯
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'user_id','user_id');
    }

    // 角色檢查方法
    public function getRole()
    {
        if ($this->role === 0) {
            return 'student';
        } elseif ($this->role === 1) {
            return 'teacher';
        } elseif ($this->role === 2) {
            return 'admin';
        } else {
            return 'unknown';
        }
    }
}
