import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const apiRouterPath = path.join(rootDir, 'src/server/apiRouter.ts');
let code = fs.readFileSync(apiRouterPath, 'utf8');

const oldBlock = `    // Real Name & Mobile Phone Authentication (Zero Google OAuth errors)
    if (pathname === '/api/auth/phone' && method === 'POST') {
      try {
        const body: any = await req.json();
        const result = await AuthService.loginOrRegisterWithPhone(db, {
          fullName: body.fullName || body.name || '',
          phone: body.phone || body.mobile || '',
          clientIp
        });
        if (result.success && result.sessionToken) {
          return jsonResponse(result, 200, {
            'Set-Cookie': createSessionCookie(result.sessionToken)
          });
        }
        return jsonResponse(result, result.success ? 200 : 400);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Phone sign-in failed.' }, 400);
      }
    }`;

const newBlock = `    // Real Name & Mobile Phone Authentication (Zero Google OAuth errors)
    if (pathname === '/api/auth/phone' && method === 'POST') {
      try {
        const body: any = await req.json();
        const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
        const result = await AuthService.loginOrRegisterWithPhone(db, {
          fullName: body.fullName || body.name || '',
          phone: body.phone || body.mobile || '',
          clientIp
        });
        if (result.success && result.sessionToken) {
          const isHttps = url.protocol === 'https:';
          const cookieHeader = \`mbx_session=\${result.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000\${isHttps ? '; Secure' : ''}\`;
          return jsonResponse(result, 200, {
            'Set-Cookie': cookieHeader
          });
        }
        return jsonResponse(result, result.success ? 200 : 400);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Phone sign-in failed.' }, 400);
      }
    }`;

code = code.replace(oldBlock.replace(/\r\n/g, '\n'), newBlock);
code = code.replace(oldBlock.replace(/\n/g, '\r\n'), newBlock.replace(/\n/g, '\r\n'));

fs.writeFileSync(apiRouterPath, code, 'utf8');
console.log('✅ Updated /api/auth/phone in apiRouter.ts');

