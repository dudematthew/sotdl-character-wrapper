import {
	mainAttributes,
	secondaryAttributes,
	attributeCalculationRules,
	attributes,
} from "../types";
import { Character } from "./Character";
import { AttributeModifier } from "../attributes/AttributeModifier";

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

	applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void {
		// this.applyModifier(
		// 	mainAttributes,
		// 	secondaryAttributes,
		// 	this.ancestryModifier
		// );

		if (character.level >= 4) {
			this.applyModifier(
				mainAttributes,
				secondaryAttributes,
				this.ancestryModifier
			);
		}
	}

	private applyModifier(
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes,
		modifier: AttributeModifier
	) {
		for (const key in modifier) {
			if (modifier[key as keyof attributes] !== undefined) {
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
