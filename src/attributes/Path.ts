import { mainAttributes, secondaryAttributes, ChoiceConfig } from "../types";
import { Character } from "../characters/Character";

/**
 * Base class for character paths (Novice, Expert, Master)
 * Defines how path benefits are applied to characters
 */
export abstract class Path {
	abstract applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void;

	/**
	 * Gets available choices for the current level
	 */
	abstract getChoices(
		level: number
	): { level: number; config: ChoiceConfig | ChoiceConfig[] }[];
}
