<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lms_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('lms_courses')->cascadeOnDelete();
            $table->timestamp('enrolled_at')->nullable();
            $table->decimal('completion_percentage', 5, 2)->default(0);
            $table->decimal('final_grade', 5, 2)->nullable();
            $table->timestamps();
            $table->unique(['user_id','course_id']);
        });

        Schema::create('lms_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('lms_enrollments')->cascadeOnDelete();
            $table->string('certificate_uuid')->unique();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_certificates');
        Schema::dropIfExists('lms_enrollments');
    }
};
