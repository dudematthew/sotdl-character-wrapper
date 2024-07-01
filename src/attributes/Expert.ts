import { Path } from "./Path";
import { attributes, mainAttributes, secondaryAttributes } from "../types";
import { Character } from "../characters";
import { AttributeModifier } from "./AttributeModifier";

export class Expert extends Path {
	l3Mod: AttributeModifier;
	l6Mod: AttributeModifier;
	l9Mod: AttributeModifier;

	constructor(
		l3Mod: AttributeModifier,
		l6Mod: AttributeModifier,
		l9Mod: AttributeModifier
	) {
		super();
		this.l3Mod = l3Mod;
		this.l6Mod = l6Mod;
		this.l9Mod = l9Mod;
	}

	applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void {
		if (character.level >= 3) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l3Mod,
				character
			);
		}
		if (character.level >= 6) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l6Mod,
				character
			);
		}
		if (character.level >= 9) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l9Mod,
				character
			);
		}
	}

	private applyModifier(
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes,
		modifier: AttributeModifier,
		character: Character
	) {
		for (const key in modifier) {
			if (
				modifier[key as keyof attributes] !== undefined &&
				key !== "choices"
			) {
				const attributeKey = key as keyof attributes;
				if (attributeKey in mainAttributes) {
					(mainAttributes[
						attributeKey as keyof mainAttributes
					] as number) += modifier[attributeKey] as number;
				} else if (attributeKey in secondaryAttributes) {
					if (
						key === "languages" ||
						key === "professions" ||
						key === "skills"
					) {
						(
							secondaryAttributes[
								attributeKey as keyof secondaryAttributes
							] as any[]
						).push(...(modifier[attributeKey] as any[]));
					} else {
						(secondaryAttributes[
							attributeKey as keyof secondaryAttributes
						] as number) += modifier[attributeKey] as number;
					}
				}
			}
		}

		// Apply attribute choices if present
		if (modifier.choices) {
			modifier.applyChoices(
				mainAttributes,
				character.getChoicesForLevel(character.level)
			);
		}
	}
}
