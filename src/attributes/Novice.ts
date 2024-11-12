import { Path } from "./Path";
import { attributes, mainAttributes, secondaryAttributes } from "../types";
import { Character } from "../characters";
import { AttributeModifier } from "./AttributeModifier";
import { ConfiguredChoiceBuilder } from "../choices/ConfiguredChoice";

export class Novice extends Path {
	l1Mod: AttributeModifier;
	l2Mod: AttributeModifier;
	l5Mod: AttributeModifier;
	l8Mod: AttributeModifier;

	constructor(
		l1Mod: AttributeModifier,
		l2Mod: AttributeModifier,
		l5Mod: AttributeModifier,
		l8Mod: AttributeModifier,
		choices?: {level: number, choice: ConfiguredChoiceBuilder}[]
	) {
		super(l1Mod, l2Mod, l5Mod, l8Mod);
		if (choices) {
			choices.forEach(({level, choice}) => {
				this.addChoice(level, choice);
			});
		}
	}

	applyModifiers(
		character: Character,
			mainAttributes: mainAttributes,
			secondaryAttributes: secondaryAttributes
	): void {
		const level = character.level;
		if (level >= 1) {
			const modifier = this.getModifier(1);
			if (modifier) {
				this.applyNumericModifiers(mainAttributes, modifier);
				this.applyNumericSecondaryModifiers(secondaryAttributes, modifier);
				this.applyArrayModifiers(secondaryAttributes, modifier);
			}
		}
		if (level >= 2) {
			const modifier = this.getModifier(2);
			if (modifier) {
				this.applyNumericModifiers(mainAttributes, modifier);
				this.applyNumericSecondaryModifiers(secondaryAttributes, modifier);
				this.applyArrayModifiers(secondaryAttributes, modifier);
			}
		}
		if (level >= 5) {
			const modifier = this.getModifier(5);
			if (modifier) {
				this.applyNumericModifiers(mainAttributes, modifier);
				this.applyNumericSecondaryModifiers(secondaryAttributes, modifier);
				this.applyArrayModifiers(secondaryAttributes, modifier);
			}
		}
		if (level >= 8) {
			const modifier = this.getModifier(8);
			if (modifier) {
				this.applyNumericModifiers(mainAttributes, modifier);
				this.applyNumericSecondaryModifiers(secondaryAttributes, modifier);
				this.applyArrayModifiers(secondaryAttributes, modifier);
			}
		}
	}

	private applyNumericModifiers(
		mainAttributes: mainAttributes,
		modifier: AttributeModifier
	): void {
		for (const key in mainAttributes) {
			const attributeKey = key as keyof mainAttributes;
			if (typeof modifier[attributeKey] === 'number') {
				mainAttributes[attributeKey] += modifier[attributeKey] as number;
			}
		}
	}

	private applyNumericSecondaryModifiers(
		secondaryAttributes: secondaryAttributes,
		modifier: AttributeModifier
	): void {
		// List of numeric secondary attributes
		const numericAttributes = ['defense', 'health', 'healingRate', 'power', 'speed'] as const;
		
		numericAttributes.forEach(key => {
			if (typeof modifier[key] === 'number') {
				secondaryAttributes[key] += modifier[key] as number;
			}
		});
	}

	private applyArrayModifiers(
		secondaryAttributes: secondaryAttributes,
		modifier: AttributeModifier
	): void {
		if (modifier.skills) {
			secondaryAttributes.skills.push(...modifier.skills);
		}
		if (modifier.languages) {
			secondaryAttributes.languages.push(...modifier.languages);
		}
		if (modifier.professions) {
			secondaryAttributes.professions.push(...modifier.professions);
		}
	}
}
