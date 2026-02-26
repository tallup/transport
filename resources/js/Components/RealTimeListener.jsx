import { useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { getEcho } from '@/echo';

/**
 * Subscribes to the current user's private channel and refreshes the page when
 * a portal update event is received (booking approved, payment received, pickup completed, etc.).
 */
export default function RealTimeListener() {
    const { auth } = usePage().props;
    const subscribed = useRef(false);

    useEffect(() => {
        const userId = auth?.user?.id;
        if (!userId) return;

        const echo = getEcho();
        if (!echo) return;

        const channelName = `App.Models.User.${userId}`;
        if (subscribed.current) return;
        subscribed.current = true;

        echo.private(channelName)
            .listen('.portal.update', (e) => {
                // Refresh current page data so all portals see updates
                router.reload({ only: [] });
            });

        return () => {
            subscribed.current = false;
            echo.leave(channelName);
        };
    }, [auth?.user?.id]);

    return null;
}
