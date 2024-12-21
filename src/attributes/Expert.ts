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
 * Represents an Expert path that a character can take
 * Provides benefits at levels 3, 6, and 9
 */
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

		if (level >= 3) {
			const config = this.l3Mod.getChoiceConfig();
			if (config) {
				choices.push({ level: 3, config });
			}
		}

		if (level >= 6) {
			const config = this.l6Mod.getChoiceConfig();
			if (config) {
				choices.push({ level: 6, config });
			}
		}

		if (level >= 9) {
			const config = this.l9Mod.getChoiceConfig();
			if (config) {
				choices.push({ level: 9, config });
			}
		}

		return choices;
	}

	/**
	 * Applies Expert path modifiers based on character level
	 * Handles attribute changes and special abilities
	 */
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
