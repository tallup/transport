<x-filament-panels::page>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Daily Roster</h2>
            <div>
                <input
                    type="date"
                    wire:model.live="selectedDate"
                    class="rounded-lg border-gray-300"
                />
            </div>
        </div>

        @if($route)
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-xl font-semibold mb-4">Route: {{ $route->name }}</h3>
                <p class="text-gray-600 mb-4">
                    Vehicle: {{ $route->vehicle->make }} {{ $route->vehicle->model }} ({{ $route->vehicle->license_plate }})
                </p>

                @if($groupedBookings->isEmpty())
                    <p class="text-gray-500">No bookings for this date.</p>
                @else
                    <div class="space-y-6">
                        @foreach($groupedBookings as $group)
                            <div class="border rounded-lg p-4">
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 class="font-semibold text-lg">{{ $group['pickup_point']->name }}</h4>
                                        <p class="text-sm text-gray-600">{{ $group['pickup_point']->address }}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm">
                                            <span class="font-medium">Pickup:</span> {{ \Carbon\Carbon::parse($group['pickup_time'])->format('g:i A') }}
                                        </p>
                                        <p class="text-sm">
                                            <span class="font-medium">Dropoff:</span> {{ \Carbon\Carbon::parse($group['dropoff_time'])->format('g:i A') }}
                                        </p>
                                    </div>
                                </div>

                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Emergency Contact</th>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            @foreach($group['bookings'] as $booking)
                                                <tr>
                                                    <td class="px-4 py-2 whitespace-nowrap">{{ $booking->student->name }}</td>
                                                    <td class="px-4 py-2">{{ $booking->student->school }}</td>
                                                    <td class="px-4 py-2">{{ $booking->student->emergency_contact_name }}</td>
                                                    <td class="px-4 py-2">{{ $booking->student->emergency_phone }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        @else
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800">No active route assigned to you.</p>
            </div>
        @endif
    </div>
</x-filament-panels::page>
