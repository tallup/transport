import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GlassCard from '@/Components/GlassCard';

export default function FAQ({ auth }) {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "General Questions",
            questions: [
                {
                    q: "What is On-Time Transportation for Kids?",
                    a: "On-Time Transportation for Kids is a private transportation company that provides safe, reliable transportation services for children between approved locations with parent authorization. We are not a school bus service and do not operate under the authority of any school district or government agency."
                },
                {
                    q: "How do I book transportation for my child?",
                    a: "You can book transportation through our online platform. Simply create an account, add your child's information, select a route and pickup point, choose a payment plan, and complete payment. Our booking process is simple and takes just a few minutes."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept major credit cards and debit cards through our secure payment processor, Stripe. All payments are processed securely and in accordance with PCI DSS standards. Payment must be completed before service begins."
                },
                {
                    q: "Can I cancel or modify my booking?",
                    a: "Yes, you can cancel or modify bookings through your account dashboard. Cancellation and refund policies vary based on your booking plan and timing. Please refer to your booking confirmation for specific cancellation terms."
                }
            ]
        },
        {
            category: "Safety and Security",
            questions: [
                {
                    q: "How do you ensure my child's safety?",
                    a: "We take safety seriously. All our drivers are licensed, background-checked, and trained in child safety protocols. Vehicles are regularly maintained and inspected. We also provide real-time tracking so you can monitor your child's journey. All routes are carefully planned and approved by parents."
                },
                {
                    q: "What happens in case of an emergency?",
                    a: "In case of emergencies, our drivers are trained to handle various situations. We have your emergency contact information on file and will contact you immediately if needed. Our support team is available 24/7 to assist with any emergency situations."
                },
                {
                    q: "Do you have insurance?",
                    a: "Yes, all our vehicles are fully insured, and we maintain comprehensive commercial liability insurance as required by law. This provides protection for passengers and covers potential incidents during transportation."
                },
                {
                    q: "What if my child doesn't show up at the pickup point?",
                    a: "If your child is not at the pickup point at the scheduled time, the driver will wait for a reasonable period and attempt to contact you. If contact cannot be made, we will follow our missed pickup protocol, which may include contacting emergency contacts or returning to the pickup point later if possible."
                }
            ]
        },
        {
            category: "Booking and Scheduling",
            questions: [
                {
                    q: "What booking plans are available?",
                    a: "We offer flexible booking plans to suit your needs: weekly, monthly, academic term, or annual plans. Each plan is priced differently and offers various benefits. You can select the plan that best fits your schedule during the booking process."
                },
                {
                    q: "How far in advance do I need to book?",
                    a: "We recommend booking at least 24-48 hours in advance to ensure availability. However, last-minute bookings may be possible depending on route capacity. You can check availability in real-time when making a booking."
                },
                {
                    q: "Can I change my pickup or dropoff location?",
                    a: "Yes, you can request changes to your pickup or dropoff location through your account dashboard. Changes are subject to route availability and may require additional fees depending on the new location and timing of the change request."
                },
                {
                    q: "What if I need transportation for multiple children?",
                    a: "You can book transportation for multiple children through the same account. Each child needs to be registered as a student in your account. You can create separate bookings or combine multiple children on the same route if they attend the same school."
                }
            ]
        },
        {
            category: "Pricing and Payments",
            questions: [
                {
                    q: "How is pricing determined?",
                    a: "Pricing is based on several factors including the distance between pickup and dropoff locations, the type of booking plan selected (weekly, monthly, term, or annual), and route availability. The final price will be displayed before you confirm payment."
                },
                {
                    q: "Are there any hidden fees?",
                    a: "No, we believe in transparent pricing. All fees are clearly displayed during the booking process. The price you see is the price you pay, with no hidden charges. Any additional fees (such as late cancellation fees) will be clearly communicated in advance."
                },
                {
                    q: "What is your refund policy?",
                    a: "Our refund policy depends on the type of booking and timing of cancellation. Generally, full or partial refunds are available if you cancel within the specified timeframe. Services already rendered are not refundable. Please refer to our Terms and Conditions for detailed refund information."
                },
                {
                    q: "Can I pay in installments?",
                    a: "Payment terms depend on your selected booking plan. Monthly, term, and annual plans may offer installment options. One-time bookings require full payment upfront. Check available payment options during the booking process."
                }
            ]
        },
        {
            category: "Service and Operations",
            questions: [
                {
                    q: "What happens if the driver is late?",
                    a: "While we strive for punctuality, occasional delays may occur due to traffic, weather, or other unforeseen circumstances. Our drivers will contact you if there's a significant delay. We use real-time tracking so you can monitor the vehicle's location and estimated arrival time."
                },
                {
                    q: "How do I track my child's transportation?",
                    a: "Once a booking is confirmed, you can track your child's transportation in real-time through your account dashboard. You'll receive notifications about pickup times, route progress, and arrival confirmations."
                },
                {
                    q: "What if there's a route change or cancellation by you?",
                    a: "If we need to make changes to your scheduled transportation, we will notify you as soon as possible via email, SMS, or phone call. We will work with you to find an alternative solution or provide a full refund if we cannot provide the service."
                },
                {
                    q: "Do you operate on holidays and school breaks?",
                    a: "Service availability on holidays and school breaks depends on your booking plan and our operating schedule. We will notify you in advance about any schedule changes. You can also check your account dashboard for the service calendar."
                }
            ]
        },
        {
            category: "Account and Support",
            questions: [
                {
                    q: "How do I create an account?",
                    a: "Creating an account is easy. Click on 'Register' or 'Get Started' on our homepage, provide your information, verify your email, and you're ready to book transportation services. The entire process takes just a few minutes."
                },
                {
                    q: "How do I update my child's information?",
                    a: "You can update your child's information at any time through your account dashboard under 'My Students'. Make sure to keep all information current, especially emergency contacts and medical information."
                },
                {
                    q: "How can I contact customer support?",
                    a: "You can contact our customer support team through your account dashboard, by email, or by phone. Our support team is available to assist you with any questions or concerns. For urgent matters during transportation, contact the driver or our 24/7 emergency line."
                },
                {
                    q: "What should I do if I have a complaint?",
                    a: "We take all complaints seriously. Please contact our customer support team through your account dashboard or email us directly. We will investigate your concern and respond promptly. Your feedback helps us improve our services."
                }
            ]
        }
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    let questionIndex = 0;

    return (
        <>
            <Head title="Frequently Asked Questions - On-Time Transportation" />
            
            <div className="min-h-screen logo-background">
                {/* Navigation */}
                <nav className="glass-nav fixed w-full top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center group">
                                    <div className="transform group-hover:scale-110 transition-transform">
                                        <ApplicationLogo className="h-10 w-auto" />
                                    </div>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <Link
                                        href="/parent/dashboard"
                                        className="text-gray-800 hover:text-brand-primary px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-white/50"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-800 hover:text-brand-primary px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-white/50"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/parent/register"
                                            className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="pt-24 pb-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <Link
                                href="/"
                                className="text-blue-400 hover:text-blue-300 font-semibold mb-4 inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                                Frequently Asked Questions
                            </h1>
                            <p className="text-white/70 text-lg">
                                Find answers to common questions about our private child transportation services
                            </p>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((category, catIndex) => (
                                <GlassCard key={catIndex} className="p-6 md:p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
                                    <div className="space-y-4">
                                        {category.questions.map((faq, qIndex) => {
                                            const currentIndex = questionIndex++;
                                            return (
                                                <div key={qIndex} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                                                    <button
                                                        onClick={() => toggleQuestion(currentIndex)}
                                                        className="w-full text-left flex items-start justify-between gap-4 group"
                                                    >
                                                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors flex-1">
                                                            {faq.q}
                                                        </h3>
                                                        <svg
                                                            className={`w-6 h-6 text-white/60 flex-shrink-0 transition-transform ${
                                                                openIndex === currentIndex ? 'rotate-180' : ''
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                    {openIndex === currentIndex && (
                                                        <div className="mt-3 pl-0">
                                                            <p className="text-white/80 leading-relaxed">
                                                                {faq.a}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <GlassCard className="p-6 md:p-8 mt-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Can't find the answer you're looking for? Our support team is here to help.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
                                >
                                    Contact Support
                                </Link>
                                <Link
                                    href="/parent/register"
                                    className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </GlassCard>

                        {/* Disclaimer */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-white/60 italic">
                                <strong>Disclaimer:</strong> On-Time Transportation for Kids is a private transportation company and is not a school bus service. We do not operate under the authority of any school district or government agency.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

