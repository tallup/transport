import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import GlassButton from '@/Components/GlassButton';
import offlineManager from '@/utils/offlineManager';

export default function Offline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState(0);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(navigator.onLine);
      setPendingActions(offlineManager.pendingActions.length);
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    window.addEventListener('offline:online', updateStatus);
    window.addEventListener('offline:offline', updateStatus);

    updateStatus();

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      window.removeEventListener('offline:online', updateStatus);
      window.removeEventListener('offline:offline', updateStatus);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline) {
      window.location.reload();
    } else {
      offlineManager.syncPendingActions();
    }
  };

  return (
    <GuestLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              {isOnline ? 'You\'re Back Online!' : 'You\'re Offline'}
            </h1>

            <p className="text-white/80 mb-6">
              {isOnline
                ? 'Your connection has been restored. Click below to refresh the page.'
                : 'It looks like you\'re not connected to the internet. Some features may be limited.'}
            </p>

            {pendingActions > 0 && (
              <p className="text-yellow-400 mb-4">
                You have {pendingActions} pending action{pendingActions !== 1 ? 's' : ''} that will sync when you're back online.
              </p>
            )}

            <div className="flex gap-4 justify-center">
              <GlassButton variant="primary" onClick={handleRetry}>
                {isOnline ? 'Refresh Page' : 'Retry Connection'}
              </GlassButton>
              {!isOnline && (
                <GlassButton
                  variant="secondary"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </GlassButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}



