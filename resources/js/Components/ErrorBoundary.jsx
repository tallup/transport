import { Component } from 'react';

/**
 * Catches JavaScript errors in child component tree and shows a fallback UI
 * instead of blanking the app.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                    <div className="max-w-md w-full text-center p-8 rounded-2xl bg-white/10 border-2 border-yellow-400/50 backdrop-blur-sm">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border-2 border-red-400/50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-white/70 text-sm mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 rounded-xl font-bold bg-yellow-400/90 text-brand-primary hover:bg-yellow-400 transition-colors"
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
