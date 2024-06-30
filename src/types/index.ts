export type characterConfig = {
	name: string;
};

export interface Skill {
	name: string;
	description: string;
}

export interface mainAttributes {
	strength: number;
	agility: number;
	intellect: number;
	will: number;
}

export interface secondaryAttributes {
	perception: number;
	defense: number;
	health: number;
	healingRate: number;
	size: number;
	speed: number;
	power: number;
	damage: number;
	insanity: number;
	corruption: number;
	languages: string[];
	professions: string[];
	skills: Skill[];
}

export interface attributes extends mainAttributes, secondaryAttributes {}

export type attributeCalculationRules = {
	[key in keyof secondaryAttributes]: (
		mainAttrs: mainAttributes,
		level: number,
		secondaryAttrs: secondaryAttributes
	) => any;
};
