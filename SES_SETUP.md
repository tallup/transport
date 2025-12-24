# Amazon SES Configuration

## Environment Variables

Add the following to your `.env` file:

```env
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Student Transport System"

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_DEFAULT_REGION=us-east-1

# Optional: SES Configuration Set (for tracking)
AWS_SES_CONFIGURATION_SET=your-config-set-name
```

## Steps to Configure

1. **Install AWS SDK** (if not already installed):
   ```bash
   composer require aws/aws-sdk-php
   ```

2. **Verify your domain/email in SES**:
   - Go to AWS SES Console
   - Verify your sending domain or email address
   - Request production access if needed (you mentioned you already have this)

3. **Update .env file** with your AWS credentials

4. **Test email sending**:
   ```php
   php artisan tinker
   Mail::raw('Test email', function ($message) {
       $message->to('your-email@example.com')->subject('Test');
   });
   ```

## Notes

- Make sure your AWS credentials have SES send permissions
- The region should match your SES setup (default: us-east-1)
- For production, ensure your domain is verified in SES
- Consider using SES Configuration Sets for bounce/complaint handling

