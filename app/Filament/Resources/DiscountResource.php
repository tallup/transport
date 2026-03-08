<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DiscountResource\Pages;
use App\Models\Discount;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class DiscountResource extends Resource
{
    protected static ?string $model = Discount::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';

    protected static ?string $navigationGroup = 'Finance';

    protected static ?string $navigationLabel = 'Discounts';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Discount Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Name')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Internal name for this promotion (e.g. March 2026 promo)'),
                        Forms\Components\Select::make('type')
                            ->label('Discount Type')
                            ->options([
                                'percentage' => 'Percentage off',
                                'fixed' => 'Fixed amount off',
                            ])
                            ->required()
                            ->live()
                            ->helperText('Percentage: e.g. 10 for 10% off. Fixed: e.g. 25 for $25 off'),
                        Forms\Components\TextInput::make('value')
                            ->label('Value')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->step(fn ($get) => $get('type') === 'percentage' ? 1 : 0.01)
                            ->suffix(fn ($get) => $get('type') === 'percentage' ? '%' : ' USD')
                            ->helperText('Percentage: 0–100. Fixed: amount in dollars')
                            ->rule(fn ($get) => $get('type') === 'percentage' ? 'numeric|min:0|max:100' : 'numeric|min:0'),
                        Forms\Components\DatePicker::make('start_date')
                            ->label('Start Date')
                            ->nullable()
                            ->helperText('Leave empty for no start limit'),
                        Forms\Components\DatePicker::make('end_date')
                            ->label('End Date')
                            ->nullable()
                            ->helperText('Leave empty for no end limit'),
                        Forms\Components\Toggle::make('active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Only active discounts are applied'),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Scope')
                    ->description('Who gets this discount: all bookings, a specific route, or a plan type.')
                    ->schema([
                        Forms\Components\Select::make('scope')
                            ->label('Scope')
                            ->options([
                                'all' => 'All bookings',
                                'route' => 'Specific route',
                                'plan_type' => 'Specific plan type',
                            ])
                            ->default('all')
                            ->required()
                            ->live()
                            ->helperText('Limit discount to all, one route, or one plan type'),
                        Forms\Components\Select::make('route_id')
                            ->label('Route')
                            ->relationship('route', 'name')
                            ->searchable()
                            ->preload()
                            ->visible(fn ($get) => $get('scope') === 'route')
                            ->required(fn ($get) => $get('scope') === 'route'),
                        Forms\Components\Select::make('plan_type')
                            ->label('Plan Type')
                            ->options([
                                'weekly' => 'Weekly',
                                'monthly' => 'Monthly',
                                'academic_term' => 'Academic Term',
                                'annual' => 'Annual',
                            ])
                            ->visible(fn ($get) => $get('scope') === 'plan_type')
                            ->required(fn ($get) => $get('scope') === 'plan_type'),
                    ])
                    ->columns(2)
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'percentage' ? 'Percentage' : 'Fixed')
                    ->color(fn (string $state): string => $state === 'percentage' ? 'info' : 'warning')
                    ->sortable(),
                Tables\Columns\TextColumn::make('value')
                    ->label('Value')
                    ->formatStateUsing(function (Discount $record): string {
                        return $record->type === 'percentage'
                            ? (string) (int) $record->value . '%'
                            : '$' . number_format((float) $record->value, 2);
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('start_date')
                    ->label('Start')
                    ->date()
                    ->sortable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('end_date')
                    ->label('End')
                    ->date()
                    ->sortable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('scope')
                    ->label('Scope')
                    ->formatStateUsing(function (Discount $record): string {
                        if ($record->scope === 'route' && $record->route) {
                            return 'Route: ' . $record->route->name;
                        }
                        if ($record->scope === 'plan_type' && $record->plan_type) {
                            return ucfirst(str_replace('_', ' ', $record->plan_type));
                        }
                        return 'All';
                    })
                    ->badge()
                    ->color(fn (string $state, Discount $record): string => match ($record->scope ?? 'all') {
                        'route' => 'warning',
                        'plan_type' => 'info',
                        default => 'success',
                    }),
                Tables\Columns\IconColumn::make('active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
            ])
            ->defaultSort('id', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'percentage' => 'Percentage',
                        'fixed' => 'Fixed',
                    ]),
                Tables\Filters\SelectFilter::make('scope')
                    ->options([
                        'all' => 'All',
                        'route' => 'Route',
                        'plan_type' => 'Plan type',
                    ]),
                Tables\Filters\TernaryFilter::make('active')->label('Active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDiscounts::route('/'),
            'create' => Pages\CreateDiscount::route('/create'),
            'edit' => Pages\EditDiscount::route('/{record}/edit'),
        ];
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Finance';
    }
}
