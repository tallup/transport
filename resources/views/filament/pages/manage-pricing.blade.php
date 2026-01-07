<x-filament-panels::page>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pricing Management</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage pricing rules for all plan types. Pricing follows priority: Route-specific > Vehicle-specific > Global
                </p>
            </div>
            <a href="{{ \Filament\Facades\Filament::getPanel('admin')->getUrl(\App\Filament\Resources\PricingRuleResource::class) . '/create' }}" 
               class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Pricing Rule
            </a>
        </div>

        @foreach($this->planTypes as $planTypeKey => $planTypeLabel)
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $planTypeLabel }} Pricing</h3>
                </div>
                <div class="p-6">
                    @php
                        $rules = $this->pricingRules[$planTypeKey] ?? [];
                    @endphp
                    
                    @if(empty($rules))
                        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>No pricing rules configured for {{ $planTypeLabel }}.</p>
                            <a href="{{ \Filament\Facades\Filament::getPanel('admin')->getUrl(\App\Filament\Resources\PricingRuleResource::class) . '/create?plan_type=' . $planTypeKey }}" 
                               class="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block">
                                Create one now
                            </a>
                        </div>
                    @else
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-gray-200 dark:border-gray-700">
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Scope</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Vehicle Type</th>
                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Price</th>
                                        <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($rules as $rule)
                                        <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td class="px-4 py-3">
                                                @if($rule['route_id'])
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        Route: {{ $rule['route_name'] }}
                                                    </span>
                                                @elseif($rule['vehicle_type'])
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        Vehicle: {{ ucfirst($rule['vehicle_type']) }}
                                                    </span>
                                                @else
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Global
                                                    </span>
                                                @endif
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {{ $rule['vehicle_type'] ? ucfirst($rule['vehicle_type']) : 'All' }}
                                            </td>
                                            <td class="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                {{ $rule['currency'] }} {{ number_format($rule['amount'], 2) }}
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                @if($rule['active'])
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Active
                                                    </span>
                                                @else
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        Inactive
                                                    </span>
                                                @endif
                                            </td>
                                            <td class="px-4 py-3 text-right">
                                                <div class="flex items-center justify-end space-x-2">
                                                    <a href="{{ \Filament\Facades\Filament::getPanel('admin')->getUrl(\App\Filament\Resources\PricingRuleResource::class) . '/' . $rule['id'] . '/edit' }}" 
                                                       class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                        </svg>
                                                    </a>
                                                    <button onclick="@this.call('toggleActive', {{ $rule['id'] }})" 
                                                            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                                        @if($rule['active'])
                                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        @endif
                                                    </button>
                                                    <button onclick="if(confirm('Are you sure you want to delete this pricing rule?')) { @this.call('deleteRule', {{ $rule['id'] }}) }" 
                                                            class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
                </div>
            </div>
        @endforeach

        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">Pricing Priority</h3>
                    <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>Pricing is determined by the following priority order:</p>
                        <ol class="list-decimal list-inside mt-2 space-y-1">
                            <li><strong>Route-specific:</strong> If a pricing rule exists for a specific route, it takes precedence.</li>
                            <li><strong>Vehicle-specific:</strong> If no route-specific rule exists, vehicle-type pricing is used.</li>
                            <li><strong>Global:</strong> If neither route nor vehicle-specific rules exist, global pricing is applied.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-filament-panels::page>
