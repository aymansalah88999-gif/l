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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('image_url')->nullable();
            $table->string('level')->default('beginner'); // beginner, intermediate, advanced
            $table->integer('duration_hours')->nullable(); // مدة الكورس بالساعات
            $table->decimal('price', 8, 2)->default(0);
            $table->integer('students_count')->default(0);
            $table->string('status')->default('active'); // active, archived
            $table->text('what_you_will_learn')->nullable(); // ما ستتعلمه
            $table->text('requirements')->nullable(); // المتطلبات
            $table->timestamps();
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
