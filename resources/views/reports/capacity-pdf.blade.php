<!DOCTYPE html>
<html>
<head>
    <title>Capacity Utilization Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Capacity Utilization Report</h1>
    <p>Generated: {{ $generated_at }}</p>
    
    @if(isset($report['data']) && count($report['data']) > 0)
    <table>
        <thead>
            <tr>
                <th>Route</th>
                <th>Capacity</th>
                <th>Active Bookings</th>
                <th>Available</th>
                <th>Utilization %</th>
                <th>Driver</th>
            </tr>
        </thead>
        <tbody>
            @foreach($report['data'] as $route)
            <tr>
                <td>{{ $route['route_name'] }}</td>
                <td>{{ $route['capacity'] }}</td>
                <td>{{ $route['active_bookings'] }}</td>
                <td>{{ $route['available_seats'] }}</td>
                <td>{{ number_format($route['utilization_percent'], 2) }}%</td>
                <td>{{ $route['driver_name'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p>No data available.</p>
    @endif
</body>
</html>



