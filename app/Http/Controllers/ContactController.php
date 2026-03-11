<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Show the contact form.
     */
    public function index(Request $request)
    {
        return Inertia::render('Contact', [
            'auth' => ['user' => $request->user()],
        ]);
    }

    /**
     * Submit the contact form and send email to support.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $supportEmail = config('mail.support_email', config('mail.from.address'));

        Mail::to($supportEmail)->send(new ContactFormSubmitted(
            $validated['name'],
            $validated['email'],
            $validated['subject'],
            $validated['message']
        ));

        return back()->with('success', 'Thank you for your message. We will get back to you as soon as possible.');
    }
}
