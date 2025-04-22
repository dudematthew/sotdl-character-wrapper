import {
	mainAttributes,
	NumericSecondaryAttributes,
	secondaryAttributes,
} from "../types";
import {
	AttributeCalculationSchema,
	FixedAttributeCalculationSchema,
	AttributeBasedCalculationSchema,
	FormulaCalculationSchema,
} from "../serialization/attributeCalculationSchema";

/**
 * Type definition for attribute calculation functions
 * These functions compute secondary attributes from main attributes
 */
export type AttributeCalculationFunction = (
	mainAttrs: mainAttributes,
	level: number,
	secondaryAttrs: secondaryAttributes
) => number;

/**
 * Factory function to create calculation functions from serialized schema
 * This is the main entry point for creating attribute calculation functions
 */
export function createAttributeCalculationFunction(
	schema: AttributeCalculationSchema
): AttributeCalculationFunction {
	// Select the appropriate factory based on the schema type
	switch (schema.type) {
		case "fixed":
			return createFixedValueFunction(schema);
		case "attributeBased":
			return createAttributeBasedFunction(schema);
		case "formula":
			return createFormulaFunction(schema);
		default:
			throw new Error(
				`Unknown calculation type: ${(schema as any).type}`
			);
	}
}

/**
 * Creates a calculation function that returns a fixed value
 */
function createFixedValueFunction(
	schema: FixedAttributeCalculationSchema
): AttributeCalculationFunction {
	const value = schema.value;
	// Return a function that always returns the fixed value
	return () => value;
}

/**
 * Creates a calculation function based on another attribute
 */
function createAttributeBasedFunction(
	schema: AttributeBasedCalculationSchema
): AttributeCalculationFunction {
	const sourceAttribute = schema.sourceAttribute;
	const operation = schema.operation || "add"; // Default operation is add
	const modifier = schema.modifier || 0;

	return (mainAttrs, level, secondaryAttrs) => {
		// Determine the source value based on whether it's a main or secondary attribute
		let sourceValue: number;

		if (sourceAttribute in mainAttrs) {
			sourceValue = mainAttrs[sourceAttribute as keyof mainAttributes];
		} else if (sourceAttribute in secondaryAttrs) {
			sourceValue =
				secondaryAttrs[
					sourceAttribute as keyof NumericSecondaryAttributes
				];
		} else {
			throw new Error(`Source attribute not found: ${sourceAttribute}`);
		}

		// Apply the operation with the modifier
		switch (operation) {
			case "add":
				return sourceValue + modifier;
			case "subtract":
				return sourceValue - modifier;
			case "multiply":
				return sourceValue * (modifier || 1); // Default to 1 if modifier is not provided
			case "divide":
				if (modifier === 0) {
					throw new Error("Cannot divide by zero");
				}
				return Math.floor(sourceValue / (modifier || 1));
			default:
				return sourceValue;
		}
	};
}

/**
 * Creates a calculation function based on a formula string
 * Formulas can reference main and secondary attributes using $attribute syntax
 */
function createFormulaFunction(
	schema: FormulaCalculationSchema
): AttributeCalculationFunction {
	const formula = schema.formula;

	return (mainAttrs, level, secondaryAttrs) => {
		// Create a context with all available attributes
		const context = {
			...mainAttrs,
			...secondaryAttrs,
			level,
		};

		// Replace $attribute tokens with actual values
		const processedFormula = formula.replace(
			/\$(\w+)/g,
			(match, attribute) => {
				if (attribute in context) {
					return context[
						attribute as keyof typeof context
					].toString();
				}
				throw new Error(`Unknown attribute in formula: ${attribute}`);
			}
		);

		try {
			// Use Function constructor to create a dynamic function from the formula string
			// This is a safer alternative to eval() as it creates a new scope
			return Math.floor(new Function(`return ${processedFormula}`)());
		} catch (error) {
			throw new Error(`Error evaluating formula "${formula}": ${error}`);
		}
	};
}
