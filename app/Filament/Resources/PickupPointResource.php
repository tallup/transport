<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PickupPointResource\Pages;
use App\Filament\Resources\PickupPointResource\RelationManagers;
use App\Models\PickupPoint;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PickupPointResource extends Resource
{
    protected static ?string $model = PickupPoint::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin';
    
    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('route_id')
                    ->relationship('route', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('address')
                    ->required()
                    ->rows(2)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('latitude')
                    ->numeric()
                    ->step(0.00000001),
                Forms\Components\TextInput::make('longitude')
                    ->numeric()
                    ->step(0.00000001),
                Forms\Components\TextInput::make('sequence_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\TimePicker::make('pickup_time')
                    ->required()
                    ->seconds(false),
                Forms\Components\TimePicker::make('dropoff_time')
                    ->required()
                    ->seconds(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('route.name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('address')
                    ->limit(30),
                Tables\Columns\TextColumn::make('sequence_order')
                    ->sortable(),
                Tables\Columns\TextColumn::make('pickup_time'),
                Tables\Columns\TextColumn::make('dropoff_time'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('route_id')
                    ->relationship('route', 'name')
                    ->searchable()
                    ->preload(),
            ])
            ->defaultSort('sequence_order')
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
            'index' => Pages\ListPickupPoints::route('/'),
            'create' => Pages\CreatePickupPoint::route('/create'),
            'edit' => Pages\EditPickupPoint::route('/{record}/edit'),
        ];
    }
}
