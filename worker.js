import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Strip /magazine prefix for asset lookup
    let pathname = url.pathname;
    if (pathname.startsWith('/magazine')) {
      pathname = pathname.slice('/magazine'.length) || '/';
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
