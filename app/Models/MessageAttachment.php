<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class MessageAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'file_path',
        'file_name',
        'original_name',
        'file_size',
        'mime_type',
        'scan_status',
    ];

    /**
     * Get the message that owns the attachment.
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Get the URL for the attachment.
     *
     * Only "clean" (virus-scanned) attachments are downloadable. Pending or
     * infected files return null so they are never served to clients.
     */
    public function getUrlAttribute(): ?string
    {
        if ($this->scan_status !== 'clean') {
            return null;
        }

        return Storage::url($this->file_path);
    }

    /**
     * Get the file size in human readable format.
     */
    public function getHumanReadableSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2).' '.$units[$i];
    }
}
