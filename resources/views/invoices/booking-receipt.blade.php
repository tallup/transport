<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt - Booking #{{ $booking->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #28a745;
        }
        .receipt-info {
            margin-top: 10px;
        }
        .receipt-details {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .receipt-details .left, .receipt-details .right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .receipt-details .right {
            text-align: right;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            font-size: 16px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th, table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .total {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            color: #28a745;
        }
        .paid-badge {
            background-color: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 3px;
            display: inline-block;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PAYMENT RECEIPT</h1>
        <div class="receipt-info">
            <span class="paid-badge">PAID</span><br>
            <strong>Receipt #:</strong> RCP-{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}<br>
            <strong>Date:</strong> {{ now()->format('F d, Y') }}<br>
            <strong>Booking ID:</strong> #{{ $booking->id }}
        </div>
    </div>

    <div class="receipt-details">
        <div class="left">
            <strong>Paid By:</strong><br>
            {{ $booking->student->parent->name }}<br>
            {{ $booking->student->parent->email }}<br>
        </div>
        <div class="right">
            <strong>Student:</strong><br>
            {{ $booking->student->name }}<br>
            {{ $booking->student->school->name ?? 'N/A' }}<br>
        </div>
    </div>

    <div class="section">
        <h2>Booking Details</h2>
        <table>
            <tr>
                <th>Description</th>
                <th>Details</th>
            </tr>
            <tr>
                <td>Route</td>
                <td>{{ $booking->route->name }}</td>
            </tr>
            <tr>
                <td>Pickup Point</td>
                <td>{{ $booking->pickupPoint->name }}<br>
                    <small>{{ $booking->pickupPoint->address }}</small>
                </td>
            </tr>
            <tr>
                <td>Plan Type</td>
                <td>{{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }}</td>
            </tr>
            <tr>
                <td>Start Date</td>
                <td>{{ $booking->start_date->format('F d, Y') }}</td>
            </tr>
            @if($booking->end_date)
            <tr>
                <td>End Date</td>
                <td>{{ $booking->end_date->format('F d, Y') }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="section">
        <h2>Payment Summary</h2>
        @php
            $pricingService = app(\App\Services\PricingService::class);
            $price = $pricingService->calculatePrice($booking->plan_type, $booking->route);
        @endphp
        <table>
            <tr>
                <th>Item</th>
                <th style="text-align: right;">Amount</th>
            </tr>
            <tr>
                <td>Transport Service - {{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }} Plan</td>
                <td style="text-align: right;">{{ $pricingService->formatPrice($price) }}</td>
            </tr>
            <tr>
                <td><strong>Total Paid</strong></td>
                <td style="text-align: right;"><strong class="total">{{ $pricingService->formatPrice($price) }}</strong></td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p><strong>Thank you for your payment!</strong></p>
        <p>Your booking has been confirmed. This receipt serves as proof of payment.</p>
        <p>For questions or concerns, please contact support.</p>
    </div>
</body>
</html>

