import { Path } from "./Path";
import { attributes, mainAttributes, secondaryAttributes } from "../types";
import { Character } from "../characters";
import { AttributeModifier } from "./AttributeModifier";

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

	applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void {
		if (character.level >= 1) {
			this.applyModifier(mainAttributes, secondaryAttributes, this.l1Mod);
		}
		if (character.level >= 2) {
			this.applyModifier(mainAttributes, secondaryAttributes, this.l2Mod);
		}
		if (character.level >= 5) {
			this.applyModifier(mainAttributes, secondaryAttributes, this.l5Mod);
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
