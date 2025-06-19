<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // 資料欄位 : session_id, user_id、last_active、access_token
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id('session_id'); // 主鍵，自動遞增
            $table->unsignedBigInteger('user_id'); // 使用者ID
            $table->string('access_token')->unique(); // 存儲訪問令牌，唯一值
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');

            $table->index('user_id');
            $table->index('access_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
