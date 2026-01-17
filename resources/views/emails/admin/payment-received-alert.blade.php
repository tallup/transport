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
        .success-badge {
            background-color: #D1FAE5;
            color: #065F46;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
            font-weight: bold;
        }
        .amount {
            font-size: 32px;
            color: #059669;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 Payment Received</h1>
        </div>
        <div class="content">
            <div class="success-badge">
                Payment Successfully Processed
            </div>
            
            <div class="amount">
                ${{ number_format($amount, 2) }}
            </div>
            
            <div class="booking-details">
                <h3>Payment Details</h3>
                <div class="detail-row">
                    <strong>Booking ID:</strong>
                    <span>#{{ $booking->id }}</span>
                </div>
                <div class="detail-row">
                    <strong>Amount:</strong>
                    <span>${{ number_format($amount, 2) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Payment Method:</strong>
                    <span>{{ strtoupper($paymentMethod) }}</span>
                </div>
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
                    <strong>Plan Type:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Payment Time:</strong>
                    <span>{{ now()->format('F d, Y g:i A') }}</span>
                </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Booking is now ACTIVE</li>
                <li>Confirmation email sent to parent</li>
                <li>Driver will see student on roster</li>
            </ul>
            
            <a href="{{ url('/admin/bookings/' . $booking->id) }}" class="button">View Booking Details</a>
        </div>
        <div class="footer">
            <p><strong>On-Time Transportation - Admin Portal</strong></p>
            <p>Private child transportation services</p>
        </div>
    </div>
</body>
</html>

