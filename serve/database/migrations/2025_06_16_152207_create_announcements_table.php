<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id('announce_id'); // 主鍵，自動遞增
            $table->string('title'); // 公告標題
            $table->text('content'); // 公告內容
            $table->datetime('announce_date'); // 公告發布日期
            $table->datetime('end_date')->nullable(); // 公告結束日期（可為空）
            $table->unsignedBigInteger('announcer_id')->nullable(); // 發布者ID
            $table->timestamps(); // created_at, updated_at
            
            // 外鍵約束（ announcer_id 關聯到 users 表）
            $table->foreign('announcer_id')->references('user_id')->on('users')->onDelete('set null');;
            
            // 索引
            $table->index('announcer_id'); // 用於查詢特定發布者的公告
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
