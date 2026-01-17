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
            background-color: #F59E0B;
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
        .warning-badge {
            background-color: #FEF3C7;
            color: #92400E;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠ Booking Expiring Soon</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <div class="warning-badge">
                Your booking expires in {{ $daysRemaining }} {{ $daysRemaining === 1 ? 'day' : 'days' }}!
            </div>
            
            <p>This is a reminder that your transport booking will expire soon. To ensure uninterrupted service for your student, please renew your booking before it expires.</p>
            
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
                @if($booking->pickupPoint)
                <div class="detail-row">
                    <strong>Pickup Point:</strong>
                    <span>{{ $booking->pickupPoint->name }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <strong>Current Plan:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Expiration Date:</strong>
                    <span>{{ $booking->end_date->format('F d, Y') }}</span>
                </div>
                <div class="detail-row">
                    <strong>Days Remaining:</strong>
                    <span><strong>{{ $daysRemaining }}</strong></span>
                </div>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>If you renew before the expiration date, service will continue without interruption</li>
                <li>If the booking expires, transportation services will stop</li>
                <li>You can choose the same plan or select a different one when renewing</li>
            </ul>
            
            <a href="{{ url('/parent/bookings') }}" class="button">Renew Booking Now</a>
            
            <p>If you have any questions or need assistance with renewal, please don't hesitate to contact us.</p>
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



