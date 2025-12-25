import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';

export default function Roster({ route, date: initialDate, isSchoolDay, groupedBookings, message }) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get('/driver/roster', { date: newDate }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <DriverLayout>
            <Head title="Daily Roster" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Daily Roster</h2>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    {message && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                            <p className="text-yellow-800">{message}</p>
                        </div>
                    )}

                    {!route ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p className="text-gray-600">No route assigned.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-4">Route: {route.name}</h3>
                                    {route.vehicle && (
                                        <p className="text-gray-600 mb-2">
                                            Vehicle: {route.vehicle.make} {route.vehicle.model} ({route.vehicle.license_plate})
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>

                            {!isSchoolDay ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <p className="text-blue-800">
                                        This is not a school day (holiday or closure).
                                    </p>
                                </div>
                            ) : groupedBookings.length === 0 ? (
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900">
                                        <p className="text-gray-500">No bookings for this date.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {groupedBookings.map((group, index) => (
                                        <div key={index} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {group.pickup_point.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {group.pickup_point.address}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-600">
                                                            <p className="font-medium">Pickup: {group.pickup_point.pickup_time}</p>
                                                            <p className="font-medium mt-1">Dropoff: {group.pickup_point.dropoff_time}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                                        Students ({group.bookings.length})
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {group.bookings.map((booking) => (
                                                            <div
                                                                key={booking.id}
                                                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                                            >
                                                                <div>
                                                                    <p className="font-medium text-gray-900">
                                                                        {booking.student.name}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        {booking.student.school}
                                                                    </p>
                                                                </div>
                                                                {booking.student.emergency_phone && (
                                                                    <div className="text-right">
                                                                        <p className="text-xs text-gray-500">Emergency</p>
                                                                        <p className="text-sm font-medium text-gray-700">
                                                                            {booking.student.emergency_phone}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}

