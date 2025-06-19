<?php

namespace App\Models;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;

class UserRegiter extends Model
{
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'username',
        'password',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'username' => 'string',
        'password' => 'string',
    ];

    protected $hidden = [
        'password',
    ];

    public function users()
    {
        return $this->hasOne(Users::class, 'user_id', 'user_id');
    }

    // 自動加密密碼 - 使用 Mutator
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    // 驗證密碼的方法
    public function verifyPassword($password)
    {
        return Hash::check($password, $this->password);
    }
}
