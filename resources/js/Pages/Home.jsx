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
                                <Link href="/" className="flex items-center group">
                                    <div className="transform group-hover:scale-110 transition-transform">
                                        <ApplicationLogo className="h-10 w-auto" />
                                    </div>
                                    <span className="ml-3 text-xl font-bold text-gray-800 group-hover:text-brand-primary transition">
                                        ON-TIME TRANSPORTATION
                                    </span>
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

                {/* Hero Section - Full Width with Gradient Overlay */}
                <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center max-w-5xl mx-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/20 backdrop-blur-sm border border-brand-primary/30 mb-6">
                                <span className="text-brand-primary font-bold text-sm">Trusted by Hundreds of Families</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                                Safe, Reliable
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-primary to-white mt-2">
                                    Transportation
                                </span>
                                <span className="block text-brand-primary mt-2">For Your Children</span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-semibold leading-relaxed">
                                Private child transportation services with real-time tracking, flexible plans, and secure payments. 
                                <span className="block mt-2 text-white/80">Your peace of mind is our priority.</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                {!auth?.user && (
                                    <>
                                        <Link
                                            href="/parent/register"
                                            className="group bg-brand-primary hover:bg-brand-secondary text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-brand-primary/50 transform hover:scale-105 flex items-center gap-2"
                                        >
                                            <span>Get Started Today</span>
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all shadow-xl flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sign In</span>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                                <div className="text-center">
                                    <div className="text-3xl font-extrabold text-white mb-1">100%</div>
                                    <div className="text-sm text-white/70 font-semibold">Safe & Secure</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-extrabold text-white mb-1">24/7</div>
                                    <div className="text-sm text-white/70 font-semibold">Support</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-extrabold text-white mb-1">99%</div>
                                    <div className="text-sm text-white/70 font-semibold">On-Time</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-extrabold text-white mb-1">500+</div>
                                    <div className="text-sm text-white/70 font-semibold">Families</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Enhanced Grid */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 drop-shadow-lg">
                                Why Parents Trust Us
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto font-semibold">
                                Everything you need for safe, reliable child transportation
                            </p>
                            <div className="w-24 h-1 bg-brand-primary mx-auto mt-6 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Safe & Secure</h3>
                                <p className="text-white/80 leading-relaxed">
                                    All vehicles are regularly maintained and our drivers are fully licensed, background checked, and trained for child transportation.
                                </p>
                            </GlassCard>

                            {/* Feature 2 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Always On-Time</h3>
                                <p className="text-white/80 leading-relaxed">
                                    Punctual pickups and drop-offs with real-time GPS tracking. You'll always know exactly where your child is.
                                </p>
                            </GlassCard>

                            {/* Feature 3 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Flexible Plans</h3>
                                <p className="text-white/80 leading-relaxed">
                                    Choose from weekly, monthly, academic term, or annual plans. Perfect for any schedule or need.
                                </p>
                            </GlassCard>

                            {/* Feature 4 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Easy Booking</h3>
                                <p className="text-white/80 leading-relaxed">
                                    Book in minutes with our simple online system. Select routes, pickup points, and payment plans with ease.
                                </p>
                            </GlassCard>

                            {/* Feature 5 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Secure Payments</h3>
                                <p className="text-white/80 leading-relaxed">
                                    Industry-leading security with Stripe. Multiple payment options and automatic billing available.
                                </p>
                            </GlassCard>

                            {/* Feature 6 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Manage Everything</h3>
                                <p className="text-white/80 leading-relaxed">
                                    Complete dashboard to manage students, bookings, view history, and track rides all in one place.
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* How It Works Section - Timeline Style */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 drop-shadow-lg">
                                How It Works
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto font-semibold">
                                Get started in just 4 simple steps
                            </p>
                            <div className="w-24 h-1 bg-brand-primary mx-auto mt-6 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { num: 1, title: 'Register', desc: 'Create your parent account and verify your email in minutes' },
                                { num: 2, title: 'Add Student', desc: 'Add your child\'s information and school details' },
                                { num: 3, title: 'Book Transport', desc: 'Select a route, pickup point, and payment plan' },
                                { num: 4, title: 'Pay & Go', desc: 'Complete secure payment and start using the service' }
                            ].map((step, index) => (
                                <div key={step.num} className="relative">
                                    <GlassCard className="text-center h-full hover:scale-105 transition-transform duration-300">
                                        <div className="relative mb-6">
                                            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold mx-auto shadow-xl">
                                                {step.num}
                                            </div>
                                            {index < 3 && (
                                                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-brand-primary/50 to-transparent transform translate-x-4"></div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                        <p className="text-white/80 leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </GlassCard>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portal Access Section - Enhanced Cards */}
                <section className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 drop-shadow-lg">
                                Choose Your Portal
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto font-semibold">
                                Access your dedicated portal based on your role
                            </p>
                            <div className="w-24 h-1 bg-brand-primary mx-auto mt-6 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Admin Portal */}
                            <GlassCard className="text-center hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary to-brand-secondary w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Admin Portal</h3>
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    Manage students, vehicles, routes, bookings, and system settings
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Access Portal
                                </Link>
                                <p className="text-xs text-white/60 mt-4">
                                    For Super Admin & Transport Admin
                                </p>
                            </GlassCard>

                            {/* Driver Portal */}
                            <GlassCard className="text-center hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary to-brand-secondary w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Driver Portal</h3>
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    View assigned routes, daily rosters, and student pickup information
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Access Portal
                                </Link>
                                <p className="text-xs text-white/60 mt-4">
                                    For Drivers
                                </p>
                            </GlassCard>

                            {/* Parent Portal */}
                            <GlassCard className="text-center hover:scale-105 transition-transform duration-300">
                                <div className="bg-gradient-to-br from-brand-primary to-brand-secondary w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Parent Portal</h3>
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    Register students, book transport, manage bookings, and make payments
                                </p>
                                <Link
                                    href="/parent/register"
                                    className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Get Started
                                </Link>
                                <p className="text-xs text-white/60 mt-4">
                                    For Parents
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* CTA Section - Enhanced */}
                <section className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <GlassCard className="p-12 md:p-16 text-center relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 drop-shadow-lg">
                                    Ready to Get Started?
                                </h2>
                                <p className="text-xl md:text-2xl text-white/80 mb-10 font-semibold max-w-2xl mx-auto">
                                    Join hundreds of satisfied parents who trust us with their children's safe transportation
                                </p>
                                {!auth?.user && (
                                    <Link
                                        href="/parent/register"
                                        className="inline-flex items-center gap-3 bg-brand-primary hover:bg-brand-secondary text-white px-12 py-5 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-brand-primary/50 transform hover:scale-105"
                                    >
                                        <span>Register Now - It's Free</span>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </section>

                {/* Footer - Enhanced */}
                <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                            <div>
                                <div className="flex items-center mb-6">
                                    <ApplicationLogo className="h-10 w-auto" />
                                    <span className="ml-3 text-xl font-bold text-white">ON-TIME TRANSPORTATION</span>
                                </div>
                                <p className="text-white/70 leading-relaxed mb-4">
                                    Private child transportation services between approved locations with parent authorization.
                                </p>
                                <p className="text-white/60 text-sm">
                                    Your trusted partner in safe, reliable child transportation.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
                                <ul className="space-y-3 text-white/70">
                                    <li>
                                        <Link href="/" className="hover:text-white transition flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="hover:text-white transition flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/parent/register" className="hover:text-white transition flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                                            Register
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/dashboard" className="hover:text-white transition flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                                            Admin Portal
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/driver/dashboard" className="hover:text-white transition flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                                            Driver Portal
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6">Contact & Support</h3>
                                <p className="text-white/70 mb-4 leading-relaxed">
                                    Need help? Our support team is here to assist you with any questions or concerns.
                                </p>
                                <div className="space-y-2 text-white/70">
                                    <p className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Available 24/7
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-white/10 pt-8">
                            <p className="text-center text-white/70 mb-4">
                                &copy; {new Date().getFullYear()} On-Time Transportation. All rights reserved.
                            </p>
                            <p className="text-center text-xs text-white/50 italic max-w-3xl mx-auto leading-relaxed">
                                <strong>Disclaimer:</strong> On-Time Transportation for Kids is a private transportation company and is not a school bus service. We do not operate under the authority of any school district or government agency.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
