/**
 * Vite Plugin: mounts handleApiRequest as Connect middleware
 * Converts incoming Node http.IncomingMessage to Web Request, executes handleApiRequest,
 * and streams back the Web Response.
 */

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { handleApiRequest } from './apiRouter.ts';

function readDotEnvFile(): Record<string, string> {
  const vars: Record<string, string> = {};
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const eqIdx = trimmed.indexOf('=');
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          vars[key] = val;
        }
      });
    }
  } catch {
    // Ignore
  }
  return vars;
}

export function mybooksApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-mybooks-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const envFromFile = readDotEnvFile();
          const protocol = req.socket && (req.socket as any).encrypted ? 'https' : 'http';
          const host = req.headers.host || 'localhost:5173';
          const fullUrl = `${protocol}://${host}${req.url}`;

          // Collect body
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const bodyBuffer = Buffer.concat(chunks);
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && bodyBuffer.length > 0;

          // Convert Node headers to web Headers
          const headers = new Headers();
          for (const [key, val] of Object.entries(req.headers)) {
            if (val === undefined) continue;
            if (Array.isArray(val)) {
              val.forEach(v => headers.append(key, v));
            } else {
              headers.set(key, val);
            }
          }

          const webReq = new Request(fullUrl, {
            method: req.method,
            headers,
            body: hasBody ? bodyBuffer : undefined,
            // @ts-ignore
            duplex: 'half'
          });

          const webRes = await handleApiRequest(webReq, {
            ADMIN_KEY: envFromFile.ADMIN_KEY || process.env.ADMIN_KEY,
            ADMIN_EMAIL: envFromFile.ADMIN_EMAIL || process.env.ADMIN_EMAIL,
            APP_URL: envFromFile.APP_URL || process.env.APP_URL,
            GOOGLE_CLIENT_ID: envFromFile.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: envFromFile.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI: envFromFile.GOOGLE_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI,
            ...envFromFile,
            ...process.env
          });

          res.statusCode = webRes.status;
          if (typeof (webRes.headers as any).getSetCookie === 'function') {
            const cookies = (webRes.headers as any).getSetCookie();
            if (cookies && cookies.length > 0) {
              res.setHeader('Set-Cookie', cookies);
            }
          }
          webRes.headers.forEach((val, key) => {
            if (key.toLowerCase() !== 'set-cookie' || !res.hasHeader('Set-Cookie')) {
              res.setHeader(key, val);
            }
          });

          const resBuffer = await webRes.arrayBuffer();
          res.end(Buffer.from(resBuffer));
        } catch (err: any) {
          console.error('Vite API Middleware Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
        }
      });
    }
  };
}
