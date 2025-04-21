import {
	mainAttributes,
	secondaryAttributes,
	attributeCalculationRules,
	ChoiceConfig,
} from "../types";
import { Character } from "./Character";
import { AttributeModifier } from "../attributes/AttributeModifier";

/**
 * Represents a character's ancestry (race/lineage)
 * Defines base attributes and racial bonuses
 */
export class Ancestry {
	mainAttributes: mainAttributes;
	secondaryAttributeRules: attributeCalculationRules;
	ancestryModifier: AttributeModifier;
	initialChoices?: ChoiceConfig | ChoiceConfig[];

	constructor(
		attributes: mainAttributes,
		rules: attributeCalculationRules,
		modifier: AttributeModifier,
		initialChoices?: ChoiceConfig | ChoiceConfig[]
	) {
		this.mainAttributes = attributes;
		this.secondaryAttributeRules = rules;
		this.ancestryModifier = modifier;
		this.initialChoices = initialChoices;
	}

	/**
	 * Gets available choices for ancestry
	 * Returns level 0 choices if character level is 0, otherwise returns level 4 choices
	 */
	getChoices(level?: number): ChoiceConfig | ChoiceConfig[] | undefined {
		// If level is explicitly 0, or no level is provided and initialChoices exists,
		// return the level 0 choices
		if (level === 0 || (level === undefined && this.initialChoices)) {
			return this.initialChoices;
		}

		// Otherwise return the level 4 choices from the ancestry modifier
		return this.ancestryModifier.getChoiceConfig();
	}

	/**
	 * Applies ancestry-specific modifiers to a character
	 * Some modifiers only activate at certain levels
	 */
	applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void {
		console.log(
			`[DEBUG] Ancestry.applyModifiers: Character level = ${character.level}`
		);
		console.log(
			`[DEBUG] Ancestry.applyModifiers: Before modifier: health = ${secondaryAttributes.health}`
		);

		// Only apply ancestry modifiers if character is at or above level 4
		if (character.level >= 4) {
			console.log(
				`[DEBUG] Ancestry.applyModifiers: Applying level 4+ ancestry modifier`
			);
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.ancestryModifier
			);
		} else {
			console.log(
				`[DEBUG] Ancestry.applyModifiers: Character below level 4, skipping ancestry modifier`
			);
		}

		console.log(
			`[DEBUG] Ancestry.applyModifiers: After modifier: health = ${secondaryAttributes.health}`
		);
	}

	/**
	 * Applies a specific modifier to character attributes
	 * Handles both numeric and array-based modifications
	 */
	private applyModifier(
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes,
		modifier: AttributeModifier
	) {
		for (const key in modifier) {
			if (
				modifier[
					key as keyof mainAttributes | keyof secondaryAttributes
				] !== undefined &&
				key !== "choiceConfig"
			) {
				const attributeKey = key as
					| keyof mainAttributes
					| keyof secondaryAttributes;
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
