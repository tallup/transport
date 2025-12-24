<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $role = $user->attributes['role'] ?? $user->role ?? null;
        
        if (!in_array($role, ['super_admin', 'transport_admin'])) {
            abort(403, 'Unauthorized access to admin area.');
        }

        return $next($request);
    }
}
