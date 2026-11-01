/**
 * SPA Route Manager
 * Provides 100% instant, reactive client-side routing with zero page refresh required.
 * Resets scroll position to (0, 0) immediately upon every route transition.
 */

import { useState, useEffect } from 'react';

export type AppRoute = '/' | '/dashboard' | '/redeem' | '/quest' | '/admin/redemptions';

// Reactive route listener store
type RouteListener = (route: AppRoute) => void;
const routeListeners = new Set<RouteListener>();

export function resolveRoute(path?: string): AppRoute {
  if (typeof window === 'undefined') return '/';
  const raw = (path || window.location.pathname || '/').toLowerCase().trim();
  const clean = raw.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
  const hash = (window.location.hash || '').toLowerCase();

  if (clean === '/redeem' || hash === '#redeem') return '/redeem';
  if (clean === '/dashboard' || hash === '#dashboard') return '/dashboard';
  if (clean === '/quest' || clean === '/quiz' || hash === '#quest' || hash === '#quiz') return '/quest';
  if (clean === '/admin/redemptions' || clean === '/admin' || hash === '#admin') return '/admin/redemptions';
  return '/';
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;

  const targetRoute = resolveRoute(path);

  try {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  } catch {}

  // Instant scroll to top to prevent opening scrolled at the bottom
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch {
    window.scrollTo(0, 0);
  }

  // Notify all active route listeners synchronously
  routeListeners.forEach(listener => {
    try {
      listener(targetRoute);
    } catch {}
  });

  try {
    window.dispatchEvent(new Event('popstate'));
    window.dispatchEvent(new CustomEvent('app_navigate', { detail: { path, targetRoute } }));
  } catch {}
}

export function useCurrentRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(() => resolveRoute());

  useEffect(() => {
    const handleRouteUpdate = () => {
      const newRoute = resolveRoute();
      setRoute(newRoute);
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {}
    };

    routeListeners.add(setRoute);
    window.addEventListener('popstate', handleRouteUpdate);
    window.addEventListener('hashchange', handleRouteUpdate);

    return () => {
      routeListeners.delete(setRoute);
      window.removeEventListener('popstate', handleRouteUpdate);
      window.removeEventListener('hashchange', handleRouteUpdate);
    };
  }, []);

  return route;
}
