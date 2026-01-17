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
        .alert {
            background-color: #DBEAFE;
            border-left: 4px solid #4F46E5;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Booking Created</h1>
        </div>
        <div class="content">
            <div class="alert">
                <strong>Admin Alert:</strong> A new booking has been created and requires your attention.
            </div>
            
            <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                    <strong>Booking ID:</strong>
                    <span>#{{ $booking->id }}</span>
                </div>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Parent:</strong>
                    <span>{{ $parent->name }} ({{ $parent->email }})</span>
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
                @elseif($booking->pickup_address)
                <div class="detail-row">
                    <strong>Pickup Address:</strong>
                    <span>{{ $booking->pickup_address }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <strong>Plan Type:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Trip Type:</strong>
                    <span>{{ $booking->trip_type === 'two_way' ? 'Two Way' : 'One Way' }}</span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span style="color: {{ $booking->status === 'active' ? '#059669' : '#F59E0B' }}; font-weight: bold;">
                        {{ strtoupper($booking->status) }}
                    </span>
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
                <div class="detail-row">
                    <strong>Created:</strong>
                    <span>{{ $booking->created_at->format('F d, Y g:i A') }}</span>
                </div>
            </div>
            
            <a href="{{ url('/admin/bookings/' . $booking->id) }}" class="button">View Booking in Admin Panel</a>
            
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                This is an automated notification sent to all transport administrators.
            </p>
        </div>
        <div class="footer">
            <p><strong>On-Time Transportation - Admin Portal</strong></p>
            <p>Private child transportation services</p>
        </div>
    </div>
</body>
</html>

