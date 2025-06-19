<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // (course_id、semester、weekdays、period)
    public function up(): void
    {
        Schema::create('course_times', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id'); // 課程ID，外鍵
            $table->string('semester');
            $table->integer('weekdays'); // 1-7 代表星期一到星期日
            $table->string('period'); // A 代表第一節課，B代表第二節課，以此類推
            $table->timestamps();

            $table->unique(['course_id', 'semester', 'weekdays', 'period']); // 確保同一課程在同一學期、同一星期、同一節次不會重複
            
            $table->foreign('course_id')->references('course_id')->on('courses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_times');
    }
};
