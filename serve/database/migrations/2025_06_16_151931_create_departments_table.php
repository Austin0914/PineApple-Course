<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // 資料欄位 depart_id、depart_name
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id('depart_id'); // 主鍵，自動遞增
            $table->string('depart_name');
            $table->timestamps();
            
            $table->unique('depart_name'); // 確保系所名稱唯一
            $table->index('depart_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
