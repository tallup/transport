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
        .details {
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
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Parent Registered</h1>
        </div>
        <div class="content">
            <p>A new parent has registered on the On-Time Transportation platform.</p>
            
            <div class="details">
                <h3>Parent Details</h3>
                <div class="detail-row">
                    <strong>Name:</strong>
                    <span>{{ $parent->name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Email:</strong>
                    <span>{{ $parent->email }}</span>
                </div>
                <div class="detail-row">
                    <strong>Registration Date:</strong>
                    <span>{{ now()->format('F d, Y H:i A') }}</span>
                </div>
            </div>
            
            <a href="{{ url('/admin/users/' . $parent->id) }}" class="button">View Parent Profile</a>
            
            <p>You can manage this user from the admin dashboard.</p>
        </div>
        <div class="footer">
            <p>This is an automated notification from the transport system.</p>
        </div>
    </div>
</body>
</html>
