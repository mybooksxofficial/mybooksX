/**
 * SPA Route Manager
 * Provides client-side routing with browser History pushState/popState and full refresh persistence.
 */

import { useState, useEffect } from 'react';

export type AppRoute = '/' | '/dashboard' | '/redeem' | '/quest' | '/admin/redemptions';

export function navigateTo(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }
}

export function useCurrentRoute(): AppRoute {
  const getRoute = (): AppRoute => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/redeem') return '/redeem';
    if (path === '/dashboard') return '/dashboard';
    if (path === '/quest' || path === '/quiz') return '/quest';
    if (path === '/admin/redemptions' || path === '/admin') return '/admin/redemptions';
    return '/';
  };

  const [route, setRoute] = useState<AppRoute>(getRoute);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return route;
}

