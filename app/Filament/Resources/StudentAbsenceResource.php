<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StudentAbsenceResource\Pages;
use App\Filament\Resources\StudentAbsenceResource\RelationManagers;
use App\Models\StudentAbsence;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StudentAbsenceResource extends Resource
{
    protected static ?string $model = StudentAbsence::class;

    protected static ?string $navigationIcon = 'heroicon-o-x-circle';
    protected static ?string $navigationGroup = 'Transport Management';
    protected static ?int $navigationSort = 4;
    protected static ?string $navigationLabel = 'Reported Absences';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('booking_id')
                    ->relationship('booking', 'id')
                    ->required(),
                Forms\Components\Select::make('student_id')
                    ->relationship('student', 'name')
                    ->required(),
                Forms\Components\DatePicker::make('absence_date')
                    ->required(),
                Forms\Components\TextInput::make('period')
                    ->required(),
                Forms\Components\TextInput::make('reason'),
                Forms\Components\TextInput::make('reported_by')
                    ->required()
                    ->numeric(),
                Forms\Components\DateTimePicker::make('acknowledged_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('student.name')
                    ->label('Student')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('absence_date')
                    ->label('Date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('period')
                    ->label('Period')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'am' => 'info',
                        'pm' => 'warning',
                        'both' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => strtoupper($state)),
                Tables\Columns\TextColumn::make('reason')
                    ->searchable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('booking.route.name')
                    ->label('Route')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Reported On')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('acknowledged_at')
                    ->label('Acknowledged')
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->acknowledged_at !== null),
            ])
            ->filters([
                Tables\Filters\Filter::make('future')
                    ->label('Upcoming Absences')
                    ->query(fn (Builder $query): Builder => $query->whereDate('absence_date', '>=', now())),
                Tables\Filters\Filter::make('past')
                    ->label('Past Absences')
                    ->query(fn (Builder $query): Builder => $query->whereDate('absence_date', '<', now())),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('acknowledge')
                    ->label('Acknowledge')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->hidden(fn ($record) => $record->acknowledged_at !== null)
                    ->action(function ($record) {
                        $record->update(['acknowledged_at' => now()]);
                    }),
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
            'index' => Pages\ListStudentAbsences::route('/'),
            'create' => Pages\CreateStudentAbsence::route('/create'),
            'edit' => Pages\EditStudentAbsence::route('/{record}/edit'),
        ];
    }
}
