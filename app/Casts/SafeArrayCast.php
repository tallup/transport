<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

/**
 * Decodes JSON array columns without throwing when the DB value is corrupt or invalid.
 * Laravel's built-in "array" cast can surface JsonException on bad data and take down Inertia pages.
 */
class SafeArrayCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): array
    {
        if (! array_key_exists($key, $attributes) || $attributes[$key] === null) {
            return [];
        }

        $raw = $attributes[$key];

        if (is_array($raw)) {
            return $raw;
        }

        if (! is_string($raw) || $raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            Log::warning('SafeArrayCast: invalid JSON array in database column', [
                'model' => $model::class,
                'id' => $model->getKey(),
                'key' => $key,
                'json_error' => json_last_error_msg(),
            ]);

            return [];
        }

        return $decoded;
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        if ($value === null) {
            return [$key => null];
        }

        return [$key => json_encode(is_array($value) ? $value : [])];
    }
}
