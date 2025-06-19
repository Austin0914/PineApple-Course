<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // 資料欄位 : classroom_id、depart_id、class_name
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id('classroom_id'); // 主鍵，自動遞增
            $table->unsignedBigInteger('depart_id')->nullable(); // 所屬系所
            $table->string('classroom_name'); // 教室名稱
            $table->timestamps();

            $table->foreign('depart_id')->references('depart_id')->on('departments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
