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
        .receipt-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .receipt-table th, .receipt-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .receipt-table .amount { text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Received</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>

            <p>We received your payment. Your booking is now active. Please find your invoice and receipt attached to this email.</p>

            @if(isset($amountPaid) && $amountPaid !== null)
            <div class="booking-details">
                <h3>Payment Summary</h3>
                <div class="detail-row">
                    <strong>Amount Paid:</strong>
                    <span>{{ app(\App\Services\PricingService::class)->formatPrice($amountPaid) }}</span>
                </div>
                @if(!empty($paymentMethod))
                <div class="detail-row">
                    <strong>Payment Method:</strong>
                    <span>{{ ucfirst($paymentMethod) }}</span>
                </div>
                @endif
                @if(!empty($paymentDate))
                <div class="detail-row">
                    <strong>Payment Date:</strong>
                    <span>{{ \Carbon\Carbon::parse($paymentDate)->format('F d, Y') }}</span>
                </div>
                @endif
                @if(!empty($paymentReference))
                <div class="detail-row">
                    <strong>Reference:</strong>
                    <span>{{ $paymentReference }}</span>
                </div>
                @endif
            </div>
            @endif

            <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                    <strong>Student:</strong>
                    <span>{{ $booking->student?->name ?? 'N/A' }}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>{{ $booking->route?->name ?? 'N/A' }}</span>
                </div>
                <div class="detail-row">
                    <strong>Pickup:</strong>
                    <span>
                        @if($booking->pickupPoint)
                            {{ $booking->pickupPoint->name }}@if($booking->pickupPoint->address)<br><small>{{ $booking->pickupPoint->address }}</small>@endif
                        @else
                            {{ $booking->pickup_address ?? 'N/A' }}
                        @endif
                    </span>
                </div>
                <div class="detail-row">
                    <strong>Plan Type:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }}</span>
                </div>
                @if($booking->trip_type ?? null)
                <div class="detail-row">
                    <strong>Trip Type:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->trip_type)) }}</span>
                </div>
                @endif
                @if($booking->trip_direction ?? null)
                <div class="detail-row">
                    <strong>Trip Direction:</strong>
                    <span>{{ ucfirst(str_replace('_', ' ', $booking->trip_direction)) }}</span>
                </div>
                @endif
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
            </div>

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
            @endphp
            <div class="booking-details">
                <h3>Receipt</h3>
                <table class="receipt-table">
                    <tr>
                        <th>Item</th>
                        <th class="amount">Amount</th>
                    </tr>
                    @if($basePrice !== null && $finalPrice !== null)
                    <tr>
                        <td>Transport Service – {{ ucfirst(str_replace('_', ' ', $booking->plan_type)) }} Plan</td>
                        <td class="amount">{{ $hasDiscount ? $pricingService->formatPrice($basePrice) : $pricingService->formatPrice($finalPrice) }}</td>
                    </tr>
                    @if($hasDiscount)
                    <tr>
                        <td>{{ $discountLabel ?? 'Discount' }}</td>
                        <td class="amount">-{{ $pricingService->formatPrice($basePrice - $finalPrice) }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td><strong>Total</strong></td>
                        <td class="amount"><strong>{{ $pricingService->formatPrice($finalPrice) }}</strong></td>
                    </tr>
                    @else
                    @php
                        $fallbackTotal = null;
                        try {
                            $fallbackTotal = $pricingService->calculatePriceForBooking($booking);
                        } catch (\Throwable $e) {
                            $fallbackTotal = 0;
                        }
                    @endphp
                    <tr>
                        <td>Transport Service – {{ ucfirst(str_replace('_', ' ', $booking->plan_type ?? '')) }} Plan</td>
                        <td class="amount">{{ $pricingService->formatPrice($fallbackTotal ?? 0) }}</td>
                    </tr>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td class="amount"><strong>{{ $pricingService->formatPrice($fallbackTotal ?? 0) }}</strong></td>
                    </tr>
                    @endif
                </table>
            </div>

            <a href="{{ url('/parent/dashboard') }}" class="button">View Booking</a>

            <p>Thank you for using our transport service!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>








