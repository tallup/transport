<!DOCTYPE html>
<html>
<head>
    <title>Driver Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Driver Performance Report</h1>
    <p>Generated: {{ $generated_at }}</p>
    
    @if(isset($report['data']) && count($report['data']) > 0)
    <table>
        <thead>
            <tr>
                <th>Driver</th>
                <th>Routes</th>
                <th>Bookings</th>
                <th>Completions</th>
                <th>Pickups</th>
                <th>On-Time Rate</th>
            </tr>
        </thead>
        <tbody>
            @foreach($report['data'] as $driver)
            <tr>
                <td>{{ $driver['driver_name'] }}</td>
                <td>{{ $driver['total_routes'] }}</td>
                <td>{{ $driver['total_bookings'] }}</td>
                <td>{{ $driver['total_completions'] }}</td>
                <td>{{ $driver['total_pickups'] }}</td>
                <td>{{ number_format($driver['on_time_rate'], 2) }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p>No data available.</p>
    @endif
</body>
</html>



