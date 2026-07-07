'use client';
/**
 * usePageViewTracker — tracks page views whenever the Next.js pathname changes.
 * Sends a gtag('event', 'page_view') call with the current path.
 * Call this once from a layout or root component.
 */
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function usePageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    gtag('event', 'page_view', {
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);
}
