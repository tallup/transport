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
        .info-badge {
            background-color: #DBEAFE;
            color: #1E40AF;
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
            <h1>Driver Assigned to Your Route</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <div class="info-badge">
                A driver has been assigned to your route!
            </div>
            
            <p>We're pleased to inform you that a driver has been assigned to your student's transportation route.</p>
            
            <div class="booking-details">
                <h3>Driver Information</h3>
                <div class="detail-row">
                    <strong>Driver Name:</strong>
                    <span>{{ $driver->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Contact Number:</strong>
                    <span>{{ $driver->phone ?? 'Available through support' }}</span>
                </div>
            </div>
            
            <div class="booking-details">
                <h3>Route & Booking Details</h3>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>{{ $route->name }}</span>
                </div>
                @if($booking->pickupPoint)
                <div class="detail-row">
                    <strong>Pickup Point:</strong>
                    <span>{{ $booking->pickupPoint->name }}</span>
                </div>
                @endif
                @if($route->pickup_time)
                <div class="detail-row">
                    <strong>Pickup Time (AM):</strong>
                    <span>{{ \Carbon\Carbon::parse($route->pickup_time)->format('g:i A') }}</span>
                </div>
                @endif
                @if($route->dropoff_time)
                <div class="detail-row">
                    <strong>Dropoff Time (PM):</strong>
                    <span>{{ \Carbon\Carbon::parse($route->dropoff_time)->format('g:i A') }}</span>
                </div>
                @endif
            </div>
            
            <p>Your student's transportation service will begin as scheduled. The driver will follow the route and pickup times as planned.</p>
            
            <a href="{{ url('/parent/dashboard') }}" class="button">View Dashboard</a>
            
            <p>If you have any questions about your driver or route, please contact our support team.</p>
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



