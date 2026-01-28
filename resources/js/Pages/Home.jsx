import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GlassCard from '@/Components/GlassCard';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Home - On-Time Transportation" />
            
            <div className="min-h-screen logo-background">
                {/* Navigation - Transparent */}
                <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-sm">
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
                                        className="text-brand-primary hover:text-brand-secondary px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-brand-primary/10 backdrop-blur-sm"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-brand-primary hover:text-brand-secondary px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-brand-primary/10 backdrop-blur-sm"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/parent/register"
                                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section - Modern Design */}
                <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#22304d] to-[#1a2332]"></div>
                    
                    {/* Animated Orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-brand-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                    </div>
                    
                    <div className="max-w-6xl mx-auto relative z-10 pt-4 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left Content - 7 columns */}
                            <div className="lg:col-span-7 space-y-4">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 animate-fade-in">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <span className="text-brand-primary font-semibold text-sm">Trusted by 500+ Families</span>
                                </div>
                                
                                {/* Main Heading - Animated */}
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1]">
                                    <span className="block animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                        Safe & Reliable
                                    </span>
                                    <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-slide-up animate-gradient" style={{ animationDelay: '0.4s', backgroundSize: '200% 200%' }}>
                                        Child Transportation
                                    </span>
                                </h1>
                                
                                {/* Description */}
                                <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                                    Private child transportation services between approved locations with parent authorization. Real-time tracking and flexible plans.
                                </p>
                                
                                {/* CTA Buttons */}
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {!auth?.user && (
                                        <>
                                            <Link
                                                href="/parent/register"
                                                className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-3.5 rounded-lg font-bold text-base transition-all shadow-lg hover:shadow-xl hover:shadow-yellow-500/30 transform hover:scale-[1.02] flex items-center gap-2 overflow-hidden"
                                            >
                                                <span>Get Started</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href="/login"
                                                className="bg-yellow-400/10 backdrop-blur-sm border border-yellow-400/30 text-yellow-600 px-8 py-3.5 rounded-lg font-bold text-base hover:bg-yellow-400/20 hover:border-yellow-400/50 transition-all flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Sign In</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Right Stats - 5 columns */}
                            <div className="lg:col-span-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <GlassCard className="p-5 text-center hover:scale-105 transition-all duration-300 border border-brand-primary/20">
                                        <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">100%</div>
                                        <div className="text-sm text-brand-primary/80 font-medium">Safe & Secure</div>
                                    </GlassCard>
                                    <GlassCard className="p-5 text-center hover:scale-105 transition-all duration-300 border border-brand-primary/20">
                                        <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">24/7</div>
                                        <div className="text-sm text-brand-primary/80 font-medium">Support</div>
                                    </GlassCard>
                                    <GlassCard className="p-5 text-center hover:scale-105 transition-all duration-300 border border-brand-primary/20">
                                        <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">99%</div>
                                        <div className="text-sm text-brand-primary/80 font-medium">On-Time</div>
                                    </GlassCard>
                                    <GlassCard className="p-5 text-center hover:scale-105 transition-all duration-300 border border-brand-primary/20">
                                        <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">500+</div>
                                        <div className="text-sm text-brand-primary/80 font-medium">Families</div>
                                    </GlassCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Compact */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-3 drop-shadow-lg">
                                Why Parents Trust Us
                            </h2>
                            <p className="text-lg text-brand-primary/80 max-w-2xl mx-auto font-medium">
                                Everything you need for safe, reliable child transportation
                            </p>
                            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-primary mb-2">Safe & Secure</h3>
                                <p className="text-brand-primary/80 text-sm leading-relaxed">
                                    All vehicles are regularly maintained and our drivers are fully licensed, background checked, and trained for child transportation.
                                </p>
                            </GlassCard>

                            {/* Feature 2 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-primary mb-2">Always On-Time</h3>
                                <p className="text-brand-primary/80 text-sm leading-relaxed">
                                    Punctual pickups and drop-offs with real-time GPS tracking. You'll always know exactly where your child is.
                                </p>
                            </GlassCard>

                            {/* Feature 3 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-primary mb-2">Flexible Plans</h3>
                                <p className="text-brand-primary/80 text-sm leading-relaxed">
                                    Choose from weekly, monthly, academic term, or annual plans. Perfect for any schedule or need.
                                </p>
                            </GlassCard>

                            {/* Feature 4 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-primary mb-2">Easy Booking</h3>
                                <p className="text-brand-primary/80 text-sm leading-relaxed">
                                    Book in minutes with our simple online system. Select routes, pickup points, and payment plans with ease.
                                </p>
                            </GlassCard>

                            {/* Feature 5 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-primary mb-2">Secure Payments</h3>
                                <p className="text-brand-primary/80 text-sm leading-relaxed">
                                    Industry-leading security with Stripe. Multiple payment options and automatic billing available.
                                </p>
                            </GlassCard>

                            {/* Feature 6 */}
                            <GlassCard className="group hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-primary mb-2">Manage Everything</h3>
                                <p className="text-brand-primary/80 text-sm leading-relaxed">
                                    Complete dashboard to manage students, bookings, view history, and track rides all in one place.
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* How It Works Section - Compact */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-3 drop-shadow-lg">
                                How It Works
                            </h2>
                            <p className="text-lg text-brand-primary/80 max-w-2xl mx-auto font-medium">
                                Get started in just 4 simple steps
                            </p>
                            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { num: 1, title: 'Register', desc: 'Create your parent account and verify your email in minutes' },
                                { num: 2, title: 'Add Student', desc: 'Add your child\'s information and school details' },
                                { num: 3, title: 'Book Transport', desc: 'Select a route, pickup point, and payment plan' },
                                { num: 4, title: 'Pay & Go', desc: 'Complete secure payment and start using the service' }
                            ].map((step, index) => (
                                <div key={step.num} className="relative">
                                    <GlassCard className="text-center h-full hover:scale-105 transition-transform duration-300 p-5">
                                        <div className="relative mb-4">
                                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-extrabold mx-auto shadow-lg">
                                                {step.num}
                                            </div>
                                            {index < 3 && (
                                                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400/50 to-transparent transform translate-x-4"></div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-yellow-600 mb-2">{step.title}</h3>
                                        <p className="text-brand-primary/80 text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </GlassCard>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portal Access Section - Compact */}
                <section className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-3 drop-shadow-lg">
                                Choose Your Portal
                            </h2>
                            <p className="text-lg text-brand-primary/80 max-w-2xl mx-auto font-medium">
                                Access your dedicated portal based on your role
                            </p>
                            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Admin Portal */}
                            <GlassCard className="text-center hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-600 mb-2">Admin Portal</h3>
                                <p className="text-brand-primary/80 mb-4 text-sm leading-relaxed">
                                    Manage students, vehicles, routes, bookings, and system settings
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Access Portal
                                </Link>
                                <p className="text-xs text-brand-primary/60 mt-3">
                                    For Super Admin & Transport Admin
                                </p>
                            </GlassCard>

                            {/* Driver Portal */}
                            <GlassCard className="text-center hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-600 mb-2">Driver Portal</h3>
                                <p className="text-brand-primary/80 mb-4 text-sm leading-relaxed">
                                    View assigned routes, daily rosters, and student pickup information
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Access Portal
                                </Link>
                                <p className="text-xs text-brand-primary/60 mt-3">
                                    For Drivers
                                </p>
                            </GlassCard>

                            {/* Parent Portal */}
                            <GlassCard className="text-center hover:scale-105 transition-transform duration-300 p-5">
                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-600 mb-2">Parent Portal</h3>
                                <p className="text-brand-primary/80 mb-4 text-sm leading-relaxed">
                                    Register students, book transport, manage bookings, and make payments
                                </p>
                                <Link
                                    href="/parent/register"
                                    className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Get Started
                                </Link>
                                <p className="text-xs text-brand-primary/60 mt-3">
                                    For Parents
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* CTA Section - Compact */}
                <section className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <GlassCard className="p-8 md:p-10 text-center relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-3 drop-shadow-lg">
                                    Ready to Get Started?
                                </h2>
                                <p className="text-lg md:text-xl text-brand-primary/80 mb-6 font-medium max-w-2xl mx-auto">
                                    Join hundreds of satisfied parents who trust us with their children's safe transportation
                                </p>
                                {!auth?.user && (
                                    <Link
                                        href="/parent/register"
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-12 py-5 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105"
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

                {/* Footer - Modern Redesign */}
                <footer className="relative bg-gradient-to-b from-brand-primary via-brand-primary/95 to-brand-primary backdrop-blur-sm border-t border-brand-primary/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/90 via-brand-primary/95 to-brand-secondary/90"></div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                        {/* Main Footer Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                            {/* Company Info */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center mb-6">
                                    <ApplicationLogo className="h-10 w-auto" />
                                    <span className="ml-3 text-xl font-extrabold text-white tracking-tight">ON-TIME</span>
                                </div>
                                <p className="text-white/80 leading-relaxed mb-4 text-sm">
                                    Private child transportation services between approved locations with parent authorization.
                                </p>
                                <p className="text-white/60 text-xs font-medium">
                                    Your trusted partner in safe, reliable child transportation.
                                </p>
                                
                                {/* Social Media Links - Placeholder */}
                                <div className="flex items-center gap-4 mt-6">
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                                        <svg className="w-5 h-5 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                                        <svg className="w-5 h-5 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                                        <svg className="w-5 h-5 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></span>
                                    Quick Links
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/login" className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">Login</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/parent/register" className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">Register</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/faq" className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">FAQ</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/dashboard" className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">Admin Portal</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/driver/dashboard" className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">Driver Portal</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal & Information */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></span>
                                    Legal
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/privacy-policy" className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms-and-conditions" className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">Terms & Conditions</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact & Support */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></span>
                                    Contact Us
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-brand-primary/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                                            <svg className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-medium mb-1">Email</p>
                                            <p className="text-white/90 font-medium text-sm">support@ontimetransport.com</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-brand-primary/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                                            <svg className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-medium mb-1">Phone</p>
                                            <p className="text-white/90 font-medium text-sm">24/7 Support Available</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-brand-primary/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                                            <svg className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-medium mb-1">Hours</p>
                                            <p className="text-white/90 font-medium text-sm">24/7 Emergency Support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-white/20 pt-8 mt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-white/90 text-sm text-center md:text-left">
                                    &copy; {new Date().getFullYear()} <span className="font-semibold text-white">On-Time Transportation</span>. All rights reserved.
                                </p>
                                
                                <p className="text-xs text-white/80 italic text-center md:text-right max-w-2xl">
                                    <strong className="text-white">Disclaimer:</strong> On-Time Transportation for Kids is a private transportation company and is not a school bus service. We do not operate under the authority of any school district or government agency.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
