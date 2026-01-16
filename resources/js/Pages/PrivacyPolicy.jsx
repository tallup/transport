import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GlassCard from '@/Components/GlassCard';

export default function PrivacyPolicy({ auth }) {
    return (
        <>
            <Head title="Privacy Policy - On-Time Transportation" />
            
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
                                Privacy Policy
                            </h1>
                            <p className="text-white/70 text-lg">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        <GlassCard className="p-6 md:p-8 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    On-Time Transportation for Kids ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our private child transportation services.
                                </p>
                                <p className="text-white/80 leading-relaxed">
                                    By using our services, you agree to the collection and use of information in accordance with this policy. Please read this Privacy Policy carefully to understand our practices regarding your personal data.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                                
                                <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We collect personal information that you provide directly to us, including:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4 mb-4">
                                    <li>Name, email address, phone number, and mailing address</li>
                                    <li>Student information including name, date of birth, school details, and grade</li>
                                    <li>Payment information (processed securely through Stripe)</li>
                                    <li>Emergency contact information</li>
                                    <li>Booking and transportation preferences</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    When you use our services, we may automatically collect certain information, including:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>Device information (IP address, browser type, operating system)</li>
                                    <li>Usage data (pages visited, time spent, features used)</li>
                                    <li>Location data (for pickup and dropoff tracking)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We use the information we collect for the following purposes:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>To provide, maintain, and improve our transportation services</li>
                                    <li>To process bookings and manage your account</li>
                                    <li>To communicate with you about your bookings, service updates, and important information</li>
                                    <li>To ensure the safety and security of children during transportation</li>
                                    <li>To process payments and manage billing</li>
                                    <li>To send you notifications about route changes, delays, or emergencies</li>
                                    <li>To comply with legal obligations and enforce our terms of service</li>
                                    <li>To analyze usage patterns and improve our services</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our platform, such as payment processors and email service providers</li>
                                    <li><strong>Safety and Security:</strong> With drivers and authorized personnel who need access to information to provide safe transportation services</li>
                                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                                    <li><strong>Emergency Situations:</strong> In emergency situations to protect the health and safety of children</li>
                                    <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of our business</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
                                    <li>Secure storage of data in encrypted databases</li>
                                    <li>Regular security assessments and updates</li>
                                    <li>Limited access to personal information on a need-to-know basis</li>
                                    <li>Secure payment processing through Stripe</li>
                                </ul>
                                <p className="text-white/80 leading-relaxed mt-4">
                                    However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    You have the right to:
                                </p>
                                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                                    <li>Access and receive a copy of your personal information</li>
                                    <li>Correct inaccurate or incomplete information</li>
                                    <li>Request deletion of your personal information (subject to legal obligations)</li>
                                    <li>Object to or restrict certain processing of your information</li>
                                    <li>Withdraw consent where processing is based on consent</li>
                                    <li>Opt-out of marketing communications</li>
                                </ul>
                                <p className="text-white/80 leading-relaxed mt-4">
                                    To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Our services are designed for parents to arrange transportation for their children. We collect student information only with explicit parental consent. We take special care to protect children's personal information and comply with applicable child protection laws.
                                </p>
                                <p className="text-white/80 leading-relaxed">
                                    Parents have full control over their children's information and can request access, correction, or deletion at any time.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Privacy Policy</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="bg-white/5 rounded-lg p-4 text-white/80">
                                    <p className="font-semibold mb-2">On-Time Transportation for Kids</p>
                                    <p>Email: privacy@ontimetransport.com</p>
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

