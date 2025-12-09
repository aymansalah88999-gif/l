<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // إذا لم يكن المستخدم مسجل دخول
        if (!auth()->check()) {
            return redirect('/login');
        }

        // التحقق من أن دور المستخدم موجود ضمن الأدوار المسموح بها
        if (!in_array(auth()->user()->role, $roles)) {
            abort(403, 'غير مسموح لك بالدخول إلى هذه الصفحة');
        }

        return $next($request);
    }
}
