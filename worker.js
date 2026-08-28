import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const assetManifest = JSON.parse(manifestJSON);

// Constant-time-ish string compare to avoid trivial timing leaks.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// HTTP Basic Auth check against env.ADMIN_PASSWORD.
// Fails closed (returns false) when the secret is unset so admin is never
// accidentally left open. Username is ignored; only the password is checked.
function isAuthorized(request, env) {
  const expected = env && env.ADMIN_PASSWORD;
  if (!expected) return false; // secret unset -> fail closed
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  let decoded;
  try {
    decoded = atob(header.slice('Basic '.length).trim());
  } catch {
    return false;
  }
  const sep = decoded.indexOf(':');
  const supplied = sep === -1 ? decoded : decoded.slice(sep + 1);
  return safeEqual(supplied, expected);
}

const UNAUTHORIZED = () =>
  new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="EVAN OS", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Strip /magazine prefix for asset lookup (boundary-safe: only strip when
    // the segment is exactly "/magazine" or "/magazine/...", never "/magazineFoo").
    let pathname = url.pathname;
    if (pathname === '/magazine' || pathname.startsWith('/magazine/')) {
      pathname = pathname.slice('/magazine'.length) || '/';
    }

    // Gate the admin dashboards and overview page behind HTTP Basic Auth.
    // The path here is post-strip, so it looks like "/admin/..." / "/overview".
    // This must run BEFORE any KV asset fetch so protected pages are never served.
    if (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname === '/overview' ||
      pathname.startsWith('/overview/')
    ) {
      if (!isAuthorized(request, env)) {
        return UNAUTHORIZED();
      }
    }

    // Rewrite the request URL for KV lookup
    const assetUrl = new URL(request.url);
    assetUrl.pathname = pathname;
    const assetRequest = new Request(assetUrl.toString(), request);

    try {
      return await getAssetFromKV(
        { request: assetRequest, waitUntil: ctx.waitUntil.bind(ctx) },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
          mapRequestToAsset: (req) => {
            const u = new URL(req.url);
            // If no extension, try index.html
            if (!u.pathname.includes('.')) {
              if (!u.pathname.endsWith('/')) u.pathname += '/';
              u.pathname += 'index.html';
            }
            return new Request(u.toString(), req);
          },
        }
      );
    } catch (e) {
      // Serve the 404 page if it exists, otherwise plain text 404
      try {
        const notFoundUrl = new URL(request.url);
        notFoundUrl.pathname = '/404.html';
        const notFoundReq = new Request(notFoundUrl.toString(), request);
        const notFoundResponse = await getAssetFromKV(
          { request: notFoundReq, waitUntil: ctx.waitUntil.bind(ctx) },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
        return new Response(notFoundResponse.body, {
          status: 404,
          headers: notFoundResponse.headers,
        });
      } catch {
        return new Response('Not found', {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }
  },
};
