<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $students = Student::where('parent_id', $user->id)->get();
            
        $bookings = Booking::whereIn('student_id', $students->pluck('id'))
            ->with(['student', 'route', 'pickupPoint'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Parent/Dashboard', [
            'students' => $students,
            'bookings' => $bookings,
        ]);
    }
}
