<x-filament-panels::page>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold">Finance Dashboard</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Total Estimated Revenue</h3>
                <p class="text-3xl font-bold text-green-600">${{ number_format($this->revenueData['total_revenue'] ?? 0, 2) }}</p>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Active Bookings</h3>
                <p class="text-3xl font-bold text-blue-600">{{ $this->revenueData['active_bookings'] ?? 0 }}</p>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Cancelled Bookings</h3>
                <p class="text-3xl font-bold text-red-600">{{ $this->revenueData['cancelled_bookings'] ?? 0 }}</p>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Bookings by Plan Type</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plan Type</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($this->bookingStats as $planType => $count)
                            <tr>
                                <td class="px-4 py-2">{{ ucfirst(str_replace('_', '-', $planType)) }}</td>
                                <td class="px-4 py-2">{{ $count }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-filament-panels::page>
