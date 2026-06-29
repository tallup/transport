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

        if (! $user) {
            return redirect()->route('login');
        }

        // Role from the loaded model (accessor defaults to 'parent'); avoids a DB query per request.
        if (! in_array($user->role, ['super_admin', 'transport_admin', 'admin'], true)) {
            // Generic message — do not disclose the user's role.
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
