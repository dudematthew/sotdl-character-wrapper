import {
	AttributeChoiceConfig,
	ChoiceConfig,
	LanguageChoiceConfig,
	ProfessionChoiceConfig,
	SkillChoiceConfig,
} from "../types";
import { SpellChoice } from "../types/spell";
import {
	AttributeChoiceConfigSchema,
	ChoiceConfigSchema,
	LanguageChoiceConfigSchema,
	ProfessionChoiceConfigSchema,
	SkillChoiceConfigSchema,
} from "../serialization/choiceConfigSchema";
import { SpellChoiceConfigSchema } from "../serialization/spellChoiceConfigSchema";

/**
 * Creates a ChoiceConfig object from a serialized schema
 */
export function createChoiceConfigFromSchema(
	schema: ChoiceConfigSchema
): ChoiceConfig {
	// Use the type discriminator to determine which kind of choice to create
	switch (schema.type) {
		case "attribute":
			return createAttributeChoiceConfig(schema);
		case "skill":
			return createSkillChoiceConfig(schema);
		case "profession":
			return createProfessionChoiceConfig(schema);
		case "language":
			return createLanguageChoiceConfig(schema);
		case "spell":
			return createSpellChoiceConfig(schema);
		default:
			throw new Error(`Unknown choice type: ${(schema as any).type}`);
	}
}

/**
 * Creates an AttributeChoiceConfig from a schema
 */
function createAttributeChoiceConfig(
	schema: AttributeChoiceConfigSchema
): AttributeChoiceConfig {
	return {
		type: "attribute",
		count: schema.count,
		increaseBy: schema.increaseBy,
		availableAttributes: schema.availableAttributes,
		selectedAttributes: schema.selectedAttributes,
		defaultAttributes: schema.defaultAttributes,
	};
}

/**
 * Creates a SkillChoiceConfig from a schema
 */
function createSkillChoiceConfig(
	schema: SkillChoiceConfigSchema
): SkillChoiceConfig {
	return {
		type: "skill",
		count: schema.count,
		availableSkills: schema.availableSkills,
		selectedSkills: schema.selectedSkills,
	};
}

/**
 * Creates a ProfessionChoiceConfig from a schema
 */
function createProfessionChoiceConfig(
	schema: ProfessionChoiceConfigSchema
): ProfessionChoiceConfig {
	return {
		type: "profession",
		count: schema.count,
		availableProfessions: schema.availableProfessions,
		selectedProfessions: schema.selectedProfessions,
		defaultProfessions: schema.defaultProfessions,
	};
}

/**
 * Creates a LanguageChoiceConfig from a schema
 */
function createLanguageChoiceConfig(
	schema: LanguageChoiceConfigSchema
): LanguageChoiceConfig {
	return {
		type: "language",
		count: schema.count,
		availableLanguages: schema.availableLanguages,
		selectedLanguages: schema.selectedLanguages,
		canReadExisting: schema.canReadExisting,
		canLearnNew: schema.canLearnNew,
		writingPreferences: schema.writingPreferences,
	};
}

/**
 * Creates a SpellChoice from a schema
 */
function createSpellChoiceConfig(schema: SpellChoiceConfigSchema): SpellChoice {
	return {
		type: "spell",
		count: schema.count,
		choices: schema.choices,
		specificSpells: schema.specificSpells,
		selectedChoices: schema.selectedChoices,
	};
}
