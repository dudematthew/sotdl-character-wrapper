import { mainAttributes, Skill } from "../types";
import { SpellChoiceConfigSchema } from "./spellChoiceConfigSchema";

/**
 * Serialized choice configuration
 */
export type ChoiceConfigSchema =
	| AttributeChoiceConfigSchema
	| SkillChoiceConfigSchema
	| ProfessionChoiceConfigSchema
	| SpellChoiceConfigSchema
	| LanguageChoiceConfigSchema;

/**
 * Serialized configuration for attribute choices
 */
export type AttributeChoiceConfigSchema = {
	type: "attribute";
	count: number;
	increaseBy: number;
	availableAttributes?: (keyof mainAttributes)[];
	selectedAttributes?: (keyof mainAttributes)[];
	defaultAttributes?: (keyof mainAttributes)[];
};

/**
 * Serialized configuration for skill choices
 */
export type SkillChoiceConfigSchema = {
	type: "skill";
	count: number;
	availableSkills: Skill[];
	selectedSkills?: Skill[];
};

/**
 * Serialized configuration for profession choices
 */
export type ProfessionChoiceConfigSchema = {
	type: "profession";
	count: number;
	availableProfessions: string[];
	selectedProfessions?: string[];
	defaultProfessions?: string[];
};

/**
 * Serialized configuration for language choices
 */
export type LanguageChoiceConfigSchema = {
	type: "language";
	count: number;
	selectedLanguages?: string[];
	availableLanguages?: string[];
	canReadExisting: boolean;
	canLearnNew: boolean;
	writingPreferences?: { [language: string]: boolean };
};
