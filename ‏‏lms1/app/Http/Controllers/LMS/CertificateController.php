<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\Certificate;
use App\Models\LMS\Enrollment;
use Illuminate\Http\Request;
use PDF;

class CertificateController extends Controller
{
    public function generate(Enrollment $enrollment)
    {
        // authorization
        if ($enrollment->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $uuid = (string) \Str::uuid();
        $html = view('lms.certificate', ['enrollment'=>$enrollment, 'uuid'=>$uuid])->render();
        $pdf = PDF::loadHTML($html);
        $path = 'certificates/'.$uuid.'.pdf';
        \Storage::disk('public')->put($path, $pdf->output());

        $cert = Certificate::create([ 'enrollment_id'=>$enrollment->id, 'certificate_uuid'=>$uuid, 'pdf_path'=>$path ]);

        return response()->json(['certificate'=>$cert]);
    }

    public function download(Certificate $certificate)
    {
        return response()->download(storage_path('app/public/'.$certificate->pdf_path));
    }
}
