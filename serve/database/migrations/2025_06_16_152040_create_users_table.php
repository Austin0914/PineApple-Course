<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // 資料欄位 : user_id、public_number、name、depart_id、grade、role、username、password
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique(); // 使用者 ID，唯一值
            $table->string('public_number')->unique();
            $table->string('name');
            $table->unsignedBigInteger('depart_id')->nullable();
            $table->integer('grade')->nullable();
            $table->enum('role', ['student', 'teacher', 'admin']); // 0 student, 1 teacher, 2 admin

            $table->foreign('user_id')->references('user_id')->on('user_regiters')->onDelete('cascade');
            $table->foreign('depart_id')->references('depart_id')->on('departments')->onDelete('set null');
            $table->timestamps();

            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
