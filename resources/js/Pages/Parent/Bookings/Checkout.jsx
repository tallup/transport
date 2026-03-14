import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, ShieldCheck } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { toast } from 'sonner';

const axios = window.axios;

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#0f172a',
            fontFamily: 'Figtree, system-ui, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': { color: '#94a3b8' },
        },
        invalid: {
            color: '#dc2626',
            iconColor: '#dc2626',
        },
    },
};

function StripeCheckoutForm({ booking, bookings, price }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isGroup = Array.isArray(bookings) && bookings.length > 0;

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
            const createBody = isGroup
                ? { booking_ids: bookings.map((b) => b.id) }
                : { booking_id: booking.id };
            const { data } = await axios.post('/parent/bookings/create-payment-intent', createBody);

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

            const bookingIds = isGroup ? bookings.map((b) => Number(b.id)) : [Number(booking.id)];
            const successBody = {
                booking_ids: bookingIds,
                payment_intent_id: paymentIntentId,
            };

            router.post(route('parent.bookings.payment-success'), successBody, {
                preserveState: false,
                onSuccess: () => {
                    const msg = isGroup
                        ? `Payment approved. Your ${bookings.length} bookings are now active.`
                        : 'Payment approved. Your booking is now active.';
                    toast.success(msg);
                    if (window.location.pathname.includes('/checkout')) {
                        window.location.href = route('parent.bookings.index');
                    }
                },
                onFinish: () => setLoading(false),
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
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                    {error}
                </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">Card details</label>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <GlassButton type="submit" disabled={loading || !stripe} variant="success" className="w-full gap-2">
                <CreditCard className="h-4 w-4" />
                {loading ? 'Processing...' : `Pay ${price.formatted}`}
            </GlassButton>
        </form>
    );
}

export default function Checkout({ booking, bookings, price, stripeKey }) {
    const { auth } = usePage().props;
    const [stripePromise] = useState(() => (stripeKey ? loadStripe(stripeKey) : null));
    const isGroup = Array.isArray(bookings) && bookings.length > 0;
    const displayBooking = isGroup ? bookings[0] : booking;

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Checkout" />

            <div className="py-10">
                <div className="container">
                    <GlassCard className="mx-auto max-w-3xl">
                        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                            {isGroup ? `Complete Payment for ${bookings.length} Students` : 'Complete Your Booking'}
                        </h2>

                        {isGroup ? (
                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-3 text-sm font-medium text-slate-900">Students</p>
                                <ul className="space-y-2 text-sm text-slate-700">
                                    {bookings.map((b) => (
                                        <li key={b.id} className="flex items-center justify-between">
                                            <span>{b.student?.name}</span>
                                            <span className="text-slate-500">{b.route?.name} · {b.plan_type?.replace('_', '-')}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-3 text-xs text-slate-500">
                                    Route: {displayBooking?.route?.name} · Pickup: {displayBooking?.pickup_address || displayBooking?.pickup_point?.name || '—'}
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-2">
                                <p className="text-slate-700"><span className="font-medium text-slate-900">Student:</span> {booking.student?.name}</p>
                                <p className="text-slate-700"><span className="font-medium text-slate-900">Route:</span> {booking.route?.name}</p>
                                <p className="text-slate-700"><span className="font-medium text-slate-900">Pickup:</span> {booking.pickup_address || booking.pickup_point?.name || 'Not set'}</p>
                                <p className="text-slate-700"><span className="font-medium text-slate-900">Plan:</span> {booking.plan_type?.replace('_', '-')}</p>
                            </div>
                        )}

                        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">Total Amount</span>
                                <span className="text-2xl font-semibold text-amber-700">{price.formatted}</span>
                            </div>

                            {stripePromise ? (
                                <Elements stripe={stripePromise}>
                                    <StripeCheckoutForm booking={booking} bookings={bookings} price={price} />
                                </Elements>
                            ) : (
                                <p className="text-sm font-medium text-rose-700">
                                    Stripe is not configured. Set `STRIPE_KEY` in your environment.
                                </p>
                            )}
                        </div>

                        <p className="mt-4 inline-flex items-center gap-1 text-xs text-slate-500">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Payment is encrypted and handled securely by Stripe.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
