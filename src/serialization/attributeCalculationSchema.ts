import {
	mainAttributes,
	NumericSecondaryAttributes,
	secondaryAttributes,
} from "../types";

// Base interface with the discriminator field
export interface BaseAttributeCalculationSchema {
	type: string;
}

// Fixed value schema
export interface FixedAttributeCalculationSchema
	extends BaseAttributeCalculationSchema {
	type: "fixed";
	value: number;
}

// Attribute-based schema
export interface AttributeBasedCalculationSchema
	extends BaseAttributeCalculationSchema {
	type: "attributeBased";
	sourceAttribute: keyof mainAttributes | keyof NumericSecondaryAttributes; // 'strength', 'agility', etc.
	operation?: "add" | "subtract" | "multiply" | "divide";
	modifier?: number;
}

// Formula-based schema
export interface FormulaCalculationSchema
	extends BaseAttributeCalculationSchema {
	type: "formula";
	formula: string; // e.g. "$strength + $agility / 2"
}

// Union type of all possible calculation schemas
export type AttributeCalculationSchema =
	| FixedAttributeCalculationSchema
	| AttributeBasedCalculationSchema
	| FormulaCalculationSchema;
