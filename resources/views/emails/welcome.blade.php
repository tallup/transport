<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1a2332;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 8px 0 0;
            color: #fbbf24;
            font-size: 14px;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .content h2 {
            color: #1a2332;
            margin-top: 0;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #1a2332;
            color: #fbbf24 !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>On-Time Transportation</h1>
            <p>Safe &amp; Reliable School Transport</p>
        </div>
        <div class="content">
            <h2>Welcome, {{ $user->name }}!</h2>

            <p>Your account has been successfully created on <strong>On-Time Transportation</strong>.</p>

            <p>You can now log in to manage your children's school transportation, create bookings, and track pickup schedules.</p>

            <p style="text-align: center;">
                <a href="{{ $loginUrl }}" class="button">Log In to Your Account</a>
            </p>

            <p>If you have any questions, feel free to contact our support team.</p>

            <p>Thank you for choosing On-Time Transportation!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} On-Time Transportation. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
