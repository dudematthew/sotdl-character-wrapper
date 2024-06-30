import { mainAttributes, secondaryAttributes } from "../types";
import { Character } from "../characters/Character";

export abstract class Path {
	abstract applyModifiers(
		character: Character,
		mainAttributes: mainAttributes,
		secondaryAttributes: secondaryAttributes
	): void;
}
