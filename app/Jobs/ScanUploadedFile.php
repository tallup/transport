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

            return false;
        }

        fwrite($socket, "SCAN {$path}\n");
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
