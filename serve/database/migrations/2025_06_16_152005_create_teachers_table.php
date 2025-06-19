<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    // 資料欄位 : teacher_id、teacher_name、depart_id
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id('teacher_id'); // 主鍵，自動遞增
            $table->string('teacher_name'); // 教師姓名
            $table->unsignedBigInteger('depart_id')->nullable();
            $table->timestamps();

            $table->foreign('depart_id')->references('depart_id')->on('departments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
