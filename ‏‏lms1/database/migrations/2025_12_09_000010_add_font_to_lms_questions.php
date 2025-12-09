<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lms_questions', function (Blueprint $table) {
            $table->string('font')->nullable()->after('options');
        });
    }

    public function down(): void
    {
        Schema::table('lms_questions', function (Blueprint $table) {
            $table->dropColumn('font');
        });
    }
};
