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
        .details {
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
        .badge {
            background-color: #DBEAFE;
            color: #1D4ED8;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
            font-weight: bold;
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
            <h1>{{ $period === 'pm' ? '✓ Drop-off Completed' : '✓ Pickup Completed' }}</h1>
        </div>
        <div class="content">
            <div class="badge">
                {{ strtoupper($period) }} {{ $period === 'pm' ? 'Drop-off' : 'Pickup' }} Completed
            </div>
            
            <p><strong>Admin Alert:</strong> A driver completed a {{ $period === 'pm' ? 'drop-off' : 'pickup' }}.</p>
            
            <div class="details">
                <h3>Trip Details</h3>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Parent:</strong>
                    <span>{{ $booking->student->parent->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>{{ $booking->route->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>{{ $period === 'pm' ? 'Drop-off Location' : 'Pickup Location' }}:</strong>
                    <span>{{ $pickupLocation }}</span>
                </div>
                <div class="detail-row">
                    <strong>Driver:</strong>
                    <span>{{ $driver->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Driver Email:</strong>
                    <span>{{ $driver->email }}</span>
                </div>
                <div class="detail-row">
                    <strong>Completed At:</strong>
                    <span>{{ $completedAt->format('F d, Y g:i A') }}</span>
                </div>
            </div>
            
            <a href="{{ url('/admin/bookings/' . $booking->id) }}" class="button">View Booking</a>
            
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                This is an automated notification for pickup/drop-off completion.
            </p>
        </div>
        <div class="footer">
            <p><strong>On-Time Transportation - Admin Portal</strong></p>
            <p>Private child transportation services</p>
        </div>
    </div>
</body>
</html>

