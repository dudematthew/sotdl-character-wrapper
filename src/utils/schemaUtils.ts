/**
 * Schema utilities for working with serialized game data
 * These utilities help identify and validate different types of schema objects
 */

import { AncestrySchema } from "../serialization/serializationSchema";
import {
	NovicePathSchema,
	ExpertPathSchema,
	MasterPathSchema,
	PathSchema,
} from "../serialization/pathSchema";

/**
 * Schema detection result types
 */
export type SchemaType =
	| "ancestry"
	| "novicePath"
	| "expertPath"
	| "masterPath"
	| "unknown";

/**
 * Detects the type of a schema object based on its structure
 * @param data The schema object to detect
 * @returns The detected schema type
 */
export function detectSchemaType(data: any): SchemaType {
	// Check if data is an object
	if (!data || typeof data !== "object") {
		return "unknown";
	}

	// Check for ancestry schema
	if (
		data.baseAttributes &&
		data.secondaryAttributes &&
		typeof data.secondaryAttributes === "object"
	) {
		return "ancestry";
	}

	// Check for path schema types
	if (data.type) {
		switch (data.type) {
			case "novice":
				return "novicePath";
			case "expert":
				return "expertPath";
			case "master":
				return "masterPath";
			default:
				// Attribute calculation schemas and choice config schemas also have a type
				// but we're not focusing on detecting those in this utility
				break;
		}
	}

	return "unknown";
}

/**
 * Validates an ancestry schema
 * @param data The schema to validate
 * @throws Error if the schema is invalid
 */
export function validateAncestrySchema(
	data: any
): asserts data is AncestrySchema {
	if (!data || typeof data !== "object") {
		throw new Error("Invalid ancestry schema: not an object");
	}

	// Check for required properties
	if (!data.baseAttributes || typeof data.baseAttributes !== "object") {
		throw new Error(
			"Invalid ancestry schema: missing or invalid baseAttributes"
		);
	}

	if (
		!data.secondaryAttributes ||
		typeof data.secondaryAttributes !== "object"
	) {
		throw new Error(
			"Invalid ancestry schema: missing or invalid secondaryAttributes"
		);
	}

	// Add more detailed validation as needed
}

/**
 * Validates a path schema of any type
 * @param data The schema to validate
 * @throws Error if the schema is invalid
 */
export function validatePathSchema(data: any): asserts data is PathSchema {
	if (!data || typeof data !== "object") {
		throw new Error("Invalid path schema: not an object");
	}

	if (!data.type) {
		throw new Error("Invalid path schema: missing type property");
	}

	// Validate based on path type
	switch (data.type) {
		case "novice":
			validateNovicePathSchema(data);
			break;
		case "expert":
			validateExpertPathSchema(data);
			break;
		case "master":
			validateMasterPathSchema(data);
			break;
		default:
			throw new Error(`Invalid path schema: unknown type '${data.type}'`);
	}
}

/**
 * Validates a novice path schema
 * @param data The schema to validate
 * @throws Error if the schema is invalid
 */
function validateNovicePathSchema(data: any): asserts data is NovicePathSchema {
	// Check for required level properties
	// In a real implementation, you might want more detailed validation
	if (data.type !== "novice") {
		throw new Error("Invalid novice path schema: incorrect type");
	}
}

/**
 * Validates an expert path schema
 * @param data The schema to validate
 * @throws Error if the schema is invalid
 */
function validateExpertPathSchema(data: any): asserts data is ExpertPathSchema {
	if (data.type !== "expert") {
		throw new Error("Invalid expert path schema: incorrect type");
	}
}

/**
 * Validates a master path schema
 * @param data The schema to validate
 * @throws Error if the schema is invalid
 */
function validateMasterPathSchema(data: any): asserts data is MasterPathSchema {
	if (data.type !== "master") {
		throw new Error("Invalid master path schema: incorrect type");
	}
}
