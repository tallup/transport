import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GlassCard from '@/Components/GlassCard';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Home - On-Time Transportation" />
            
            <div className="min-h-screen logo-background">
                {/* Navigation */}
                <nav className="glass-nav fixed w-full top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center">
                                    <ApplicationLogo className="h-10 w-auto" />
                                    <span className="ml-3 text-xl font-bold text-gray-800">
                                        ON-TIME TRANSPORTATION
                                    </span>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <Link
                                        href="/parent/dashboard"
                                        className="text-gray-800 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-semibold transition"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-800 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-semibold transition"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/parent/register"
                                            className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2 rounded-lg text-sm font-bold transition shadow-lg"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
                                Safe, Reliable Private Transportation
                                <span className="block text-brand-primary mt-3">For Your Children</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-semibold">
                                Private child transportation services between approved locations with parent authorization. 
                                Real-time tracking, flexible plans, and secure payments.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!auth?.user && (
                                    <>
                                        <Link
                                            href="/parent/register"
                                            className="bg-brand-primary hover:bg-brand-secondary text-white px-10 py-4 rounded-lg font-bold text-lg transition shadow-xl hover:shadow-2xl transform hover:scale-105"
                                        >
                                            Register Now
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-brand-primary transition shadow-lg"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                                Why Choose Our Transport Service?
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto font-semibold">
                                We provide private child transportation services between approved locations with parent authorization
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <GlassCard>
                                <div className="bg-brand-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Safe & Secure</h3>
                                <p className="text-white/80">
                                    All our vehicles are regularly maintained and our drivers are fully licensed and background checked.
                                </p>
                            </GlassCard>

                            {/* Feature 2 */}
                            <GlassCard>
                                <div className="bg-brand-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">On-Time Service</h3>
                                <p className="text-white/80">
                                    Punctual pickups and drop-offs with real-time tracking so you always know where your child is.
                                </p>
                            </GlassCard>

                            {/* Feature 3 */}
                            <GlassCard>
                                <div className="bg-brand-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Flexible Plans</h3>
                                <p className="text-white/80">
                                    Choose from weekly, monthly, academic term, or annual plans that fit your schedule.
                                </p>
                            </GlassCard>

                            {/* Feature 4 */}
                            <GlassCard>
                                <div className="bg-brand-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Easy Booking</h3>
                                <p className="text-white/80">
                                    Simple online booking system. Select routes, pickup points, and payment plans in minutes.
                                </p>
                            </GlassCard>

                            {/* Feature 5 */}
                            <GlassCard>
                                <div className="bg-brand-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Secure Payments</h3>
                                <p className="text-white/80">
                                    Safe and secure payment processing with Stripe. Multiple payment options available.
                                </p>
                            </GlassCard>

                            {/* Feature 6 */}
                            <GlassCard>
                                <div className="bg-brand-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Manage Online</h3>
                                <p className="text-white/80">
                                    Complete dashboard to manage students, bookings, and view transport history all in one place.
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                                How It Works
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto font-semibold">
                                Get started in just a few simple steps
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <GlassCard className="text-center">
                                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Register</h3>
                                <p className="text-white/80">
                                    Create your parent account and verify your email
                                </p>
                            </GlassCard>
                            
                            <GlassCard className="text-center">
                                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Add Student</h3>
                                <p className="text-white/80">
                                    Add your child's information and school details
                                </p>
                            </GlassCard>
                            
                            <GlassCard className="text-center">
                                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Book Transport</h3>
                                <p className="text-white/80">
                                    Select a route, pickup point, and payment plan
                                </p>
                            </GlassCard>
                            
                            <GlassCard className="text-center">
                                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    4
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Pay & Go</h3>
                                <p className="text-white/80">
                                    Complete secure payment and start using the service
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* Portal Access Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                                Portal Access
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto font-semibold">
                                Access your dedicated portal based on your role
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Admin Portal */}
                            <GlassCard className="text-center">
                                <div className="bg-brand-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Admin Portal</h3>
                                <p className="text-white/80 mb-6">
                                    Manage students, vehicles, routes, bookings, and system settings
                                </p>
                                <div>
                                    <Link
                                        href="/login"
                                        className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        Access Admin Portal
                                    </Link>
                                </div>
                                <p className="text-xs text-white/60 mt-4">
                                    For Super Admin & Transport Admin
                                </p>
                            </GlassCard>

                            {/* Driver Portal */}
                            <GlassCard className="text-center">
                                <div className="bg-brand-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Driver Portal</h3>
                                <p className="text-white/80 mb-6">
                                    View your assigned route, daily rosters, and student pickup information
                                </p>
                                <div>
                                    <Link
                                        href="/login"
                                        className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        Access Driver Portal
                                    </Link>
                                </div>
                                <p className="text-xs text-white/60 mt-4">
                                    For Drivers
                                </p>
                            </GlassCard>

                            {/* Parent Portal */}
                            <GlassCard className="text-center">
                                <div className="bg-brand-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Parent Portal</h3>
                                <p className="text-white/80 mb-6">
                                    Register students, book transport, manage bookings, and make payments
                                </p>
                                <div>
                                    <Link
                                        href="/parent/register"
                                        className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                                <p className="text-xs text-white/60 mt-4">
                                    For Parents
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <GlassCard className="p-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-white/80 mb-8 font-semibold">
                                Join hundreds of satisfied parents who trust us with their children's transportation
                            </p>
                            {!auth?.user && (
                                <Link
                                    href="/parent/register"
                                    className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-10 py-4 rounded-lg font-bold text-lg transition shadow-xl hover:shadow-2xl transform hover:scale-105"
                                >
                                    Register Now - It's Free
                                </Link>
                            )}
                        </GlassCard>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <ApplicationLogo className="h-8 w-auto" />
                                    <span className="ml-3 text-lg font-bold text-white">ON-TIME TRANSPORTATION</span>
                                </div>
                                <p className="text-white/70">
                                    Private child transportation services between approved locations with parent authorization.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-white/70">
                                    <li>
                                        <Link href="/" className="hover:text-white transition">Home</Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="hover:text-white transition">Login</Link>
                                    </li>
                                    <li>
                                        <Link href="/parent/register" className="hover:text-white transition">Register</Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/dashboard" className="hover:text-white transition">Admin Portal</Link>
                                    </li>
                                    <li>
                                        <Link href="/driver/dashboard" className="hover:text-white transition">Driver Portal</Link>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
                                <p className="text-white/70">
                                    Need help? Contact our support team for assistance.
                                </p>
                            </div>
                        </div>
                        
                        <div className="border-t border-white/10 mt-8 pt-8">
                            <p className="text-center text-white/70 mb-3">
                                &copy; {new Date().getFullYear()} School Transport System. All rights reserved.
                            </p>
                            <p className="text-center text-xs text-white/50 italic">
                                <strong>Disclaimer:</strong> On-Time Transportation for Kids is a private transportation company and is not a school bus service. We do not operate under the authority of any school district or government agency.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
