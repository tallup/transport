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
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4F46E5;
        }
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #4F46E5;
            margin: 10px 0;
        }
        .stat-label {
            color: #6b7280;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .section {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        table th {
            background-color: #f3f4f6;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
        }
        table td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Daily Activity Summary</h1>
            <p style="margin: 10px 0; opacity: 0.9;">{{ $date->format('l, F d, Y') }}</p>
        </div>
        <div class="content">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">New Bookings</div>
                    <div class="stat-number">{{ $stats['new_bookings'] ?? 0 }}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Cancelled Bookings</div>
                    <div class="stat-number">{{ $stats['cancelled_bookings'] ?? 0 }}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Completed Pickups</div>
                    <div class="stat-number">{{ $stats['completed_pickups'] ?? 0 }}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Revenue</div>
                    <div class="stat-number">${{ number_format($stats['revenue'] ?? 0, 2) }}</div>
                </div>
            </div>
            
            @if(!empty($stats['route_completions']))
            <div class="section">
                <h3>Route Completions</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Period</th>
                            <th>Driver</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($stats['route_completions'] as $completion)
                        <tr>
                            <td>{{ $completion['route_name'] }}</td>
                            <td>{{ strtoupper($completion['period']) }}</td>
                            <td>{{ $completion['driver_name'] }}</td>
                            <td>{{ $completion['time'] }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @endif
            
            @if(!empty($stats['active_bookings_count']))
            <div class="section">
                <h3>System Overview</h3>
                <p><strong>Total Active Bookings:</strong> {{ $stats['active_bookings_count'] }}</p>
                <p><strong>Total Active Routes:</strong> {{ $stats['active_routes_count'] ?? 0 }}</p>
                <p><strong>Total Students:</strong> {{ $stats['total_students'] ?? 0 }}</p>
                <p><strong>Total Parents:</strong> {{ $stats['total_parents'] ?? 0 }}</p>
            </div>
            @endif
            
            @if(!empty($stats['pending_actions']))
            <div class="section" style="background-color: #FEF3C7; border-left: 4px solid #F59E0B;">
                <h3 style="color: #92400E;">⚠️ Pending Actions</h3>
                <ul>
                    @foreach($stats['pending_actions'] as $action)
                    <li>{{ $action }}</li>
                    @endforeach
                </ul>
            </div>
            @endif
            
            <p style="text-align: center; margin-top: 30px;">
                <a href="{{ url('/admin/dashboard') }}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
                    View Admin Dashboard
                </a>
            </p>
        </div>
        <div class="footer">
            <p><strong>On-Time Transportation - Admin Portal</strong></p>
            <p>This summary is automatically generated and sent daily at 6:00 PM</p>
        </div>
    </div>
</body>
</html>

