import { AttributeModifier } from "../../attributes";
import { Ancestry } from "../../characters";

const humanAncestry = new Ancestry(
	// main attributes
	{ strength: 10, agility: 10, intellect: 10, will: 10 },
	// secondary attributes
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
		professions: () => ["Warrior"],
		skills: () => [],
	},
	// level 4 modifier
	new AttributeModifier({
		health: 5,
		skills: [
			{
				name: "Determined",
				description:
					"When you roll a 1 ons the die from a boon, you can reroll the die and choose to use the new number.",
			},
		],
	})
);

export default humanAncestry;
