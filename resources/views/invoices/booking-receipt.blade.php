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
    @php $paymentDetails = $paymentDetails ?? []; @endphp
    <div class="header">
        <h1>PAYMENT RECEIPT</h1>
        <div class="receipt-info">
            <span class="paid-badge">PAID</span><br>
            <strong>Receipt #:</strong> RCP-{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}<br>
            <strong>Date:</strong> {{ now()->format('F d, Y') }}<br>
            <strong>Booking ID:</strong> #{{ $booking->id }}
            @if(!empty($paymentDetails['date']) || !empty($paymentDetails['method']) || !empty($paymentDetails['reference']))
            <br>
            @if(!empty($paymentDetails['date']))
            <strong>Paid on:</strong> {{ \Carbon\Carbon::parse($paymentDetails['date'])->format('F d, Y') }}
            @endif
            @if(!empty($paymentDetails['method']))
            &nbsp;|&nbsp;<strong>Via:</strong> {{ ucfirst($paymentDetails['method']) }}
            @endif
            @if(!empty($paymentDetails['reference']))
            &nbsp;|&nbsp;<strong>Ref:</strong> {{ $paymentDetails['reference'] }}
            @endif
            @endif
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
                <td>Pickup</td>
                <td>
                    @if($booking->pickupPoint)
                        {{ $booking->pickupPoint->name }}@if($booking->pickupPoint->address)<br><small>{{ $booking->pickupPoint->address }}</small>@endif
                    @else
                        {{ $booking->pickup_address ?? 'N/A' }}
                    @endif
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
            $basePrice = null;
            $finalPrice = null;
            $hasDiscount = false;
            $discountLabel = null;
            if ($booking->route) {
                try {
                    $tripType = $booking->trip_type ?? 'two_way';
                    $basePrice = $pricingService->getBasePrice($booking->plan_type, $tripType, $booking->route);
                    $finalPrice = $pricingService->calculatePriceForBooking($booking);
                    $hasDiscount = $finalPrice < $basePrice;
                    if ($hasDiscount && $booking->manual_discount_type && $booking->manual_discount_value !== null) {
                        if ($booking->manual_discount_type === 'percentage') {
                            $discountLabel = 'Discount (' . (int) $booking->manual_discount_value . '% off)';
                        } else {
                            $discountLabel = 'Discount ($' . number_format((float) $booking->manual_discount_value, 2) . ' off)';
                        }
                    } elseif ($hasDiscount) {
                        $discountLabel = 'Promotional discount';
                    }
                } catch (\Throwable $e) {
                    $basePrice = null;
                    $finalPrice = null;
                    $hasDiscount = false;
                }
            }
            if ($finalPrice === null) {
                $finalPrice = $pricingService->calculatePriceForBooking($booking);
            }
        @endphp
        <table>
            <tr>
                <th>Item</th>
                <th style="text-align: right;">Amount</th>
            </tr>
            @if($basePrice !== null && $hasDiscount)
            <tr>
                <td>Transport Service – {{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }} Plan</td>
                <td style="text-align: right;">{{ $pricingService->formatPrice($basePrice) }}</td>
            </tr>
            <tr>
                <td>{{ $discountLabel ?? 'Discount' }}</td>
                <td style="text-align: right;">-{{ $pricingService->formatPrice($basePrice - $finalPrice) }}</td>
            </tr>
            @else
            <tr>
                <td>Transport Service – {{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }} Plan</td>
                <td style="text-align: right;">{{ $pricingService->formatPrice($finalPrice) }}</td>
            </tr>
            @endif
            <tr>
                <td><strong>Total Paid</strong></td>
                <td style="text-align: right;"><strong class="total">{{ $pricingService->formatPrice($finalPrice) }}</strong></td>
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








