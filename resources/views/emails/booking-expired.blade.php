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
            background-color: #DC2626;
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
        .expired-badge {
            background-color: #FEE2E2;
            color: #991B1B;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
            font-weight: bold;
        }
        .info-box {
            background-color: #EFF6FF;
            border-left: 4px solid #3B82F6;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ Booking Has Expired</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <div class="expired-badge">
                This booking has expired and is no longer active
            </div>
            
            <p>Your transport booking has reached its end date and transportation services have been discontinued for this booking.</p>
            
            <div class="booking-details">
                <h3>Expired Booking Details</h3>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>{{ $booking->route->name }}</span>
                </div>
                @if($booking->pickupPoint)
                <div class="detail-row">
                    <strong>Pickup Point:</strong>
                    <span>{{ $booking->pickupPoint->name }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <strong>Plan Type:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Start Date:</strong>
                    <span>{{ \Carbon\Carbon::parse($booking->start_date)->format('F d, Y') }}</span>
                </div>
                <div class="detail-row">
                    <strong>End Date:</strong>
                    <span>{{ \Carbon\Carbon::parse($booking->end_date)->format('F d, Y') }}</span>
                </div>
            </div>
            
            <div class="info-box">
                <strong>What This Means:</strong>
                <ul style="margin: 10px 0;">
                    <li>Your student has been removed from the route roster</li>
                    <li>No further transportation services will be provided</li>
                    <li>You will not be charged for this booking anymore</li>
                </ul>
            </div>
            
            <p><strong>Want to Continue Service?</strong></p>
            <p>If you'd like to resume transportation services for {{ $booking->student->name }}, you can create a new booking at any time.</p>
            
            <a href="{{ url('/parent/bookings/create') }}" class="button">Create New Booking</a>
            
            <p>Thank you for using our services! If you have any questions or feedback, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
            <p><strong>On-Time Transportation for Kids</strong></p>
            <p>Private child transportation services</p>
            <p>This is a private transportation company and is not a school bus service.</p>
            <p>If you have any questions, please contact us at support@ontimetransport.awsapps.com</p>
        </div>
    </div>
</body>
</html>

