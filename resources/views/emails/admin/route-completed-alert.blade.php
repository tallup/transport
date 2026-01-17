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
            background-color: #059669;
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
        .route-details {
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
        .success-badge {
            background-color: #D1FAE5;
            color: #065F46;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
            font-weight: bold;
        }
        .stat-highlight {
            font-size: 32px;
            color: #059669;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Route Completed</h1>
        </div>
        <div class="content">
            <div class="success-badge">
                {{ strtoupper($period) }} Route Successfully Completed
            </div>
            
            <p><strong>Admin Alert:</strong> A driver has successfully completed their route.</p>
            
            <div class="stat-highlight">
                {{ $studentsCount }} Student{{ $studentsCount !== 1 ? 's' : '' }} Transported
            </div>
            
            <div class="route-details">
                <h3>Route Details</h3>
                <div class="detail-row">
                    <strong>Route Name:</strong>
                    <span>{{ $route->name }}</span>
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
                    <strong>Period:</strong>
                    <span>{{ strtoupper($period) }} ({{ $period === 'am' ? 'Morning Pickup' : 'Afternoon Drop-off' }})</span>
                </div>
                <div class="detail-row">
                    <strong>Completed At:</strong>
                    <span>{{ $completedAt->format('F d, Y g:i A') }}</span>
                </div>
                <div class="detail-row">
                    <strong>Students Transported:</strong>
                    <span><strong>{{ $studentsCount }}</strong></span>
                </div>
                @if($route->vehicle)
                <div class="detail-row">
                    <strong>Vehicle:</strong>
                    <span>{{ $route->vehicle->license_plate }} ({{ $route->vehicle->type }})</span>
                </div>
                @endif
            </div>
            
            <p><strong>Completion Summary:</strong></p>
            <ul>
                @if($period === 'am')
                <li>All {{ $studentsCount }} student(s) picked up successfully</li>
                <li>Students delivered to their destinations</li>
                <li>Morning route completed on time</li>
                @else
                <li>All {{ $studentsCount }} student(s) picked up from destinations</li>
                <li>Students safely dropped off at designated locations</li>
                <li>Afternoon route completed successfully</li>
                @endif
                <li>All parents have been notified</li>
            </ul>
            
            <a href="{{ url('/admin/routes/' . $route->id) }}" class="button">View Route Details</a>
            
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                This is an automated notification sent when drivers complete their routes.
            </p>
        </div>
        <div class="footer">
            <p><strong>On-Time Transportation - Admin Portal</strong></p>
            <p>Private child transportation services</p>
        </div>
    </div>
</body>
</html>

