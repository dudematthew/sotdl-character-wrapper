import {
	mainAttributes,
	NumericSecondaryAttributes,
	ArraySecondaryAttributes,
	ComplexSecondaryAttributes,
} from "../types";
import { AttributeCalculationSchema } from "./attributeCalculationSchema";

/**
 * Represents a serialized ancestry in JSON format
 */
export interface AncestrySchema {
	name: string;
	baseAttributes: mainAttributes;
	secondaryAttributes: {
		[K in keyof NumericSecondaryAttributes]: AttributeCalculationSchema;
	} & {
		[K in keyof ArraySecondaryAttributes]: string[];
	} & {
		[K in keyof ComplexSecondaryAttributes]: ComplexSecondaryAttributes[K];
	};
	levelBenefits: AttributeModifierSchema;
}
/**
 * Serialized version of AttributeModifier
 */
export interface AttributeModifierSchema {
	modifiers: Record<string, any>;
	choices?: ChoiceConfigSchema;
}

/**
 * Serialized choice configuration
 */
export interface ChoiceConfigSchema {
	type: string;
	count: number;
	// Other properties depending on choice type
	availableSkills?: Array<{ name: string; description: string }>;
	// ... other choice properties
}
