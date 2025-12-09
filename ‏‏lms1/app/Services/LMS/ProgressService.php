<?php

namespace App\Services\LMS;

use App\Models\LMS\Enrollment;

class ProgressService
{
    public function updateProgress(Enrollment $enrollment, float $newPercentage)
    {
        $enrollment->completion_percentage = max(0, min(100, $newPercentage));
        $enrollment->save();
    }
}
