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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚌 You've Been Assigned to a Route!</h1>
        </div>
        <div class="content">
            <p>Hello {{ $driver->name }},</p>
            
            <div class="success-badge">
                New Route Assignment
            </div>
            
            <p>You have been assigned to drive the following route. Please review the route details carefully.</p>
            
            <div class="route-details">
                <h3>Route Information</h3>
                <div class="detail-row">
                    <strong>Route Name:</strong>
                    <span>{{ $route->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Service Type:</strong>
                    <span>{{ strtoupper($route->service_type) }}</span>
                </div>
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
                <div class="detail-row">
                    <strong>Capacity:</strong>
                    <span>{{ $route->capacity }} students</span>
                </div>
                @if($route->vehicle)
                <div class="detail-row">
                    <strong>Vehicle:</strong>
                    <span>{{ $route->vehicle->license_plate }} ({{ $route->vehicle->type }})</span>
                </div>
                @endif
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span style="color: {{ $route->active ? '#059669' : '#DC2626' }}; font-weight: bold;">
                        {{ $route->active ? 'ACTIVE' : 'INACTIVE' }}
                    </span>
                </div>
            </div>
            
            <p><strong>Your Responsibilities:</strong></p>
            <ul>
                <li>Follow the designated route and schedule</li>
                <li>Mark each student pickup as complete in the driver app</li>
                <li>Ensure all students arrive safely at their destinations</li>
                <li>Complete the route after all students are dropped off</li>
                <li>Report any issues immediately to administration</li>
            </ul>
            
            <a href="{{ url('/driver/dashboard') }}" class="button">View Driver Dashboard</a>
            
            <p>If you have any questions about this route assignment, please contact the administration team.</p>
        </div>
        <div class="footer">
            <p><strong>On-Time Transportation for Kids</strong></p>
            <p>Private child transportation services</p>
            <p>Driver Support: support@ontimetransport.awsapps.com</p>
        </div>
    </div>
</body>
</html>

