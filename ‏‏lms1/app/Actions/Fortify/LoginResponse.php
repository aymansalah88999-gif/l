<?php

namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Handle the response after login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toResponse($request)
    {
        $user = $request->user();

        $redirect = match ($user->role) {
            'admin' => route('admin.dashboard'),
            'instructor' => route('instructor.dashboard'),
            default => route('student.dashboard'),
        };

        return redirect()->intended($redirect);
    }
}
