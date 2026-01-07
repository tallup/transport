<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsDriver
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
        
        if ($role !== 'driver') {
            abort(403, 'Unauthorized access to driver area.');
        }

        return $next($request);
    }
}








