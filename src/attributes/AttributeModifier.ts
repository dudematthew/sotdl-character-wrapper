import { ChoiceConfig, attributes, mainAttributes, Skill } from "../types";

/**
 * Represents modifications that can be applied to a character's attributes
 * Used for ancestry bonuses, path benefits, and other character modifications
 */
export class AttributeModifier {
	// Core attributes that can be modified
	public strength?: number;
	public agility?: number;
	public intellect?: number;
	public will?: number;

	// Secondary attributes that can be modified
	public perception?: number;
	public defense?: number;
	public health?: number;
	public healingRate?: number;
	public size?: number;
	public speed?: number;
	public power?: number;
	public damage?: number;
	public insanity?: number;
	public corruption?: number;

	// Character capabilities that can be modified
	public languages?: string[];
	public professions?: string[];
	public skills?: Skill[];
	public choiceConfig?: ChoiceConfig;

	/**
	 * Creates a new modifier with the specified attribute changes and optional choices
	 */
	constructor(modifiers: Partial<attributes>, choiceConfig?: ChoiceConfig) {
		Object.assign(this, modifiers);
		if (choiceConfig) {
			this.choiceConfig = choiceConfig;
		}
	}

	/**
	 * Gets the choice configuration for this modifier
	 */
	getChoiceConfig(): ChoiceConfig | undefined {
		return this.choiceConfig;
	}
}
