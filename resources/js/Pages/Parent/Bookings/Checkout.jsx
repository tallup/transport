import { Head, useForm, usePage } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { useState } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_placeholder');

function CheckoutForm({ booking, price, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create payment intent on backend
            const response = await fetch('/parent/bookings/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    booking_id: booking.id,
                    amount: price.price * 100, // Convert to cents
                }),
            });

            const { clientSecret } = await response.json();

            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-base font-bold text-white mb-2">
                    Card Details
                </label>
                <div className="glass-card p-4 rounded-lg">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#ffffff',
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    '::placeholder': {
                                        color: '#d1d5db',
                                    },
                                },
                                invalid: {
                                    color: '#fca5a5',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg font-semibold">
                    {error}
                </div>
            )}

            <div className="glass-card p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-lg">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-400">{price.formatted}</span>
                </div>
            </div>

            <GlassButton
                type="submit"
                disabled={!stripe || loading}
                variant="success"
                className="w-full py-3 text-lg"
            >
                {loading ? 'Processing...' : `Pay ${price.formatted}`}
            </GlassButton>
        </form>
    );
}

export default function Checkout({ booking, price }) {
    const { auth } = usePage().props;
    const { post, processing } = useForm();

    const handlePaymentSuccess = (paymentIntent) => {
        // Redirect to success page
        post('/parent/bookings/payment-success', {
            booking_id: booking.id,
            payment_intent_id: paymentIntent.id,
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
                                    <span className="text-white font-semibold">Pickup Point:</span>
                                    <span className="font-bold text-white">{booking.pickup_point?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white font-semibold">Plan:</span>
                                    <span className="font-bold text-white capitalize">
                                        {booking.plan_type.replace('_', '-')}
                                    </span>
                                </div>
                            </div>

                            {/* Stripe Payment Form */}
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    booking={booking}
                                    price={price}
                                    onSuccess={handlePaymentSuccess}
                                />
                            </Elements>

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

