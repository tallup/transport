<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PricingRuleResource\Pages;
use App\Filament\Resources\PricingRuleResource\RelationManagers;
use App\Models\PricingRule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PricingRuleResource extends Resource
{
    protected static ?string $model = PricingRule::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    
    protected static ?string $navigationGroup = 'Finance';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Pricing Details')
                    ->schema([
                        Forms\Components\Select::make('plan_type')
                            ->label('Plan Type')
                            ->options([
                                'weekly' => 'Weekly',
                                'bi_weekly' => 'Bi-Weekly',
                                'monthly' => 'Monthly',
                                'academic_term' => 'Academic Term',
                                'annual' => 'Annual',
                            ])
                            ->required()
                            ->live()
                            ->helperText('Select the billing period for this pricing rule'),
                        Forms\Components\Select::make('trip_type')
                            ->label('Trip Type')
                            ->options([
                                'one_way' => 'One Way',
                                'two_way' => 'Two Way',
                            ])
                            ->required()
                            ->default('two_way')
                            ->helperText('One way: pick up only or drop off only. Two way: both pick up and drop off'),
                        Forms\Components\TextInput::make('amount')
                            ->label('Price')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0)
                            ->step(0.01)
                            ->helperText('Enter the price for this plan type'),
                        Forms\Components\TextInput::make('currency')
                            ->label('Currency')
                            ->default('USD')
                            ->maxLength(3)
                            ->required()
                            ->helperText('Currency code (e.g., USD, EUR)'),
                        Forms\Components\Toggle::make('active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Inactive pricing rules will not be used for new bookings'),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Scope (Optional)')
                    ->description('Leave these empty for global pricing that applies to all routes and vehicles. Set specific values to create route-specific or vehicle-type-specific pricing.')
                    ->schema([
                        Forms\Components\Select::make('route_id')
                            ->label('Route')
                            ->relationship('route', 'name')
                            ->searchable()
                            ->preload()
                            ->helperText('Leave empty for global pricing. If set, this price only applies to the selected route.'),
                        Forms\Components\Select::make('vehicle_type')
                            ->label('Vehicle Type')
                            ->options([
                                'bus' => 'Bus',
                                'van' => 'Van',
                            ])
                            ->helperText('Leave empty for all vehicles. If set, this price only applies to the selected vehicle type.'),
                    ])
                    ->columns(2)
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('plan_type')
                    ->label('Plan Type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'weekly' => 'info',
                        'bi_weekly' => 'success',
                        'monthly' => 'warning',
                        'academic_term' => 'danger',
                        'annual' => 'primary',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst(str_replace('_', '-', $state)))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('trip_type')
                    ->label('Trip Type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'one_way' => 'warning',
                        'two_way' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => $state === 'one_way' ? 'One Way' : 'Two Way')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('scope')
                    ->label('Scope')
                    ->formatStateUsing(function (PricingRule $record): string {
                        if ($record->route_id) {
                            return 'Route: ' . $record->route->name;
                        }
                        if ($record->vehicle_type) {
                            return 'Vehicle: ' . ucfirst($record->vehicle_type);
                        }
                        return 'Global';
                    })
                    ->badge()
                    ->color(fn (PricingRule $record): string => $record->route_id ? 'warning' : ($record->vehicle_type ? 'info' : 'success'))
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('route', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                            ->orWhere('vehicle_type', 'like', "%{$search}%");
                    }),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Price')
                    ->money('USD')
                    ->sortable()
                    ->alignEnd(),
                Tables\Columns\IconColumn::make('active')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('plan_type')
                    ->label('Plan Type')
                    ->options([
                        'weekly' => 'Weekly',
                        'bi_weekly' => 'Bi-Weekly',
                        'monthly' => 'Monthly',
                        'semester' => 'Semester',
                        'annual' => 'Annual',
                    ])
                    ->multiple(),
                Tables\Filters\SelectFilter::make('scope')
                    ->label('Scope')
                    ->options([
                        'global' => 'Global',
                        'route' => 'Route-Specific',
                        'vehicle' => 'Vehicle-Specific',
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        if (empty($data['values'])) {
                            return $query;
                        }
                        return $query->where(function ($q) use ($data) {
                            if (in_array('global', $data['values'])) {
                                $q->orWhere(function ($subQ) {
                                    $subQ->whereNull('route_id')->whereNull('vehicle_type');
                                });
                            }
                            if (in_array('route', $data['values'])) {
                                $q->orWhereNotNull('route_id');
                            }
                            if (in_array('vehicle', $data['values'])) {
                                $q->orWhere(function ($subQ) {
                                    $subQ->whereNull('route_id')->whereNotNull('vehicle_type');
                                });
                            }
                        });
                    }),
                Tables\Filters\TernaryFilter::make('active')
                    ->label('Active Status'),
            ])
            ->defaultSort('plan_type')
            ->groups([
                Tables\Grouping\Group::make('plan_type')
                    ->label('Plan Type')
                    ->collapsible(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Activate')
                        ->icon('heroicon-o-check-circle')
                        ->action(fn ($records) => $records->each(fn ($record) => $record->update(['active' => true])))
                        ->requiresConfirmation(),
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Deactivate')
                        ->icon('heroicon-o-x-circle')
                        ->action(fn ($records) => $records->each(fn ($record) => $record->update(['active' => false])))
                        ->requiresConfirmation(),
                ]),
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
            'index' => Pages\ListPricingRules::route('/'),
            'create' => Pages\CreatePricingRule::route('/create'),
            'edit' => Pages\EditPricingRule::route('/{record}/edit'),
        ];
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Finance';
    }

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }
}
