<?php

namespace App\Filament\Resources\StudentResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AbsencesRelationManager extends RelationManager
{
    protected static string $relationship = 'absences';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('absence_date')
                    ->required()
                    ->native(false),
                Forms\Components\Select::make('period')
                    ->options([
                        'am' => 'Morning',
                        'pm' => 'Afternoon',
                        'both' => 'Full Day',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('reason')
                    ->maxLength(255)
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('absence_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('period')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'am' => 'info',
                        'pm' => 'warning',
                        'both' => 'danger',
                    }),
                Tables\Columns\TextColumn::make('reason')
                    ->limit(20)
                    ->toggleable(),
                Tables\Columns\IconColumn::make('acknowledged_at')
                    ->label('Seen')
                    ->boolean(fn ($state) => $state !== null)
                    ->trueIcon('heroicon-o-check-circle')
                    ->color(fn ($state) => $state ? 'success' : 'gray'),
            ])
            ->defaultSort('absence_date', 'desc')
            ->filters([
                //
            ])
            ->headerActions([
                // Parents usually create these, admin mostly views
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
