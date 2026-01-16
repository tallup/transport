import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GlassCard from '@/Components/GlassCard';

export default function TermsAndConditions({ auth }) {
    return (
        <>
            <Head title="Terms and Conditions - On-Time Transportation" />
            
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
                                Terms and Conditions
                            </h1>
                            <p className="text-white/70 text-lg">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        <GlassCard className="p-6 md:p-8 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    By accessing and using the services provided by On-Time Transportation for Kids ("we," "our," or "us"), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
                                </p>
                                <p className="text-white/80 leading-relaxed">
                                    These terms apply to all users, including parents, guardians, and any other individuals who access or use our private child transportation services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    On-Time Transportation for Kids provides private child transportation services between approved locations with parent authorization. Our services include:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>Private transportation between approved pickup and dropoff locations</li>
                                    <li>Transportation services requiring explicit parent authorization</li>
                                    <li>Flexible booking plans (weekly, monthly, academic term, or annual)</li>
                                    <li>Real-time tracking and communication</li>
                                    <li>Secure payment processing</li>
                                </ul>
                                <p className="text-white/80 leading-relaxed mt-4 italic">
                                    <strong>Important:</strong> On-Time Transportation for Kids is a private transportation company and is not a school bus service. We do not operate under the authority of any school district or government agency.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts and Registration</h2>
                                <h3 className="text-xl font-semibold text-white mb-3">3.1 Account Creation</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    To use our services, you must create an account and provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                </p>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Eligibility</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    You must be at least 18 years old and have the legal capacity to enter into binding contracts. If you are registering on behalf of a child, you represent and warrant that you are the parent or legal guardian with authority to make decisions regarding the child's transportation.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Bookings and Payments</h2>
                                <h3 className="text-xl font-semibold text-white mb-3">4.1 Booking Process</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    All bookings are subject to availability and our acceptance. We reserve the right to refuse service to anyone at our discretion. Bookings are confirmed upon successful payment processing.
                                </p>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Pricing</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Prices are determined based on route, distance, booking plan, and other factors. All prices are subject to change without notice. Final pricing will be displayed before payment confirmation.
                                </p>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Payment Terms</h3>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>Payment must be made in full before service begins, unless otherwise agreed</li>
                                    <li>We accept payment through Stripe (credit cards, debit cards)</li>
                                    <li>All payments are processed securely and in accordance with PCI DSS standards</li>
                                    <li>Refunds are subject to our cancellation policy</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.4 Cancellations and Refunds</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Cancellation requests must be submitted through your account portal. Refund eligibility depends on:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>Timing of the cancellation request</li>
                                    <li>Type of booking plan (one-time, subscription, etc.)</li>
                                    <li>Reasons for cancellation</li>
                                    <li>Services already rendered</li>
                                </ul>
                                <p className="text-white/80 leading-relaxed mt-4">
                                    Detailed cancellation and refund policies are available in your booking confirmation and account dashboard.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Service Standards and Safety</h2>
                                <h3 className="text-xl font-semibold text-white mb-3">5.1 Safety Requirements</h3>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>All drivers are licensed, background-checked, and trained</li>
                                    <li>Vehicles are regularly maintained and inspected</li>
                                    <li>Students must be ready at the scheduled pickup time</li>
                                    <li>Parents must provide accurate contact information for emergencies</li>
                                    <li>Students must follow driver instructions and safety guidelines</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Behavior Standards</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We reserve the right to refuse service or terminate bookings if a student's behavior poses a safety risk or violates our code of conduct. Inappropriate behavior may result in immediate service termination without refund.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">6. Liability and Limitation of Liability</h2>
                                <h3 className="text-xl font-semibold text-white mb-3">6.1 Service Provision</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    While we strive to provide safe, reliable, and punctual services, we cannot guarantee that services will be uninterrupted, error-free, or completely without delay. We are not liable for delays caused by:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>Traffic conditions</li>
                                    <li>Weather conditions</li>
                                    <li>Vehicle breakdowns</li>
                                    <li>Acts of nature or circumstances beyond our reasonable control</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.2 Limitation of Liability</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    To the maximum extent permitted by law, our liability is limited to the total amount paid for the specific service giving rise to the claim. We are not liable for indirect, incidental, special, consequential, or punitive damages.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    All content, trademarks, logos, and intellectual property on our platform are owned by On-Time Transportation for Kids or our licensors. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">8. Privacy</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We may terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties.
                                </p>
                                <p className="text-white/80 leading-relaxed">
                                    You may terminate your account at any time by contacting us. Upon termination, your right to use our services will immediately cease.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">10. Modifications to Terms</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We reserve the right to modify these Terms and Conditions at any time. We will notify users of significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the modified terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law and Dispute Resolution</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    These Terms and Conditions are governed by the laws of [Your Jurisdiction]. Any disputes arising from these terms or our services will be resolved through binding arbitration, except where prohibited by law.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    For questions about these Terms and Conditions, please contact us:
                                </p>
                                <div className="bg-white/5 rounded-lg p-4 text-white/80">
                                    <p className="font-semibold mb-2">On-Time Transportation for Kids</p>
                                    <p>Email: legal@ontimetransport.com</p>
                                    <p>Phone: [Your Contact Number]</p>
                                    <p>Address: [Your Business Address]</p>
                                </div>
                            </section>

                            {/* Disclaimer */}
                            <div className="border-t border-white/20 pt-6 mt-8">
                                <p className="text-xs text-white/60 italic text-center">
                                    <strong>Disclaimer:</strong> On-Time Transportation for Kids is a private transportation company and is not a school bus service. We do not operate under the authority of any school district or government agency.
                                </p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </>
    );
}

