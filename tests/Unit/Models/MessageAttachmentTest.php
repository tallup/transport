<?php

namespace Tests\Unit\Models;

use App\Models\MessageAttachment;
use Tests\TestCase;

class MessageAttachmentTest extends TestCase
{
    public function test_url_is_null_until_scan_is_clean(): void
    {
        $pending = new MessageAttachment([
            'file_path' => 'message-attachments/file.pdf',
            'scan_status' => 'pending',
        ]);
        $this->assertNull($pending->url);

        $infected = new MessageAttachment([
            'file_path' => 'message-attachments/file.pdf',
            'scan_status' => 'infected',
        ]);
        $this->assertNull($infected->url);
    }

    public function test_url_is_returned_once_clean(): void
    {
        $clean = new MessageAttachment([
            'file_path' => 'message-attachments/file.pdf',
            'scan_status' => 'clean',
        ]);

        $this->assertNotNull($clean->url);
        $this->assertStringContainsString('message-attachments/file.pdf', $clean->url);
    }
}
