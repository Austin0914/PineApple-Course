<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Sessions extends Model
{
    //session_id, user_id、last_active、access_token
    protected $primaryKey = 'session_id';

    protected $fillable = [
        'user_id',
        'access_token',
        'updated_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'access_token' => 'string',
    ];

    // 關聯到 Users 模型
    public function users()
    {
        return $this->belongsTo(Users::class, 'user_id', 'user_id');
    }

    public static function generateAccessToken(int $length = 60): string
    {
        return Str::random($length);
    }

    public static function createForUser(int $userId): self
    {
        return static::create([
            'user_id' => $userId,
            'access_token' => static::generateAccessToken(),
            'updated_at' => now(),
        ]);
    }

    public static function refreshOrDelete(string $accessToken, int $ttlMinutes = 30): bool
    {
        $session = static::where('access_token', $accessToken)->first();
        
        if (!$session) {
            return false;
        }
        
        if ($session->updated_at->gt(now()->subMinutes($ttlMinutes))) {
            $session->updated_at = now();
            $session->save();
            return true;
        }
        
        $session->delete();
        return false;
    }

}
