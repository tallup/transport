# Environment Configuration for Amazon SES

## Required Environment Variables

Add or update the following variables in your `.env` file:

```env
# Mail Configuration
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=support@ontimetransport.awsapps.com
MAIL_FROM_NAME="On-Time Transportation"

# AWS Configuration (for SES)
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_DEFAULT_REGION=us-east-1

# Optional: SES Configuration Set (for tracking bounces/complaints)
AWS_SES_CONFIGURATION_SET=

# Queue Configuration (for background email processing)
QUEUE_CONNECTION=database
```

## Setup Steps

1. **Update your `.env` file** with the values above
2. **Add your AWS credentials** - Replace `your_access_key_id_here` and `your_secret_access_key_here` with your actual AWS credentials
3. **Clear configuration cache**:
   ```bash
   php artisan config:clear
   ```
4. **Start the queue worker** (in a separate terminal or as a background service):
   ```bash
   php artisan queue:work --tries=3
   ```

## Verifying Setup

Test that emails are working:
```bash
php artisan test:email
```

Check queue status:
```bash
php artisan queue:monitor
```

## Production Considerations

- Use a process manager like Supervisor to keep the queue worker running
- Monitor failed jobs with: `php artisan queue:failed`
- Retry failed jobs with: `php artisan queue:retry all`
- Set up AWS SES bounce and complaint handling
- Consider using AWS SES Configuration Sets for tracking

## Verified Email Addresses in SES

Your verified identities:
- support@ontimetransport.awsapps.com ✓
- homelogic360.net (domain) ✓
- ontimetransport.awsapps.com (domain) ✓
- taaltouray25@gmail.com ✓



