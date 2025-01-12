export type SpellType = "attack" | "utility";
export type SpellRange =
	| "self"
	| "touch"
	| "short"
	| "medium"
	| "long"
	| "extreme"
	| string;
export type SpellDuration =
	| "instant"
	| "rounds"
	| "minutes"
	| "hours"
	| "days"
	| "permanent"
	| string;

export interface Spell {
	id: string;
	name: string;
	tradition: string;
	type: SpellType;
	rank: number;
	requirement?: string;
	target?: string;
	area?: string;
	range: SpellRange;
	duration: SpellDuration;
	durationValue?: number;
	effect: string;
	attackRoll?: {
		target: string;
		additionalEffects?: { [key: string]: string };
	};
	challengeRoll?: {
		attribute: string;
		effect: string;
	};
	triggered?: {
		condition: string;
	};
	sacrifice?: boolean;
	permanence?: string;
	book: string;
	page: number;
}

export interface SpellTradition {
	id: string;
	name: string;
	description: string;
	isDark?: boolean;
	primaryAttribute?: "strength" | "agility" | "intellect" | "will";
}

export type SpellChoiceOption =
	| {
			type: "learnSpell";
			spellId: string;
	  }
	| {
			type: "discoverTradition";
			traditionId: string;
	  };

export interface SpellChoiceType {
	type: "discoverTradition" | "learnSpell" | "flexibleChoice";
	restrictToTraditions?: string[];
	description?: string;
	defaultChoice?: string;
}

export interface SpellChoice {
	type: "spell";
	count: number;
	choices: SpellChoiceType[];
	specificSpells?: string[];
	selectedChoices?: SpellChoiceOption[];
}

export interface SpellcastingAbility {
	traditions: string[];
	maxPowerLevel: number;
	knownSpells: string[];
}

export interface LanguageChoice {
	type: "language";
	count: number;
	canReadExisting: boolean;
	canLearnNew: boolean;
	selectedChoice?: "read" | "learn";
	selectedLanguage?: string;
}
