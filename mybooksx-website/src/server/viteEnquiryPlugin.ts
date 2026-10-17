import type { Plugin } from 'vite';
import { processEnquirySubmission, type EnquiryPayload } from './enquiryHandler.ts';

export function enquiryApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-mybooks-enquiry-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/enquiry' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload: EnquiryPayload = JSON.parse(body || '{}');
              const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
              const result = processEnquirySubmission(payload, clientIp);

              res.statusCode = result.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.response));
            } catch (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                message: 'Invalid JSON payload received.'
              }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/enquiry/health') && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', service: 'MyBooks Enquiry API v1' }));
          return;
        }

        next();
      });
    }
  };
}
