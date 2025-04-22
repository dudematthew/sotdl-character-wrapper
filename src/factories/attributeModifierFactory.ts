import { AttributeModifier } from "../attributes/AttributeModifier";
import { AttributeModifierSchema } from "../serialization/serializationSchema";
import { ChoiceConfig } from "../types";
import { createChoiceConfigFromSchema } from "./choiceConfigFactory";

/**
 * Creates an AttributeModifier instance from serialized AttributeModifierSchema data
 */
export function createAttributeModifierFromSchema(
	schema?: AttributeModifierSchema
): AttributeModifier {
	// If schema is undefined, return an empty AttributeModifier
	if (!schema) {
		return new AttributeModifier({});
	}

	// Extract the modifiers from the schema
	const modifiers = schema.modifiers || {};

	// Process choice configurations if they exist
	let choiceConfigs: ChoiceConfig | ChoiceConfig[] | undefined;

	if (schema.choices && schema.choices.length > 0) {
		// Convert each serialized choice to a ChoiceConfig
		choiceConfigs = schema.choices.map((choiceSchema) =>
			createChoiceConfigFromSchema(choiceSchema)
		);

		// If there's only one choice, unwrap it from the array
		if (choiceConfigs.length === 1) {
			choiceConfigs = choiceConfigs[0];
		}
	}

	// Create and return a new AttributeModifier with the extracted data
	return new AttributeModifier(modifiers, choiceConfigs);
}
