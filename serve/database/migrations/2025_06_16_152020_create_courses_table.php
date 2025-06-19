<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // 資料欄位 : (course_id、semester)PK、course_name、depart_id、note、choose_limit
    // 、classroom_id、credit、type、outline、grade、class、detail_time
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id('course_id'); // 主鍵，自動遞增
            $table->string('semester'); // 學期，作為複合主鍵的一部分
            $table->string('course_name'); // 課程名稱
            $table->unsignedBigInteger('depart_id')->nullable(); // 所屬系所
            $table->integer('credit')->default(0); // 學分數
            $table->string('type')->default('必修'); // 課程類型，預設為必修
            $table->text('outline')->nullable(); // 課程大綱
            $table->string('grade')->nullable(); // 適用年級
            $table->string('class')->nullable(); // 班級
            $table->string('detail_time')->nullable(); // 詳細上課時間
            $table->integer('choose_limit')->default(0); // 選課限制人數
            $table->unsignedBigInteger('classroom_id')->nullable(); // 所屬教室
            $table->text('note')->nullable(); // 課程備註
            $table->timestamps();
           
            $table->unique(['course_id', 'semester']); // 設定複合主鍵
           
            $table->index(['course_id', 'semester']); // 為複合主鍵建立索引
           

            $table->foreign('depart_id')->references('depart_id')->on('departments')->onDelete('set null');
            $table->foreign('classroom_id')->references('classroom_id')->on('classrooms')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
