<!DOCTYPE html>
<html>
<head>
    <title>Revenue Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { margin-top: 30px; padding: 15px; background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h1>Revenue Report</h1>
    <p>Generated: {{ $generated_at }}</p>
    
    @if(isset($report['summary']))
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Revenue:</strong> ${{ number_format($report['summary']['total_revenue'], 2) }}</p>
        <p><strong>Total Bookings:</strong> {{ $report['summary']['total_bookings'] }}</p>
        <p><strong>Period:</strong> {{ $report['summary']['period_start'] }} to {{ $report['summary']['period_end'] }}</p>
    </div>
    @endif

    @if(isset($report['data']) && count($report['data']) > 0)
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Revenue</th>
                <th>Bookings</th>
            </tr>
        </thead>
        <tbody>
            @foreach($report['data'] as $item)
            <tr>
                <td>{{ $item['label'] ?? $item['date'] }}</td>
                <td>${{ number_format($item['revenue'], 2) }}</td>
                <td>{{ $item['bookings_count'] ?? 0 }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p>No data available for this period.</p>
    @endif
</body>
</html>



