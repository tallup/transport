<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userData = null;
        
        if ($user) {
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ];
            
            // Safely get role - try multiple methods
            try {
                // First try to get role directly (fastest)
                if (isset($user->role) && $user->role !== null) {
                    $userData['role'] = $user->role;
                } else {
                    // Fallback: check if column exists in database
                    try {
                        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')) {
                            $userData['role'] = $user->role ?? 'parent';
                        } else {
                            $userData['role'] = 'parent';
                        }
                    } catch (\Exception $e) {
                        // If database check fails, default to parent
                        $userData['role'] = 'parent';
                    }
                }
            } catch (\Exception $e) {
                // If anything fails, default to parent
                $userData['role'] = 'parent';
            }
        }
        
        // Safely generate Ziggy routes
        $ziggyRoutes = [];
        try {
            // Check if Ziggy v2 class exists (new namespace)
            if (class_exists(\Tighten\Ziggy\Ziggy::class)) {
                $ziggy = new \Tighten\Ziggy\Ziggy();
                $ziggyRoutes = $ziggy->toArray();
            } 
            // Don't try v1 namespace - it doesn't exist in Ziggy v2
        } catch (\Exception $e) {
            // If Ziggy fails, use empty array - routes will still work via direct URLs
            $ziggyRoutes = [];
        } catch (\Error $e) {
            // Catch fatal errors if class doesn't exist
            $ziggyRoutes = [];
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
            'ziggy' => array_merge($ziggyRoutes, [
                'location' => $request->url(),
            ]),
        ];
    }
}
