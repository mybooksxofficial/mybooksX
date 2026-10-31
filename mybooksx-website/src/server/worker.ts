/**
 * Cloudflare Workers Entrypoint
 * Binds Cloudflare D1 (env.DB) and routes API requests
 */

import { handleApiRequest } from './apiRouter.ts';
import type { D1DatabaseLike } from './db/d1Client.ts';

export interface Env {
  DB: D1DatabaseLike;
  ADMIN_KEY?: string;
  ADMIN_EMAIL?: string;
  SESSION_SECRET?: string;
  APP_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    return new Response('Not Found', { status: 404 });
  }
};
