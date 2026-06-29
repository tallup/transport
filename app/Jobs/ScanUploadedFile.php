<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ScanUploadedFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly string $modelClass,
        public readonly int|string $modelId,
        public readonly string $attribute,
    ) {}

    public function handle(): void
    {
        $modelClass = $this->modelClass;
        $model = $modelClass::findOrFail($this->modelId);
        $driver = config('security.virus_scan.driver', 'null');

        if ($driver === 'null') {
            $model->update(['scan_status' => 'clean']);

            return;
        }

        $filePath = Storage::disk('public')->path($model->{$this->attribute});

        $infected = $this->scanWithClamav($filePath);

        if ($infected) {
            $this->quarantine($model, $filePath);
        } else {
            $model->update(['scan_status' => 'clean']);
        }
    }

    private function scanWithClamav(string $path): bool
    {
        $host = config('security.virus_scan.clamav.host');
        $port = (int) config('security.virus_scan.clamav.port');

        $socket = @fsockopen($host, $port, $errno, $errstr, 5);
        if (! $socket) {
            Log::error("ClamAV unreachable: {$errstr} ({$errno})");

            // Fail closed: an unreachable scanner must not be treated as "clean".
            // Throwing keeps the file in 'pending' (not downloadable) and lets the queue retry.
            throw new \RuntimeException('ClamAV scanner unreachable');
        }

        stream_set_timeout($socket, 30);

        // INSTREAM streams the file content over the socket, so it works whether clamd
        // runs on the same host or in a separate container without filesystem access.
        fwrite($socket, "zINSTREAM\0");

        $handle = @fopen($path, 'rb');
        if (! $handle) {
            fclose($socket);

            throw new \RuntimeException("Unable to open file for scanning: {$path}");
        }

        while (! feof($handle)) {
            $chunk = fread($handle, 8192);
            if ($chunk === '' || $chunk === false) {
                break;
            }
            fwrite($socket, pack('N', strlen($chunk)).$chunk);
        }
        fclose($handle);

        // A zero-length chunk terminates the INSTREAM upload.
        fwrite($socket, pack('N', 0));

        $response = '';
        while (! feof($socket)) {
            $response .= fgets($socket, 1024);
        }
        fclose($socket);

        return str_contains($response, 'FOUND');
    }

    private function quarantine(mixed $model, string $filePath): void
    {
        $quarantineDir = storage_path('app/private/quarantine');
        if (! is_dir($quarantineDir)) {
            mkdir($quarantineDir, 0750, true);
        }
        $basename = basename($filePath);
        @rename($filePath, $quarantineDir.'/'.$basename);

        $model->update(['scan_status' => 'infected']);

        Log::warning('Infected file quarantined', [
            'model' => get_class($model),
            'id' => $model->getKey(),
            'file' => $basename,
        ]);
    }
}
