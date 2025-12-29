<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use Illuminate\Http\Request;

class PolicyController extends Controller
{
    /**
     * Get all active policies grouped by category.
     */
    public function index()
    {
        $policies = Policy::active()
            ->ordered()
            ->get()
            ->groupBy('category');

        return response()->json([
            'policies' => $policies,
            'categories' => $policies->keys()->toArray(),
        ]);
    }

    /**
     * Get a single policy.
     */
    public function show(Policy $policy)
    {
        return response()->json($policy);
    }
}
