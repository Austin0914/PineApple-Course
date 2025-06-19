<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcements extends Model
{
    protected $primaryKey = 'announce_id';
    
    protected $fillable = [
        'title',
        'content',
        'announce_date',
        'end_date',
        'announcer_id'
    ];

    protected $casts = [
        'title' => 'string',
        'content' => 'string',
        'announcer_id' => 'integer',
        'announce_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function announcer()
    {
        return $this->belongsTo(User::class, 'announcer_id');
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('announce_date', 'desc');
    }
}