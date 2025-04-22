import { AttributeModifier } from "../attributes/AttributeModifier";
import { Ancestry } from "../character";
import { AncestrySchema } from "../serialization/serializationSchema";
import {
	attributeCalculationRules,
	ChoiceConfig,
	mainAttributes,
	secondaryAttributes,
} from "../types";
import { createAttributeCalculationFunction } from "./attributeCalculationFactory";
import { createAttributeModifierFromSchema } from "./attributeModifierFactory";
import { createChoiceConfigFromSchema } from "./choiceConfigFactory";

/**
 * Creates an Ancestry object from serialized AncestrySchema data
 * This follows the function factory pattern to convert serialized calculations to actual functions
 */
export function createAncestryFromData(data: AncestrySchema): Ancestry {
	// Extract base attributes directly
	const baseAttributes = data.baseAttributes;

	// Create secondary attribute calculation rules using function factories
	const secondaryAttrs: attributeCalculationRules = {
		// Numeric secondary attributes - create calculation functions for each
		perception: createAttributeCalculationFunction(
			data.secondaryAttributes.perception
		),
		defense: createAttributeCalculationFunction(
			data.secondaryAttributes.defense
		),
		health: createAttributeCalculationFunction(
			data.secondaryAttributes.health
		),
		healingRate: createAttributeCalculationFunction(
			data.secondaryAttributes.healingRate
		),
		size: createAttributeCalculationFunction(data.secondaryAttributes.size),
		speed: createAttributeCalculationFunction(
			data.secondaryAttributes.speed
		),
		power: createAttributeCalculationFunction(
			data.secondaryAttributes.power
		),
		damage: createAttributeCalculationFunction(
			data.secondaryAttributes.damage
		),
		insanity: createAttributeCalculationFunction(
			data.secondaryAttributes.insanity
		),
		corruption: createAttributeCalculationFunction(
			data.secondaryAttributes.corruption
		),

		// Array secondary attributes - create functions that return the arrays
		languages: () => [...data.secondaryAttributes.languages],
		professions: () => [...data.secondaryAttributes.professions],
		skills: () => [...data.secondaryAttributes.skills],
	};

	// Create level 4 ancestry benefits - AttributeModifier
	const levelBenefits = createAttributeModifierFromSchema(data.levelBenefits);

	// Convert initial choices if they exist
	let initialChoices: ChoiceConfig | ChoiceConfig[] | undefined;

	if (data.initialChoices && data.initialChoices.length > 0) {
		// Convert each choice schema to a ChoiceConfig
		const choiceConfigs = data.initialChoices.map((schema) =>
			createChoiceConfigFromSchema(schema)
		);

		// If there's only one choice, unwrap it from the array for consistency with the Ancestry class
		initialChoices =
			choiceConfigs.length === 1 ? choiceConfigs[0] : choiceConfigs;
	}

	// Create and return a new Ancestry with the converted data
	return new Ancestry(
		baseAttributes,
		secondaryAttrs,
		levelBenefits,
		initialChoices
	);
}
