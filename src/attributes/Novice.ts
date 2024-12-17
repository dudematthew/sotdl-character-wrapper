import { Path } from "./Path";
import {
	attributes,
	mainAttributes,
	secondaryAttributes,
	ChoiceConfig,
} from "../types";
import { Character } from "../characters";
import { AttributeModifier } from "./AttributeModifier";

/**
 * Represents a Novice path that a character can take
 * Provides initial benefits at levels 1, 2, 5, and 8
 */
export class Novice extends Path {
	l1Mod: AttributeModifier;
	l2Mod: AttributeModifier;
	l5Mod: AttributeModifier;
	l8Mod: AttributeModifier;

	constructor(
		l1Mod: AttributeModifier,
		l2Mod: AttributeModifier,
		l5Mod: AttributeModifier,
		l8Mod: AttributeModifier
	) {
		super();
		this.l1Mod = l1Mod;
		this.l2Mod = l2Mod;
		this.l5Mod = l5Mod;
		this.l8Mod = l8Mod;
	}

	/**
	 * Gets available choices for the current level
	 */
	getChoices(level: number): { level: number; config: ChoiceConfig }[] {
		const choices: { level: number; config: ChoiceConfig }[] = [];

		if (level >= 1 && this.l1Mod.attributeChoices) {
			choices.push({
				level: 1,
				config: {
					type: "attribute",
					count: this.l1Mod.attributeChoices.count,
					increaseBy: this.l1Mod.attributeChoices.increaseBy,
					availableAttributes:
						this.l1Mod.attributeChoices.defaultAttributes,
				},
			});
		}

		if (level >= 2 && this.l2Mod.attributeChoices) {
			choices.push({
				level: 2,
				config: {
					type: "attribute",
					count: this.l2Mod.attributeChoices.count,
					increaseBy: this.l2Mod.attributeChoices.increaseBy,
					availableAttributes:
						this.l2Mod.attributeChoices.defaultAttributes,
				},
			});
		}

		if (level >= 5 && this.l5Mod.attributeChoices) {
			choices.push({
				level: 5,
				config: {
					type: "attribute",
					count: this.l5Mod.attributeChoices.count,
					increaseBy: this.l5Mod.attributeChoices.increaseBy,
					availableAttributes:
						this.l5Mod.attributeChoices.defaultAttributes,
				},
			});
		}

		if (level >= 8 && this.l8Mod.attributeChoices) {
			choices.push({
				level: 8,
				config: {
					type: "attribute",
					count: this.l8Mod.attributeChoices.count,
					increaseBy: this.l8Mod.attributeChoices.increaseBy,
					availableAttributes:
						this.l8Mod.attributeChoices.defaultAttributes,
				},
			});
		}

		return choices;
	}

	/**
	 * Applies Novice path modifiers based on character level
	 * Handles early-game attribute changes and abilities
	 */
	applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void {
		if (character.level >= 1) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l1Mod,
				character
			);
		}
		if (character.level >= 2) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l2Mod,
				character
			);
		}
		if (character.level >= 5) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l5Mod,
				character
			);
		}
		if (character.level >= 8) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.l8Mod,
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
