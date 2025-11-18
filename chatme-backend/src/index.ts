import { ChatQueue } from './chatqueue';

/**
 * ChatMe Backend Worker
 * Handles WebSocket connections and routes them to the ChatQueue Durable Object
 */

// Export ChatQueue so it can be registered as a Durable Object
export { ChatQueue };

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
		// Get the ChatQueue Durable Object instance
		// Using a fixed name "main" so all connections go to the same instance
		const stub = env.CHAT_QUEUE.getByName('main');

		// Forward the request to the Durable Object
		// The Durable Object will handle WebSocket upgrades
		return stub.fetch(request);
	},
} satisfies ExportedHandler<Env>;
