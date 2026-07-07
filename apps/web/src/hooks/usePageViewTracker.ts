'use client';
/**
 * usePageViewTracker — tracks page views whenever the Next.js pathname changes.
 * Sends a gtag('event', 'page_view') call with the current path.
 * Call this once from a layout or root component.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') return;

    const url = pathname + (window.location.search || '');
    gtag('event', 'page_view', {
      page_path: url,
      page_title: document.title,
    });
  }, [pathname]);
}
