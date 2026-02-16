import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

const axios = window.axios;

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#22304d',
            fontFamily: 'system-ui, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': { color: '#6b7280' },
        },
        invalid: {
            color: '#dc2626',
            iconColor: '#dc2626',
        },
    },
};

function StripeCheckoutForm({ booking, price, stripeKey }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { post } = useForm();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            await axios.get('/api/keep-alive', { headers: { 'X-Keep-Alive': 'true' } });
        } catch (err) {
            if (err?.response?.status === 419) {
                window.location.href = '/login';
                return;
            }
        }

        try {
            const { data } = await axios.post('/parent/bookings/create-payment-intent', {
                booking_id: booking.id,
                amount: price.price,
            });

            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }

            const { clientSecret, paymentIntentId } = data;
            const cardElement = elements.getElement(CardElement);

            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (confirmError) {
                setError(confirmError.message || 'Payment failed.');
                setLoading(false);
                return;
            }

            post(route('parent.bookings.payment-success'), {
                booking_id: booking.id,
                payment_intent_id: paymentIntentId,
            });
        } catch (err) {
            if (err?.response?.status === 419) {
                window.location.href = '/login';
                return;
            }
            setError(err?.response?.data?.error || 'An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-600/20 border-2 border-red-500 text-white px-4 py-3 rounded-xl font-semibold">
                    {error}
                </div>
            )}

            <div className="glass-card p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-brand-primary text-lg">Total Amount:</span>
                    <span className="text-2xl font-bold text-emerald-600">{price.formatted}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border-2 border-yellow-400/60">
                    <label className="block text-sm font-bold text-brand-primary mb-2">Card details</label>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            <GlassButton
                type="submit"
                disabled={loading || !stripe}
                variant="success"
                className="w-full py-3 text-lg flex items-center justify-center gap-2"
            >
                {loading ? (
                    'Processing...'
                ) : (
                    <>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Pay {price.formatted} with Stripe
                    </>
                )}
            </GlassButton>
        </form>
    );
}

export default function Checkout({ booking, price, stripeKey }) {
    const { post, processing } = useForm();
    const [stripePromise] = useState(() => (stripeKey ? loadStripe(stripeKey) : null));

    const handleSkipPayment = async () => {
        try {
            await axios.get('/api/keep-alive', { headers: { 'X-Keep-Alive': 'true' } });
        } catch (err) {
            if (err?.response?.status === 419) {
                window.location.href = '/login';
                return;
            }
        }
        post('/parent/bookings/skip-payment', { booking_id: booking.id });
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
                                    <span className="text-brand-primary font-semibold">Student:</span>
                                    <span className="font-bold text-brand-primary">{booking.student?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-primary font-semibold">Route:</span>
                                    <span className="font-bold text-brand-primary">{booking.route?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-primary font-semibold">Pickup Location:</span>
                                    <span className="font-bold text-brand-primary">
                                        {booking.pickup_address || booking.pickup_point?.name || 'Not set'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-primary font-semibold">Plan:</span>
                                    <span className="font-bold text-brand-primary capitalize">
                                        {booking.plan_type?.replace('_', '-')}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method - Stripe */}
                            <div className="glass-card p-6 rounded-lg mb-6">
                                <h3 className="text-xl font-bold text-brand-primary mb-4">Payment Method</h3>
                                <div className="p-4 rounded-xl border-2 border-yellow-400/60 bg-white/10 mb-4">
                                    <div className="font-bold text-brand-primary">Stripe</div>
                                    <div className="text-brand-primary/70 text-sm mt-1">Pay securely with your card (credit or debit)</div>
                                </div>
                                {stripePromise ? (
                                    <Elements stripe={stripePromise}>
                                        <StripeCheckoutForm booking={booking} price={price} stripeKey={stripeKey} />
                                    </Elements>
                                ) : (
                                    <p className="text-red-500 font-semibold">Stripe is not configured. Please set STRIPE_KEY in your .env file.</p>
                                )}
                            </div>

                            {/* Skip Payment Option */}
                            <div className="mt-6 pt-6 border-t border-yellow-400/40">
                                <div className="text-center">
                                    <p className="text-sm text-white/70 mb-4 font-medium">
                                        Don&apos;t want to pay now? You can complete payment later.
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
                                Your payment is secure and encrypted by Stripe.
                            </p>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
