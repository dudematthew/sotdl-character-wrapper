/**
 * File Utilities
 *
 * This module provides utilities for loading and saving JSON data.
 * It works in both browser and Node.js environments.
 */

/**
 * Result of a data load operation
 */
export interface LoadResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Environment detection
 */
const isNode =
	typeof process !== "undefined" &&
	process.versions != null &&
	process.versions.node != null;

/**
 * Loads JSON data from a string
 * @param jsonString The JSON string to parse
 * @returns The parsed data or an error
 */
export function loadFromString<T>(jsonString: string): LoadResult<T> {
	try {
		const data = JSON.parse(jsonString) as T;
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: `Failed to parse JSON: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

/**
 * Loads JSON data from a file in a Node.js environment
 * This function is only available in Node.js
 * @param filePath The path to the JSON file
 * @returns The parsed data or an error
 */
export async function loadFromFile<T>(
	filePath: string
): Promise<LoadResult<T>> {
	if (!isNode) {
		return {
			success: false,
			error: "loadFromFile is only available in Node.js environments",
		};
	}

	try {
		// Dynamic import to avoid bundling Node.js modules in browser builds
		const fs = await import("fs/promises");
		const data = await fs.readFile(filePath, "utf-8");
		return loadFromString<T>(data);
	} catch (error) {
		return {
			success: false,
			error: `Failed to load file: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

/**
 * Converts an object to a JSON string
 * @param data The data to stringify
 * @param pretty Whether to pretty-print the JSON (with indentation)
 * @returns The JSON string or an error
 */
export function convertToJson<T>(data: T, pretty = false): LoadResult<string> {
	try {
		const jsonString = JSON.stringify(data, null, pretty ? 2 : undefined);
		return { success: true, data: jsonString };
	} catch (error) {
		return {
			success: false,
			error: `Failed to stringify object: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

/**
 * Saves data to a file in a Node.js environment
 * This function is only available in Node.js
 * @param filePath The path to save the file to
 * @param data The data to save
 * @param pretty Whether to pretty-print the JSON (with indentation)
 * @returns Success or error status
 */
export async function saveToFile<T>(
	filePath: string,
	data: T,
	pretty = true
): Promise<{ success: boolean; error?: string }> {
	if (!isNode) {
		return {
			success: false,
			error: "saveToFile is only available in Node.js environments",
		};
	}

	// Convert data to JSON
	const jsonResult = convertToJson(data, pretty);
	if (!jsonResult.success || !jsonResult.data) {
		return jsonResult;
	}

	try {
		// Dynamic import to avoid bundling Node.js modules in browser builds
		const fs = await import("fs/promises");
		await fs.writeFile(filePath, jsonResult.data);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: `Failed to save file: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}
