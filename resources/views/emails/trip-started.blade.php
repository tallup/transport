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
            background-color: #2563eb;
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
        .info-badge {
            background-color: #DBEAFE;
            color: #1e40af;
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
            <h1>Trip Started</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>

            <div class="info-badge">
                {{ strtoupper($period) }} Route – Driver Has Started
            </div>

            <p>The driver has started the {{ strtoupper($period) }} route. Please have your child ready at the pickup point.</p>

            <div class="booking-details">
                <h3>Route Details</h3>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>{{ $route->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Period:</strong>
                    <span>{{ strtoupper($period) }} ({{ $period === 'am' ? 'Morning' : 'Afternoon' }})</span>
                </div>
                <div class="detail-row">
                    <strong>Started At:</strong>
                    <span>{{ $startedAt->format('F d, Y g:i A') }}</span>
                </div>
                @if($route->driver)
                <div class="detail-row">
                    <strong>Driver:</strong>
                    <span>{{ $route->driver->name }}</span>
                </div>
                @endif
                @if($booking->pickupPoint)
                <div class="detail-row">
                    <strong>Pickup Point:</strong>
                    <span>{{ $booking->pickupPoint->name }}</span>
                </div>
                @endif
            </div>

            <p>Please ensure your student is at the pickup location on time.</p>

            <a href="{{ route('parent.bookings.show', $booking) }}" class="button">View Booking</a>

            <p>Thank you for trusting us with your child's transportation!</p>
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
