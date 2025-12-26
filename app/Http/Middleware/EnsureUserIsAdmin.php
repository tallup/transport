<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Get role directly from database to ensure we have the latest value
        // This bypasses any caching or accessor issues
        $role = DB::table('users')
            ->where('id', $user->id)
            ->value('role');
        
        if (!in_array($role, ['super_admin', 'transport_admin'])) {
            abort(403, 'Unauthorized access to admin area. Your current role is: ' . ($role ?? 'not set'));
        }

        return $next($request);
    }
}
