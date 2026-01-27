<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @auth
            <meta name="user-id" content="{{ auth()->id() }}">
        @endauth

        <title inertia>{{ config('app.name', 'Student Transport System') }}</title>
        
        <!-- PWA Manifest -->
        <link rel="manifest" href="{{ asset('manifest.json') }}">
        <meta name="theme-color" content="#22304d">

        <!-- Favicon -->
        <link rel="icon" type="image/jpeg" href="{{ asset('on time.jpeg') }}">
        <link rel="shortcut icon" type="image/jpeg" href="{{ asset('on time.jpeg') }}">
        <link rel="apple-touch-icon" href="{{ asset('on time.jpeg') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
        @routes
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

