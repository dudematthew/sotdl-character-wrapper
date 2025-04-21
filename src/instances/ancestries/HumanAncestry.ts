import { AttributeModifier } from "../../attributes";
import { Ancestry } from "../../character";
import { SpellChoice } from "../../types/spell";

/**
 * Defines the Human ancestry
 * Represents balanced starting attributes with versatile capabilities
 *
 * From the corebook:
 * - Standard attribute scores: Strength 10, Agility 10, Intellect 10, Will 10
 * - Increase one attribute by 1
 * - Language: Common Tongue
 * - Level 4: +5 Health, and choice of spell tradition discovery, learning a spell, or the Determined talent
 */
const humanAncestry = new Ancestry(
	// Base attributes for humans
	{ strength: 10, agility: 10, intellect: 10, will: 10 },
	// Rules for calculating secondary attributes
	{
		perception: (mainAttrs) => mainAttrs.intellect,
		defense: (mainAttrs) => mainAttrs.agility,
		health: (mainAttrs) => mainAttrs.strength,
		healingRate: (mainAttrs, level, secondaryAttrs) =>
			Math.floor(secondaryAttrs.health / 4),
		size: () => 1,
		speed: () => 10,
		power: () => 0,
		damage: () => 0,
		insanity: () => 0,
		corruption: () => 0,
		languages: () => ["Common"],
		professions: () => [],
		skills: () => [],
	},
	// Level 4 ancestry benefits
	new AttributeModifier(
		{
			health: 5,
		},
		[
			// Level 4 choice: Determined talent or spell-related options
			{
				type: "skill",
				count: 1,
				availableSkills: [
					{
						name: "Determined",
						description:
							"When you roll a 1 on the die from a boon, you can reroll the die and use the new number.",
					},
				],
			},
			// Spell choice option - discover tradition or learn spell
			{
				type: "spell",
				count: 1,
				choices: [
					{
						type: "flexibleChoice",
						description:
							"Choose to either discover a new tradition or learn a spell from a tradition you already know.",
					},
				],
				specificSpells: [],
			} as SpellChoice,
		]
	),
	// Initial choices (available at character creation)
	[
		// Initial attribute choice
		{
			type: "attribute",
			count: 1,
			increaseBy: 1,
			availableAttributes: ["strength", "agility", "intellect", "will"],
			defaultAttributes: ["strength"],
		},
		// Initial profession choice
		{
			type: "profession",
			count: 1,
			availableProfessions: [
				"Academic",
				"Artisan",
				"Criminal",
				"Commoner",
				"Wilderness",
				"Religious",
				"Military",
			],
			defaultProfessions: ["Commoner"],
		},
	]
);

export default humanAncestry;
