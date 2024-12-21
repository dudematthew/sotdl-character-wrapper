import { Spell, SpellTradition } from "../types/spell";

// Core traditions that come with the base game
export const CORE_TRADITIONS: SpellTradition[] = [
	{
		id: "magician",
		name: "Magician",
		description: "Special spells available only to magicians",
		primaryAttribute: "intellect",
	},
];

// Core spells that come with the base game
export const CORE_SPELLS: Spell[] = [
	{
		id: "senseMagic",
		name: "Sense Magic",
		tradition: "magician",
		type: "utility",
		rank: 0,
		range: "self",
		area: "A sphere with a 5-yard radius centered on a point within your space",
		duration: "instant",
		effect: "You know if there are any ongoing magical effects in the area and from what points they originate.",
		book: "Core Rulebook",
		page: 125,
	},
];
