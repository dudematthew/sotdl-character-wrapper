import { AttributeChoice, attributes, mainAttributes, Skill } from "../types";

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
	public attributeChoices?: AttributeChoice;

	/**
	 * Creates a new modifier with the specified attribute changes and optional choices
	 */
	constructor(
		modifiers: Partial<attributes>,
		attributeChoices?: AttributeChoice
	) {
		Object.assign(this, modifiers);
		if (attributeChoices) {
			this.attributeChoices = attributeChoices;
		}
	}

	/**
	 * Applies attribute choices to a character's main attributes
	 * Uses either user-specified choices or default choices if none provided
	 */
	applyAttributeChoices(
		mainAttributes: mainAttributes,
		userAttributeChoices?: (keyof mainAttributes)[]
	): void {
		if (this.attributeChoices) {
			const selectedAttributes =
				userAttributeChoices ||
				this.attributeChoices.defaultAttributes.slice(
					0,
					this.attributeChoices.count
				);
			for (let i = 0; i < this.attributeChoices.count; i++) {
				const attribute =
					selectedAttributes[i % selectedAttributes.length];
				mainAttributes[attribute] += this.attributeChoices.increaseBy;
			}
		}
	}
}
