import { AttributeChoice, attributes, mainAttributes, Skill } from "../types";

export class AttributeModifier {
	public strength?: number;
	public agility?: number;
	public intellect?: number;
	public will?: number;
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
	public languages?: string[];
	public professions?: string[];
	public skills?: Skill[];
	public choices?: AttributeChoice;

	constructor(modifiers: Partial<attributes>, choices?: AttributeChoice) {
		Object.assign(this, modifiers);
		if (choices) {
			this.choices = choices;
		}
	}

	applyChoices(
		mainAttributes: mainAttributes,
		userChoices?: (keyof mainAttributes)[]
	): void {
		if (this.choices) {
			const chosenAttributes =
				userChoices ||
				this.choices.defaultAttributes.slice(0, this.choices.count);
			for (let i = 0; i < this.choices.count; i++) {
				const attr = chosenAttributes[i % chosenAttributes.length];
				mainAttributes[attr] += this.choices.increaseBy;
			}
		}
	}
}
