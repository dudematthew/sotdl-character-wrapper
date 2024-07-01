import { Path } from "./Path";
import { attributes, mainAttributes, secondaryAttributes } from "../types";
import { Character } from "../characters/Character";
import { AttributeModifier } from "./AttributeModifier";

export class Master extends Path {
	l7Mod: AttributeModifier;
	l10Mod: AttributeModifier;

	constructor(l7Mod: AttributeModifier, l10Mod: AttributeModifier) {
		super();
		this.l7Mod = l7Mod;
		this.l10Mod = l10Mod;
	}

	applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void {
		if (character.level >= 7) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l7Mod,
				character
			);
		}
		if (character.level >= 10) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l10Mod,
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
