<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailSending extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email : The email address to send test email to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify Amazon SES configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $toEmail = $this->argument('email');

        $this->info('Sending test email to: ' . $toEmail);
        $this->info('Mail Driver: ' . config('mail.default'));
        $this->info('From Address: ' . config('mail.from.address'));
        $this->info('From Name: ' . config('mail.from.name'));

        try {
            Mail::raw('This is a test email from On-Time Transportation system. If you received this, your Amazon SES configuration is working correctly!', function ($message) use ($toEmail) {
                $message->to($toEmail)
                    ->subject('Test Email - Amazon SES Configuration');
            });

            $this->info('✓ Test email sent successfully!');
            $this->info('Please check your inbox at: ' . $toEmail);
            $this->info('');
            $this->info('If using queue (QUEUE_CONNECTION=database):');
            $this->info('  - Check queue jobs: php artisan queue:monitor');
            $this->info('  - Process queue: php artisan queue:work');
            
            return 0;
        } catch (\Exception $e) {
            $this->error('✗ Failed to send test email!');
            $this->error('Error: ' . $e->getMessage());
            $this->error('');
            $this->error('Troubleshooting:');
            $this->error('  1. Verify AWS credentials in .env file');
            $this->error('  2. Check that MAIL_MAILER=ses in .env');
            $this->error('  3. Ensure sender email is verified in AWS SES');
            $this->error('  4. Check AWS region matches your SES setup');
            $this->error('  5. Run: php artisan config:clear');
            
            return 1;
        }
    }
}
