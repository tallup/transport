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
        .changes-list {
            background-color: #FEF3C7;
            padding: 15px;
            border-left: 4px solid #F59E0B;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Route Information Updated</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <div class="warning-badge">
                Important: Route details have been updated
            </div>
            
            <p>This is to notify you that there have been changes to your student's transportation route. Please review the updated information below.</p>
            
            @if(!empty($changes))
            <div class="changes-list">
                <h4 style="margin-top: 0;">What Changed:</h4>
                <ul style="margin-bottom: 0;">
                    @foreach($changes as $change)
                        <li>{{ $change }}</li>
                    @endforeach
                </ul>
            </div>
            @endif
            
            <div class="booking-details">
                <h3>Updated Route Information</h3>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>{{ $route->name }}</span>
                </div>
                @if($route->driver)
                <div class="detail-row">
                    <strong>Driver:</strong>
                    <span>{{ $route->driver->name }}</span>
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
                @if($booking->pickupPoint)
                <div class="detail-row">
                    <strong>Pickup Point:</strong>
                    <span>{{ $booking->pickupPoint->name }}</span>
                </div>
                @endif
            </div>
            
            <p><strong>Please note:</strong> These changes will take effect immediately. Make sure to adjust your schedule accordingly.</p>
            
            <a href="{{ url('/parent/bookings') }}" class="button">View Full Booking Details</a>
            
            <p>If you have any questions or concerns about these changes, please contact our support team immediately.</p>
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

