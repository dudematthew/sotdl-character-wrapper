import { AttributeModifier } from "../../attributes";
import { Ancestry } from "../../characters";

/**
 * Defines the Human ancestry
 * Represents balanced starting attributes with versatile capabilities
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
			skills: [
				{
					name: "Determined",
					description:
						"You gain 1 Fortune point at the start of each session.",
				},
			],
		},
		{
			type: "skill",
			count: 1,
			availableSkills: [
				{
					name: "Determined",
					description:
						"You gain 1 Fortune point at the start of each session.",
				},
			],
		}
	)
);

export default humanAncestry;
