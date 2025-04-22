/**
 * Represents a serialized spell choice configuration in JSON format
 * Designed to be converted back to functional code via function factories
 */
export type SpellChoiceConfigSchema = {
	type: "spell";
	count: number;
	choices: SpellChoiceTypeSchema[];
	specificSpells?: string[];
	selectedChoices?: SpellChoiceOptionSchema[];
};

/**
 * Schema for representing spell choice types in JSON
 */
export type SpellChoiceTypeSchema = {
	type: "discoverTradition" | "learnSpell" | "flexibleChoice";
	restrictToTraditions?: string[];
	description?: string;
	defaultChoice?: string;
};

/**
 * Schema for representing selected spell choice options in JSON
 */
export type SpellChoiceOptionSchema =
	| {
			type: "learnSpell";
			spellId: string;
	  }
	| {
			type: "discoverTradition";
			traditionId: string;
	  };
