/**
 * Factory Registry System
 *
 * This module provides a central registry for all factory functions.
 * It allows for dynamic registration of factories and provides a single entry point
 * for creating game objects from schema data.
 */

import { Ancestry } from "../character";
import { Path } from "../attributes/Path";
import { createAncestryFromData } from "./ancestryFactory";
import { createPathFromData } from "./pathFactory";
import { detectSchemaType, SchemaType } from "../utils/schemaUtils";

/**
 * Type definition for factory functions
 */
type FactoryFunction<T> = (data: any) => T;

/**
 * Interface for the factory registry
 */
interface FactoryRegistry {
	registerFactory: <T>(type: SchemaType, factory: FactoryFunction<T>) => void;
	createFromData: <T>(data: any) => T;
}

/**
 * The factory registry singleton
 */
class FactoryRegistryImpl implements FactoryRegistry {
	private factories: Map<SchemaType, FactoryFunction<any>> = new Map();

	/**
	 * Registers a factory function for a specific schema type
	 * @param type The schema type
	 * @param factory The factory function
	 */
	registerFactory<T>(type: SchemaType, factory: FactoryFunction<T>): void {
		this.factories.set(type, factory);
	}

	/**
	 * Creates a game object from schema data
	 * @param data The schema data
	 * @returns The created game object
	 */
	createFromData<T>(data: any): T {
		const type = detectSchemaType(data);

		if (type === "unknown") {
			throw new Error("Unknown schema type");
		}

		const factory = this.factories.get(type);
		if (!factory) {
			throw new Error(`No factory registered for schema type: ${type}`);
		}

		return factory(data) as T;
	}
}

// Create the singleton instance
const factoryRegistry = new FactoryRegistryImpl();

// Register built-in factories
factoryRegistry.registerFactory<Ancestry>("ancestry", createAncestryFromData);
factoryRegistry.registerFactory<Path>("novicePath", createPathFromData);
factoryRegistry.registerFactory<Path>("expertPath", createPathFromData);
factoryRegistry.registerFactory<Path>("masterPath", createPathFromData);

// Export the singleton instance
export { factoryRegistry };

/**
 * Helper function to create a game object from schema data
 * This provides a simpler API for users
 * @param data The schema data
 * @returns The created game object
 */
export function createFromData<T>(data: any): T {
	return factoryRegistry.createFromData<T>(data);
}
