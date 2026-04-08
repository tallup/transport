<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Student — {{ $student->name }}</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 0; padding: 24px; }
        .header { border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 20px; overflow: hidden; }
        .header img { float: left; max-height: 48px; margin-right: 16px; }
        .header-text { overflow: hidden; }
        .header h1 { margin: 0 0 4px 0; font-size: 20px; color: #0f172a; }
        .header p { margin: 0; font-size: 11px; color: #64748b; }
        h2 { font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 18px 0 10px 0; }
        table.meta { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        table.meta td { padding: 5px 8px; vertical-align: top; border-bottom: 1px solid #f1f5f9; }
        table.meta td.label { width: 32%; font-weight: bold; color: #475569; background: #f8fafc; }
        table.bookings { width: 100%; border-collapse: collapse; font-size: 10px; }
        table.bookings th, table.bookings td { padding: 6px 8px; text-align: left; border: 1px solid #e2e8f0; }
        table.bookings th { background: #f1f5f9; font-weight: bold; }
        .sig-block { margin-bottom: 14px; page-break-inside: avoid; }
        .sig-block img { max-width: 220px; max-height: 80px; border: 1px solid #e2e8f0; }
        .muted { color: #64748b; font-size: 10px; }
        .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; text-align: center; }
        .agreement-body { margin: 8px 0 12px 0; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 10px; line-height: 1.5; text-align: justify; color: #334155; }
    </style>
</head>
<body>
    <div class="header">
        @if(!empty($logoDataUri))
            <img src="{{ $logoDataUri }}" alt="Logo" />
        @endif
        <div class="header-text">
            <h1>{{ $appName }}</h1>
            <p>Student record</p>
        </div>
    </div>

    <h2>Student</h2>
    <table class="meta">
        <tr>
            <td class="label">Name</td>
            <td>{{ $student->name }}</td>
        </tr>
        @if($student->date_of_birth)
            <tr>
                <td class="label">Date of birth</td>
                <td>{{ $student->date_of_birth->format('M j, Y') }}</td>
            </tr>
        @endif
        @if($student->grade)
            <tr>
                <td class="label">Grade</td>
                <td>{{ $student->grade }}</td>
            </tr>
        @endif
        @if($student->school)
            <tr>
                <td class="label">School</td>
                <td>{{ $student->school->name }}</td>
            </tr>
        @endif
        @if($student->route)
            <tr>
                <td class="label">Route</td>
                <td>{{ $student->route->name }}</td>
            </tr>
        @endif
        @if($student->pickupPoint)
            <tr>
                <td class="label">Pickup point</td>
                <td>{{ $student->pickupPoint->name ?? $student->pickupPoint->address ?? '—' }}</td>
            </tr>
        @endif
        @if($student->home_address)
            <tr>
                <td class="label">Home address</td>
                <td>{{ $student->home_address }}</td>
            </tr>
        @endif
    </table>

    @if($student->parent)
        <h2>Parent / guardian</h2>
        <table class="meta">
            <tr>
                <td class="label">Name</td>
                <td>{{ $student->parent->name }}</td>
            </tr>
            <tr>
                <td class="label">Email</td>
                <td>{{ $student->parent->email }}</td>
            </tr>
            @php $phones = $student->parent->phone_numbers ?? []; @endphp
            @if(!empty($phones))
                <tr>
                    <td class="label">Phone(s)</td>
                    <td>{{ implode(', ', $phones) }}</td>
                </tr>
            @endif
        </table>
    @endif

    <h2>Emergency contacts</h2>
    <table class="meta">
        <tr>
            <td class="label">Primary contact</td>
            <td>{{ $student->emergency_contact_name ?? '—' }} @if($student->emergency_phone) — {{ $student->emergency_phone }} @endif</td>
        </tr>
        @if($student->emergency_contact_2_name || $student->emergency_contact_2_phone)
            <tr>
                <td class="label">Secondary contact</td>
                <td>
                    {{ $student->emergency_contact_2_name ?? '—' }}
                    @if($student->emergency_contact_2_relationship)
                        <span class="muted">({{ $student->emergency_contact_2_relationship }})</span>
                    @endif
                    @if($student->emergency_contact_2_phone) — {{ $student->emergency_contact_2_phone }} @endif
                </td>
            </tr>
        @endif
    </table>

    @php $pickupPersons = $student->authorized_pickup_persons ?? []; @endphp
    @if(!empty($pickupPersons))
        <h2>Authorized pickup persons</h2>
        <table class="bookings">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>
                @foreach($pickupPersons as $p)
                    <tr>
                        <td>{{ $p['name'] ?? '—' }}</td>
                        <td>{{ $p['relationship'] ?? '—' }}</td>
                        <td>{{ $p['phone'] ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2>Medical</h2>
    <table class="meta">
        <tr>
            <td class="label">Doctor</td>
            <td>{{ $student->doctor_name ?? '—' }} @if($student->doctor_phone) — {{ $student->doctor_phone }} @endif</td>
        </tr>
        @if($student->medical_notes)
            <tr>
                <td class="label">Medical notes</td>
                <td>{{ $student->medical_notes }}</td>
            </tr>
        @endif
        @if($student->special_instructions)
            <tr>
                <td class="label">Special instructions</td>
                <td>{{ $student->special_instructions }}</td>
            </tr>
        @endif
    </table>

    <h2>Agreements &amp; signatures</h2>
    @php
        $agreements = config('student_enrollment_agreements', []);
    @endphp

    <div class="sig-block">
        <strong>Authorization to transport</strong>
        @if(!empty($agreements['authorization_to_transport']))
            <div class="agreement-body">{{ $agreements['authorization_to_transport'] }}</div>
        @endif
        @if($student->authorization_to_transport_signed_at)
            <p class="muted">Signed {{ $student->authorization_to_transport_signed_at->format('M j, Y g:i A') }}</p>
            @include('admin.students.partials.signature-display', ['signature' => $student->authorization_to_transport_signature])
        @else
            <p class="muted">Not signed</p>
        @endif
    </div>
    <div class="sig-block">
        <strong>Payment agreement</strong>
        @if(!empty($agreements['payment_agreement']))
            <div class="agreement-body">{{ $agreements['payment_agreement'] }}</div>
        @endif
        @if($student->payment_agreement_signed_at)
            <p class="muted">Signed {{ $student->payment_agreement_signed_at->format('M j, Y g:i A') }}</p>
            @include('admin.students.partials.signature-display', ['signature' => $student->payment_agreement_signature])
        @else
            <p class="muted">Not signed</p>
        @endif
    </div>
    <div class="sig-block">
        <strong>Liability waiver</strong>
        @if(!empty($agreements['liability_waiver']))
            <div class="agreement-body">{{ $agreements['liability_waiver'] }}</div>
        @endif
        @if($student->liability_waiver_signed_at)
            <p class="muted">Signed {{ $student->liability_waiver_signed_at->format('M j, Y g:i A') }}</p>
            @include('admin.students.partials.signature-display', ['signature' => $student->liability_waiver_signature])
        @else
            <p class="muted">Not signed</p>
        @endif
    </div>

    @if($student->bookings->isNotEmpty())
        <h2>Bookings summary</h2>
        <table class="bookings">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Route</th>
                    <th>Start</th>
                    <th>End</th>
                </tr>
            </thead>
            <tbody>
                @foreach($student->bookings as $booking)
                    <tr>
                        <td>#{{ $booking->id }}</td>
                        <td>{{ $booking->status }}</td>
                        <td>{{ $booking->route?->name ?? '—' }}</td>
                        <td>{{ $booking->start_date?->format('M j, Y') ?? '—' }}</td>
                        <td>{{ $booking->end_date?->format('M j, Y') ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if($student->absences->isNotEmpty())
        <h2>Absences (recent)</h2>
        <table class="bookings">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Period</th>
                    <th>Reason</th>
                </tr>
            </thead>
            <tbody>
                @foreach($student->absences->sortByDesc('absence_date')->take(20) as $absence)
                    <tr>
                        <td>{{ $absence->absence_date?->format('M j, Y') }}</td>
                        <td>{{ $absence->period ?? '—' }}</td>
                        <td>{{ $absence->reason ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
        Generated {{ now()->format('M j, Y g:i A') }} — {{ $appName }}
    </div>
</body>
</html>
