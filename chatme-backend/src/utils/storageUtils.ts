/**
 * Storage utility functions
 * Centralizes storage operations with error handling
 */

/**
 * Safely get a value from storage with error handling
 */
export async function storageGet<T>(
	storage: DurableObjectStorage,
	key: string,
	description: string
): Promise<T | null> {
	try {
		const value = await storage.get<T>(key);
		if (value !== undefined) {
			console.log(`Loaded ${description}: ${key}`);
			return value;
		}
		return null;
	} catch (error) {
		console.error(`Error loading ${description} from storage:`, error);
		return null;
	}
}

/**
 * Safely put a value to storage with error handling
 */
export async function storagePut<T>(
	storage: DurableObjectStorage,
	key: string,
	value: T,
	description: string
): Promise<boolean> {
	try {
		await storage.put(key, value);
		console.log(`Persisted ${description}: ${key}`);
		return true;
	} catch (error) {
		console.error(`Error persisting ${description} to storage:`, error);
		return false;
	}
}
