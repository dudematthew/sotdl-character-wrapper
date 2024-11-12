import { ConfiguredChoiceBuilder } from "../choices/ConfiguredChoice";
import { attributes, Skill } from "../types";

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
	public choices?: ConfiguredChoiceBuilder[];

	constructor(modifiers: Partial<attributes & { choices?: ConfiguredChoiceBuilder[] }>) {
		Object.assign(this, modifiers);
	}
}
