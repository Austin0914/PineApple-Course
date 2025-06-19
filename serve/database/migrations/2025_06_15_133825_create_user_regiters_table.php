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
        Schema::create('user_regiters', function (Blueprint $table) {
            $table->id('user_id'); // 主鍵，自動遞增
            $table->string('username')->unique(); // 使用者名稱，唯一值
            $table->string('password'); // 密碼
            $table->timestamps();
            
            $table->index('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_regiters');
    }
};
