<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StudentResource\Pages;
use App\Filament\Resources\StudentResource\RelationManagers;
use App\Models\Student;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StudentResource extends Resource
{
    protected static ?string $model = Student::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    
    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\Select::make('parent_id')
                            ->relationship('parent', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('school_id')
                            ->relationship('school', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\DatePicker::make('date_of_birth')
                            ->native(false),
                        Forms\Components\Textarea::make('home_address')
                            ->rows(2)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('grade')
                            ->maxLength(50),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Emergency Contacts')
                    ->schema([
                        Forms\Components\TextInput::make('emergency_contact_name')
                            ->label('Emergency Contact #1 Name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('emergency_phone')
                            ->label('Emergency Contact #1 Phone')
                            ->required()
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('emergency_contact_2_name')
                            ->label('Emergency Contact #2 Name')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('emergency_contact_2_phone')
                            ->label('Emergency Contact #2 Phone')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('emergency_contact_2_relationship')
                            ->label('Emergency Contact #2 Relationship')
                            ->maxLength(255),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Medical Information')
                    ->schema([
                        Forms\Components\TextInput::make('doctor_name')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('doctor_phone')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('medical_notes')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Authorized Pickup Persons')
                    ->schema([
                        Forms\Components\Repeater::make('authorized_pickup_persons')
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('relationship')
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('phone')
                                    ->tel()
                                    ->maxLength(255),
                            ])
                            ->columns(3)
                            ->defaultItems(0)
                            ->collapsible(),
                    ]),
                
                Forms\Components\Section::make('Additional Information')
                    ->schema([
                        Forms\Components\Textarea::make('special_instructions')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
                
                Forms\Components\Section::make('Signatures')
                    ->schema([
                        Forms\Components\Placeholder::make('authorization_to_transport')
                            ->label('Authorization to Transport')
                            ->content(fn ($record) => $record && $record->hasAuthorizationToTransport()
                                ? "Signed: {$record->authorization_to_transport_signature} on {$record->authorization_to_transport_signed_at->format('M d, Y')}"
                                : 'Not signed'),
                        Forms\Components\Placeholder::make('payment_agreement')
                            ->label('Payment Agreement')
                            ->content(fn ($record) => $record && $record->hasPaymentAgreement()
                                ? "Signed: {$record->payment_agreement_signature} on {$record->payment_agreement_signed_at->format('M d, Y')}"
                                : 'Not signed'),
                        Forms\Components\Placeholder::make('liability_waiver')
                            ->label('Liability Waiver')
                            ->content(fn ($record) => $record && $record->hasLiabilityWaiver()
                                ? "Signed: {$record->liability_waiver_signature} on {$record->liability_waiver_signed_at->format('M d, Y')}"
                                : 'Not signed'),
                    ])
                    ->collapsible()
                    ->collapsed(),
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
                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Parent')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('school.name')
                    ->label('School')
                    ->searchable()
                    ->sortable()
                    ->placeholder('No school assigned')
                    ->default('—'),
                Tables\Columns\TextColumn::make('date_of_birth')
                    ->label('Date of Birth')
                    ->date('n/j/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('emergency_contact')
                    ->label('Emergency Contact')
                    ->formatStateUsing(fn ($record) => $record->emergency_contact_name 
                        ? "{$record->emergency_contact_name} ({$record->emergency_phone})"
                        : '—')
                    ->searchable(['emergency_contact_name', 'emergency_phone']),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('parent_id')
                    ->relationship('parent', 'name')
                    ->searchable()
                    ->preload(),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
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
            'index' => Pages\ListStudents::route('/'),
            'create' => Pages\CreateStudent::route('/create'),
            'edit' => Pages\EditStudent::route('/{record}/edit'),
        ];
    }
}

