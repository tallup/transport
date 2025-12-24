<?php

namespace App\Filament\Resources\BookingResource\Pages;

use App\Filament\Resources\BookingResource;
use App\Models\Route;
use App\Services\CapacityGuard;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Filament\Notifications\Notification;

class CreateBooking extends CreateRecord
{
    protected static string $resource = BookingResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Validate capacity before creating booking
        if (isset($data['route_id'])) {
            $route = Route::find($data['route_id']);
            $capacityGuard = new CapacityGuard();
            
            try {
                $capacityGuard->validateBookingCapacity($route);
            } catch (\Exception $e) {
                Notification::make()
                    ->title('Capacity Error')
                    ->danger()
                    ->body($e->getMessage())
                    ->send();
                    
                $this->halt();
            }
        }
        
        return $data;
    }
}
