<?php

namespace App\Services\LMS;

use App\Models\LMS\Enrollment;
use PDF;

class CertificateService
{
    public function generate(Enrollment $enrollment)
    {
        $uuid = (string) \Str::uuid();
        $html = view('lms.certificate', ['enrollment'=>$enrollment, 'uuid'=>$uuid])->render();
        $pdf = PDF::loadHTML($html);
        $path = 'certificates/'.$uuid.'.pdf';
        \Storage::disk('public')->put($path, $pdf->output());
        return ['uuid'=>$uuid,'path'=>$path];
    }
}
