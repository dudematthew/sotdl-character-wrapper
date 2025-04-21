import { AttributeModifier } from "../attributes";
import { Ancestry } from "../character";
import { attributeCalculationRules, mainAttributes } from "../types";

export function createAncestryFromSchema(): Ancestry {
	const baseAttributes: mainAttributes = {
		strength: 10,
		agility: 10,
		intellect: 10,
		will: 10,
	};

	const secondaryAttrs: attributeCalculationRules = {
		perception: (mainAttributes) => mainAttributes.intellect,
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
	};

	// Level 4 ancestry benefits
	const levelBenefits = new AttributeModifier(
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
	);

	return new Ancestry(baseAttributes, secondaryAttrs, levelBenefits);
}
