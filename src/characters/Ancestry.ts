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

	constructor(
		attributes: mainAttributes,
		rules: attributeCalculationRules,
		modifier: AttributeModifier
	) {
		this.mainAttributes = attributes;
		this.secondaryAttributeRules = rules;
		this.ancestryModifier = modifier;
	}

	/**
	 * Gets available choices for ancestry
	 */
	getChoices(): ChoiceConfig | ChoiceConfig[] | undefined {
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
		this.applyModifier(
			mainAttributes,
			secondaryAttributes,
			this.ancestryModifier
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
