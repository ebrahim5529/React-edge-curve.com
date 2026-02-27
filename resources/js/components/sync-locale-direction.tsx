import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Syncs document lang and dir attributes with the current page's locale/direction.
 * Enables RTL for dashboard (Arabic) and LTR for public pages (English).
 */
export default function SyncLocaleDirection() {
    const { locale = 'en', direction = 'ltr' } = usePage().props as {
        locale?: string;
        direction?: string;
    };

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = direction;
    }, [locale, direction]);

    return null;
}
