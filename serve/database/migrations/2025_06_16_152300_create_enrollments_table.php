<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // (user_id、(course_id、semester))、state、enrollment_time
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // 外鍵，指向使用者
            $table->unsignedBigInteger('course_id'); // 外鍵，指向課程
            $table->string('semester'); // 學期
            $table->enum('state', ['enrolled', 'dropped', 'completed']);
            $table->timestamps();

            $table->unique(['user_id', 'course_id', 'semester']); // 確保同一使用者在同一學期只能選修同一門課程一次
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('course_id')->on('courses')->onDelete('cascade');
            $table->index('user_id');
            $table->index('course_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
