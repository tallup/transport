import { Head, useForm, usePage } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">{price.formatted}</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : `Pay ${price.formatted}`}
            </button>
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
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Complete Your Booking</h2>

                            {/* Booking Summary */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Student:</span>
                                    <span className="font-semibold">{booking.student?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Route:</span>
                                    <span className="font-semibold">{booking.route?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pickup Point:</span>
                                    <span className="font-semibold">{booking.pickup_point?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Plan:</span>
                                    <span className="font-semibold capitalize">
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

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Your payment is secure and encrypted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

