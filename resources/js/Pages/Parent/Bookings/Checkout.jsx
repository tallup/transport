import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { useState } from 'react';

const axios = window.axios;

function PayPalCheckoutButton({ booking, price }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayPalPayment = async () => {
        setLoading(true);
        setError(null);

        try {
            await axios.get('/api/keep-alive', {
                headers: {
                    'X-Keep-Alive': 'true',
                },
            });

            const response = await axios.post('/parent/bookings/create-paypal-order', {
                booking_id: booking.id,
                amount: price.price,
            });
            const data = response.data;

            if (data.error) {
                setError(data.error);
                setLoading(false);
            } else if (data.approvalUrl) {
                // Redirect to PayPal
                window.location.href = data.approvalUrl;
            } else {
                setError('Failed to initialize PayPal payment');
                setLoading(false);
            }
        } catch (err) {
            if (err?.response?.status === 419) {
                window.location.href = '/login';
                return;
            }
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg font-semibold">
                    {error}
                </div>
            )}
            
            <div className="glass-card p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-white text-lg">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-400">{price.formatted}</span>
                </div>
            </div>

            <GlassButton
                type="button"
                onClick={handlePayPalPayment}
                disabled={loading}
                variant="success"
                className="w-full py-3 text-lg flex items-center justify-center gap-2"
            >
                {loading ? (
                    'Processing...'
                ) : (
                    <>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.533zm14.146-14.42a6.813 6.813 0 0 0-.44-.767c-.783-1.177-2.178-1.91-4.336-1.91H9.557c-.524 0-.968.382-1.05.9L7.306 15.933h2.19c3.519 0 6.268-1.236 7.27-5.58.096-.452.172-.894.227-1.304.061-.437.096-.842.096-1.206 0-1.019-.253-1.744-.668-2.207z"/>
                        </svg>
                        {`Pay ${price.formatted} with PayPal`}
                    </>
                )}
            </GlassButton>
        </div>
    );
}

export default function Checkout({ booking, price }) {
    const { auth } = usePage().props;
    const { post, processing } = useForm();

    const handleSkipPayment = async () => {
        try {
            await axios.get('/api/keep-alive', {
                headers: {
                    'X-Keep-Alive': 'true',
                },
            });
        } catch (err) {
            if (err?.response?.status === 419) {
                window.location.href = '/login';
                return;
            }
        }
        post('/parent/bookings/skip-payment', {
            booking_id: booking.id,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Complete Your Booking</h2>

                            {/* Booking Summary */}
                            <div className="glass-card p-6 rounded-lg mb-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-white font-semibold">Student:</span>
                                    <span className="font-bold text-white">{booking.student?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white font-semibold">Route:</span>
                                    <span className="font-bold text-white">{booking.route?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white font-semibold">Pickup Location:</span>
                                    <span className="font-bold text-white">
                                        {booking.pickup_address || booking.pickup_point?.name || 'Not set'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white font-semibold">Plan:</span>
                                    <span className="font-bold text-white capitalize">
                                        {booking.plan_type.replace('_', '-')}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="glass-card p-6 rounded-lg mb-6">
                                <h3 className="text-xl font-bold text-white mb-4">Payment Method</h3>
                                <div className="p-4 rounded-lg border-2 border-brand-primary bg-brand-primary/20">
                                    <div className="text-white font-semibold">PayPal</div>
                                    <div className="text-white/70 text-sm mt-1">Pay with PayPal</div>
                                </div>
                            </div>

                            <PayPalCheckoutButton booking={booking} price={price} />

                            {/* Skip Payment Option */}
                            <div className="mt-6 pt-6 border-t border-yellow-400/40">
                                <div className="text-center">
                                    <p className="text-sm text-white/70 mb-4 font-medium">
                                        Don't want to pay now? You can complete payment later.
                                    </p>
                                    <GlassButton
                                        type="button"
                                        onClick={handleSkipPayment}
                                        disabled={processing}
                                        variant="secondary"
                                        className="w-full py-3 text-lg"
                                    >
                                        {processing ? 'Processing...' : 'Skip Payment & Complete Booking'}
                                    </GlassButton>
                                </div>
                            </div>

                            <p className="text-xs text-gray-300 mt-4 text-center font-medium">
                                Your payment is secure and encrypted.
                            </p>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

