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
                Forms\Components\Select::make('plan_type')
                    ->options([
                        'weekly' => 'Weekly',
                        'bi_weekly' => 'Bi-Weekly',
                        'monthly' => 'Monthly',
                        'semester' => 'Semester',
                        'annual' => 'Annual',
                    ])
                    ->required(),
                Forms\Components\Select::make('route_id')
                    ->relationship('route', 'name')
                    ->searchable()
                    ->preload()
                    ->helperText('Leave empty for global pricing'),
                Forms\Components\Select::make('vehicle_type')
                    ->options([
                        'bus' => 'Bus',
                        'van' => 'Van',
                    ])
                    ->helperText('Leave empty for all vehicles'),
                Forms\Components\TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->prefix('$')
                    ->minValue(0)
                    ->step(0.01),
                Forms\Components\TextInput::make('currency')
                    ->default('USD')
                    ->maxLength(3),
                Forms\Components\Toggle::make('active')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('plan_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ucfirst(str_replace('_', '-', $state))),
                Tables\Columns\TextColumn::make('route.name')
                    ->label('Route')
                    ->default('Global')
                    ->searchable(),
                Tables\Columns\TextColumn::make('vehicle_type')
                    ->badge()
                    ->default('All')
                    ->formatStateUsing(fn (?string $state): string => $state ? ucfirst($state) : 'All'),
                Tables\Columns\TextColumn::make('amount')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\IconColumn::make('active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('plan_type')
                    ->options([
                        'weekly' => 'Weekly',
                        'bi_weekly' => 'Bi-Weekly',
                        'monthly' => 'Monthly',
                        'semester' => 'Semester',
                        'annual' => 'Annual',
                    ]),
                Tables\Filters\TernaryFilter::make('active'),
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
}
