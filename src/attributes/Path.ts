import { mainAttributes, secondaryAttributes } from "../types";
import { Character } from "../characters/Character";
import { ConfiguredChoiceBuilder, ChoiceConfig } from '../choices/ConfiguredChoice';
import { AttributeModifier } from "../attributes/AttributeModifier";

export abstract class Path {
	protected levelChoices: Map<number, ChoiceConfig[]> = new Map();
	protected levelModifiers: AttributeModifier[];

	constructor(...modifiers: AttributeModifier[]) {
		this.levelModifiers = modifiers;
	}

	public addChoice(level: number, choiceBuilder: ConfiguredChoiceBuilder) {
		const choices = this.levelChoices.get(level) || [];
		choices.push(choiceBuilder.build());
		this.levelChoices.set(level, choices);
	}

	public getChoicesForLevel(level: number): ChoiceConfig[] {
		const modifier = this.getModifier(level);
		if (!modifier || !modifier.choices) return [];
		return modifier.choices.map(builder => builder.build());
	}

	getModifier(level: number): AttributeModifier | null {
		if (level < 0) {
			throw new Error(`Invalid level ${level} for path modifiers`);
		}
		return this.levelModifiers[level - 1] || null;
	}

	abstract applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void;
}
