<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HelpController extends Controller
{
    public function parentPortal()
    {
        return Inertia::render('Help/ParentGuide');
    }

    public function adminPortal()
    {
        return Inertia::render('Help/AdminGuide');
    }

    public function driverPortal()
    {
        return Inertia::render('Help/DriverGuide');
    }
}
