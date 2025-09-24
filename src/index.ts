/**
 * Cloudflare Worker for Live Audio Application
 * Serves the static assets and handles API requests
 */

export interface Env {
  AI: any;
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle health check
    if (url.pathname === '/health') {
      return new Response('healthy\n', {
        headers: { 'Content-Type': 'text/plain' },
        status: 200
      });
    }

    // Handle API requests for Gemini
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  }
};

async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  // For now, return a simple response
  // You can extend this to proxy requests to Gemini API if needed
  return new Response(JSON.stringify({ 
    message: 'Live Audio API endpoint',
    version: env.APP_VERSION || '0.0.1'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}