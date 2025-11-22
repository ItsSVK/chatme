import { ChatQueue } from './chatqueue';

/**
 * ChatMe Backend Worker
 * Handles WebSocket connections and routes them to the ChatQueue Durable Object
 */

// Export ChatQueue so it can be registered as a Durable Object
export { ChatQueue };

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
	'http://localhost:5173',
	'http://localhost:5174',
	'http://localhost:3000', // For mobile dev
	// Add your production domains here:
	// 'https://your-domain.com',
];

/**
 * Handle CORS preflight requests
 */
function handleCORS(request: Request): Response | null {
	const origin = request.headers.get('Origin');

	if (request.method === 'OPTIONS') {
		if (origin && ALLOWED_ORIGINS.includes(origin)) {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': origin,
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Upgrade, Connection',
					'Access-Control-Max-Age': '86400',
				},
			});
		}
		return new Response('Forbidden', { status: 403 });
	}

	return null;
}

/**
 * Add CORS headers to response
 */
function addCORSHeaders(response: Response, origin: string | null): Response {
	if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.set('Access-Control-Allow-Origin', origin);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

export default {
	/**
	 * Main fetch handler for the Worker
	 * Handles WebSocket upgrade requests and routes them to ChatQueue
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Handle CORS preflight
		const corsResponse = handleCORS(request);
		if (corsResponse) {
			return corsResponse;
		}

		const origin = request.headers.get('Origin');

		// Validate origin for WebSocket connections
		if (request.headers.get('Upgrade') === 'websocket') {
			if (origin && !ALLOWED_ORIGINS.includes(origin)) {
				console.log(`Rejected WebSocket from unauthorized origin: ${origin}`);
				return new Response('Forbidden - Invalid origin', { status: 403 });
			}
		}

		// Get the ChatQueue Durable Object instance
		// Using a fixed name "main" so all connections go to the same instance
		const stub = env.CHAT_QUEUE.getByName('main');

		// Forward the request to the Durable Object
		// The Durable Object will handle WebSocket upgrades and authentication
		const response = await stub.fetch(request);

		// For WebSocket upgrades (status 101), don't modify the response
		// as it contains the WebSocket object which can't be cloned
		if (response.status === 101) {
			return response;
		}

		// Add CORS headers to non-WebSocket responses
		return addCORSHeaders(response, origin);
	},
} satisfies ExportedHandler<Env>;
