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

    protected static ?string $navigationIcon = 'heroicon-o-user-minus';
    
    protected static ?string $navigationGroup = 'Transportation';

    protected static ?string $modelLabel = 'Student Absence';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('student_id')
                    ->relationship('student', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\Select::make('booking_id')
                    ->relationship('booking', 'id', fn (Builder $query) => $query->with('student'))
                    ->getOptionLabelFromRecordUsing(fn ($record) => "Booking #{$record->id} - {$record->student->name}")
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\DatePicker::make('absence_date')
                    ->required()
                    ->native(false),
                Forms\Components\Select::make('period')
                    ->options([
                        'am' => 'Morning (AM)',
                        'pm' => 'Afternoon (PM)',
                        'both' => 'Full Day (Both)',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('reason')
                    ->maxLength(255)
                    ->columnSpanFull(),
                Forms\Components\Select::make('reported_by')
                    ->relationship('reportedBy', 'name')
                    ->searchable()
                    ->preload(),
                Forms\Components\DateTimePicker::make('acknowledged_at')
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
                Tables\Columns\TextColumn::make('booking.route.name')
                    ->label('Route')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('absence_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('period')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'am' => 'info',
                        'pm' => 'warning',
                        'both' => 'danger',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'am' => 'Morning',
                        'pm' => 'Afternoon',
                        'both' => 'Full Day',
                    }),
                Tables\Columns\TextColumn::make('reason')
                    ->limit(30)
                    ->toggleable(),
                Tables\Columns\TextColumn::make('reportedBy.name')
                    ->label('Reported By')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\IconColumn::make('acknowledged_at')
                    ->label('Driver Seen')
                    ->boolean(fn ($state) => $state !== null)
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->color(fn ($state) => $state ? 'success' : 'gray')
                    ->tooltip(fn ($record) => $record->acknowledged_at ? "Seen at " . $record->acknowledged_at->format('M d, H:i') : 'Not yet seen by driver'),
            ])
            ->defaultSort('absence_date', 'desc')
            ->filters([
                Tables\Filters\Filter::make('absence_date')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('to'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('absence_date', '>=', $date),
                            )
                            ->when(
                                $data['to'],
                                fn (Builder $query, $date): Builder => $query->whereDate('absence_date', '<=', $date),
                            );
                    }),
                Tables\Filters\SelectFilter::make('period')
                    ->options([
                        'am' => 'Morning',
                        'pm' => 'Afternoon',
                        'both' => 'Full Day',
                    ]),
                Tables\Filters\TernaryFilter::make('is_acknowledged')
                    ->label('Seen by Driver')
                    ->placeholder('All Absences')
                    ->trueLabel('Seen')
                    ->falseLabel('Pending')
                    ->queries(
                        true: fn (Builder $query) => $query->whereNotNull('acknowledged_at'),
                        false: fn (Builder $query) => $query->whereNull('acknowledged_at'),
                    ),
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageStudentAbsences::route('/'),
        ];
    }
}
