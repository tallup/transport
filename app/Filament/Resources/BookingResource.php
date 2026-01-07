<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Filament\Resources\BookingResource\RelationManagers;
use App\Models\Booking;
use App\Models\Route;
use App\Services\CapacityGuard;
use App\Services\RefundService;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    
    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('student_id')
                    ->relationship('student', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\Select::make('route_id')
                    ->relationship('route', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->reactive()
                    ->afterStateUpdated(fn ($state, Forms\Set $set) => $set('pickup_point_id', null)),
                Forms\Components\Select::make('pickup_point_id')
                    ->relationship('pickupPoint', 'name', fn ($query, $get) => $query->where('route_id', $get('route_id')))
                    ->searchable()
                    ->preload()
                    ->disabled(fn ($get) => !$get('route_id'))
                    ->helperText('Leave empty to use custom address below'),
                Forms\Components\Textarea::make('pickup_address')
                    ->label('Custom Pickup Address')
                    ->rows(2)
                    ->dehydrateStateUsing(fn ($state) => $state ? strip_tags($state) : null)
                    ->maxLength(500)
                    ->helperText('Enter a custom pickup address if not using a predefined pickup point')
                    ->columnSpanFull(),
                Forms\Components\Grid::make(2)
                    ->schema([
                        Forms\Components\TextInput::make('pickup_latitude')
                            ->label('Latitude')
                            ->numeric()
                            ->step(0.00000001)
                            ->helperText('Optional: GPS coordinates for navigation'),
                        Forms\Components\TextInput::make('pickup_longitude')
                            ->label('Longitude')
                            ->numeric()
                            ->step(0.00000001)
                            ->helperText('Optional: GPS coordinates for navigation'),
                    ]),
                Forms\Components\Select::make('plan_type')
                    ->options([
                        'weekly' => 'Weekly',
                        'bi_weekly' => 'Bi-Weekly',
                        'monthly' => 'Monthly',
                        'semester' => 'Semester',
                        'annual' => 'Annual',
                    ])
                    ->required(),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'cancelled' => 'Cancelled',
                        'expired' => 'Expired',
                    ])
                    ->default('pending')
                    ->required(),
                Forms\Components\DatePicker::make('start_date')
                    ->required()
                    ->native(false),
                Forms\Components\DatePicker::make('end_date')
                    ->native(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('student.name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('route.name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('pickup_location')
                    ->label('Pickup Location')
                    ->getStateUsing(function (Booking $record): string {
                        if ($record->pickup_address) {
                            return $record->pickup_address;
                        }
                        return $record->pickupPoint?->name ?? '—';
                    })
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->where('pickup_address', 'like', "%{$search}%")
                            ->orWhereHas('pickupPoint', fn (Builder $q) => 
                                $q->where('name', 'like', "%{$search}%")
                            );
                    })
                    ->wrap(),
                Tables\Columns\TextColumn::make('plan_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ucfirst(str_replace('_', '-', $state))),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'pending' => 'warning',
                        'cancelled' => 'danger',
                        'expired' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('start_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'cancelled' => 'Cancelled',
                        'expired' => 'Expired',
                    ]),
                Tables\Filters\SelectFilter::make('plan_type')
                    ->options([
                        'weekly' => 'Weekly',
                        'bi_weekly' => 'Bi-Weekly',
                        'monthly' => 'Monthly',
                        'semester' => 'Semester',
                        'annual' => 'Annual',
                    ]),
                Tables\Filters\Filter::make('start_date')
                    ->form([
                        Forms\Components\DatePicker::make('started_from'),
                        Forms\Components\DatePicker::make('started_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['started_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('start_date', '>=', $date),
                            )
                            ->when(
                                $data['started_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('start_date', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('full_refund')
                    ->label('Full Refund')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Process Full Refund')
                    ->modalDescription('Are you sure you want to process a full refund for this booking?')
                    ->action(function (Booking $record) {
                        $refundService = app(RefundService::class);
                        $result = $refundService->processRefund($record);
                        
                        if ($result['success']) {
                            Notification::make()
                                ->title('Refund Processed')
                                ->success()
                                ->body($result['message'])
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Refund Failed')
                                ->danger()
                                ->body($result['message'])
                                ->send();
                        }
                    })
                    ->visible(fn (Booking $record) => in_array($record->status, ['active', 'pending']) && $record->stripe_customer_id),
                Tables\Actions\Action::make('partial_refund')
                    ->label('Partial Refund')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->form([
                        Forms\Components\TextInput::make('amount')
                            ->label('Refund Amount ($)')
                            ->numeric()
                            ->required()
                            ->minValue(0.01)
                            ->prefix('$'),
                    ])
                    ->action(function (Booking $record, array $data) {
                        $refundService = app(RefundService::class);
                        $result = $refundService->processRefund($record, (float)$data['amount']);
                        
                        if ($result['success']) {
                            Notification::make()
                                ->title('Refund Processed')
                                ->success()
                                ->body($result['message'])
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Refund Failed')
                                ->danger()
                                ->body($result['message'])
                                ->send();
                        }
                    })
                    ->visible(fn (Booking $record) => in_array($record->status, ['active', 'pending']) && $record->stripe_customer_id),
                Tables\Actions\Action::make('cancel_with_refund')
                    ->label('Cancel & Refund')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Cancel Booking and Process Refund')
                    ->modalDescription('This will cancel the booking and process a full refund.')
                    ->action(function (Booking $record) {
                        $refundService = app(RefundService::class);
                        $result = $refundService->cancelBooking($record, true);
                        
                        if ($result['success']) {
                            Notification::make()
                                ->title('Booking Cancelled')
                                ->success()
                                ->body($result['message'])
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Cancellation Failed')
                                ->danger()
                                ->body($result['message'])
                                ->send();
                        }
                    })
                    ->visible(fn (Booking $record) => in_array($record->status, ['pending', 'active']) && $record->stripe_customer_id),
                Tables\Actions\Action::make('cancel_without_refund')
                    ->label('Cancel (No Refund)')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Cancel Booking Without Refund')
                    ->modalDescription('This will cancel the booking without processing a refund.')
                    ->action(function (Booking $record) {
                        $refundService = app(RefundService::class);
                        $result = $refundService->cancelBooking($record, false);
                        
                        if ($result['success']) {
                            Notification::make()
                                ->title('Booking Cancelled')
                                ->success()
                                ->body($result['message'])
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Cancellation Failed')
                                ->danger()
                                ->body($result['message'])
                                ->send();
                        }
                    })
                    ->visible(fn (Booking $record) => in_array($record->status, ['pending', 'active'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
                Tables\Actions\ExportBulkAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
