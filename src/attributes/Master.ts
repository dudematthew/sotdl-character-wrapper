import { Path } from "./Path";
import {
	attributes,
	mainAttributes,
	secondaryAttributes,
	ChoiceConfig,
} from "../types";
import { Character } from "../characters/Character";
import { AttributeModifier } from "./AttributeModifier";

/**
 * Represents a Master path that a character can take
 * Provides powerful benefits at levels 7 and 10
 */
export class Master extends Path {
	l7Mod: AttributeModifier;
	l10Mod: AttributeModifier;

	/**
	 * Creates a Master path with level 7 and 10 modifiers
	 */
	constructor(l7Mod: AttributeModifier, l10Mod: AttributeModifier) {
		super();
		this.l7Mod = l7Mod;
		this.l10Mod = l10Mod;
	}

	/**
	 * Gets available choices for the current level
	 */
	getChoices(level: number): { level: number; config: ChoiceConfig }[] {
		const choices: { level: number; config: ChoiceConfig }[] = [];

		if (level >= 7 && this.l7Mod.attributeChoices) {
			choices.push({
				level: 7,
				config: {
					type: "attribute",
					count: this.l7Mod.attributeChoices.count,
					increaseBy: this.l7Mod.attributeChoices.increaseBy,
					availableAttributes:
						this.l7Mod.attributeChoices.defaultAttributes,
				},
			});
		}

		if (level >= 10 && this.l10Mod.attributeChoices) {
			choices.push({
				level: 10,
				config: {
					type: "attribute",
					count: this.l10Mod.attributeChoices.count,
					increaseBy: this.l10Mod.attributeChoices.increaseBy,
					availableAttributes:
						this.l10Mod.attributeChoices.defaultAttributes,
				},
			});
		}

		return choices;
	}

	/**
	 * Applies Master path modifiers based on character level
	 * Handles high-level attribute changes and abilities
	 */
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

	/**
	 * Internal helper to apply a specific level's modifications
	 * Handles both attribute increases and special abilities
	 */
	private applyModifier(
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes,
		modifier: AttributeModifier,
		character: Character
	) {
		for (const key in modifier) {
			if (
				modifier[key as keyof attributes] !== undefined &&
				key !== "attributeChoices"
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
	}
}
