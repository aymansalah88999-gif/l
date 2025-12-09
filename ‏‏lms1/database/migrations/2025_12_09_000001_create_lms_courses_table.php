<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lms_courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->decimal('price', 8, 2)->nullable();
            $table->enum('level', ['beginner','intermediate','advanced'])->default('beginner');
            $table->enum('status', ['draft','pending','published'])->default('draft');
            $table->foreignId('created_by')->constrained('users');
            $table->unsignedInteger('students_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_courses');
    }
};
