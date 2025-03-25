import { Path } from "./Path";
import {
	attributes,
	mainAttributes,
	secondaryAttributes,
	ChoiceConfig,
} from "../types";
import { Character } from "../character/Character";
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
	getChoices(
		level: number
	): { level: number; config: ChoiceConfig | ChoiceConfig[] }[] {
		const choices: {
			level: number;
			config: ChoiceConfig | ChoiceConfig[];
		}[] = [];

		if (level >= 7) {
			const config = this.l7Mod.getChoiceConfig();
			if (config) {
				choices.push({ level: 7, config });
			}
		}

		if (level >= 10) {
			const config = this.l10Mod.getChoiceConfig();
			if (config) {
				choices.push({ level: 10, config });
			}
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
				key !== "choiceConfig"
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
