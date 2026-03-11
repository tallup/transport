<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1f2f4f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; }
        .field { margin-bottom: 16px; }
        .label { font-weight: bold; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .message-body { white-space: pre-wrap; word-wrap: break-word; }
        .footer { text-align: center; padding: 16px; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Contact Form Submission</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">On-Time Transportation</p>
        </div>
        <div class="content">
            <p>A new message was submitted from your website contact form.</p>

            <div class="field">
                <div class="label">From (name)</div>
                <div class="value">{{ $senderName }}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a></div>
            </div>
            <div class="field">
                <div class="label">Subject</div>
                <div class="value">{{ $subject }}</div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="value message-body">{{ $message }}</div>
            </div>

            <p style="margin-top: 20px; font-size: 14px; color: #64748b;">You can reply directly to this email to respond to the sender.</p>
        </div>
        <div class="footer">
            This email was sent from the contact form at {{ config('app.url') }}
        </div>
    </div>
</body>
</html>
