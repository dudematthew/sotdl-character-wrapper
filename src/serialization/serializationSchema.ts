import {
	mainAttributes,
	NumericSecondaryAttributes,
	ArraySecondaryAttributes,
	ComplexSecondaryAttributes,
	Skill,
} from "../types";
import { AttributeCalculationSchema } from "./attributeCalculationSchema";
import { ChoiceConfigSchema } from "./choiceConfigSchema";

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
	initialChoices?: ChoiceConfigSchema[];
	levelBenefits: AttributeModifierSchema;
}

/**
 * Serialized version of AttributeModifier
 */
export interface AttributeModifierSchema {
	modifiers: Record<string, any>;
	choices?: ChoiceConfigSchema[];
}
