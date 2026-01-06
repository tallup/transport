<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .booking-details {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <p>Your transport booking has been confirmed. Please find your invoice and receipt attached to this email.</p>
            
            <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>{{ $booking->route->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Pickup Point:</strong>
                    <span>{{ $booking->pickupPoint->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Plan Type:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Start Date:</strong>
                    <span>{{ $booking->start_date->format('F d, Y') }}</span>
                </div>
                @if($booking->end_date)
                <div class="detail-row">
                    <strong>End Date:</strong>
                    <span>{{ $booking->end_date->format('F d, Y') }}</span>
                </div>
                @endif
            </div>
            
            <a href="{{ url('/parent/dashboard') }}" class="button">View Booking</a>
            
            <p>Thank you for using our transport service!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>




