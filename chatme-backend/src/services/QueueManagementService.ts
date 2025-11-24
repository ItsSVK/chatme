/**
 * Queue data structure for managing waiting users
 */
export class Queue {
	private storage: Record<number, string>;
	private head: number;
	private tail: number;
	private set: Set<string>;

	constructor() {
		this.storage = {};
		this.head = 0;
		this.tail = 0;
		this.set = new Set(); // track items
	}

	enqueue(value: string): boolean {
		if (this.set.has(value)) return false; // already exists

		this.storage[this.tail] = value;
		this.tail++;
		this.set.add(value);
		return true;
	}

	dequeue(): string | null {
		if (this.isEmpty()) return null;

		const value = this.storage[this.head];
		delete this.storage[this.head];
		this.head++;
		this.set.delete(value); // remove from lookup
		return value;
	}

	contains(value: string): boolean {
		return this.set.has(value);
	}

	isEmpty(): boolean {
		return this.tail === this.head;
	}

	/**
	 * Get all items in the queue as an array (for persistence)
	 */
	toArray(): string[] {
		const result: string[] = [];
		for (let i = this.head; i < this.tail; i++) {
			result.push(this.storage[i]);
		}
		return result;
	}
}

/**
 * Queue Management Service
 * Handles queue operations and persistence
 */
export class QueueManagementService {
	private queue: Queue;
	private storage: DurableObjectStorage;

	constructor(storage: DurableObjectStorage) {
		this.queue = new Queue();
		this.storage = storage;
	}

	/**
	 * Add a session to the queue
	 */
	enqueue(sessionId: string): boolean {
		return this.queue.enqueue(sessionId);
	}

	/**
	 * Get next available session from queue
	 */
	dequeue(): string | null {
		return this.queue.dequeue();
	}

	/**
	 * Check if session is in queue
	 */
	contains(sessionId: string): boolean {
		return this.queue.contains(sessionId);
	}

	/**
	 * Check if queue is empty
	 */
	isEmpty(): boolean {
		return this.queue.isEmpty();
	}

	/**
	 * Persist queue to storage
	 */
	async persist(): Promise<void> {
		const queueArray = this.queue.toArray();
		try {
			await this.storage.put('availableQueue', queueArray);
			console.log(`Persisted queue with ${queueArray.length} items`);
		} catch (error) {
			console.error('Error persisting queue to storage:', error);
		}
	}

	/**
	 * Restore queue from storage
	 */
	async restore(connections: Map<string, any>): Promise<void> {
		try {
			const storedQueue = await this.storage.get<string[]>('availableQueue');
			if (storedQueue && Array.isArray(storedQueue)) {
				// Rebuild queue from storage
				for (const sessionId of storedQueue) {
					// Only add if the connection still exists and is not currently matched
					const connection = connections.get(sessionId);
					if (connection && !connection.currentPartnerId) {
						this.queue.enqueue(sessionId);
					}
				}
				console.log(`Restored queue with ${storedQueue.length} items`);
			}
		} catch (error) {
			console.error('Error loading queue from storage:', error);
		}
	}
}
