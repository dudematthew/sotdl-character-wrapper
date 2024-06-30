import {
	characterConfig,
	mainAttributes,
	secondaryAttributes,
	attributes,
} from "../types";
import { Ancestry } from "./Ancestry";
import { Novice } from "../attributes/Novice";
import { Expert } from "../attributes/Expert";
import { Master } from "../attributes/Master";
import { Path } from "../attributes/Path";

export class Character {
	public name: string;
	public level: number = 0;
	public ancestry: Ancestry;
	public novicePath: Novice | null = null;
	public expertPath: Expert | null = null;
	public masterPath: Master | null = null;

	constructor(config: characterConfig, ancestry: Ancestry) {
		this.name = config.name;
		this.ancestry = ancestry;
	}

	get attributes(): attributes {
		let mainAttributes = { ...this.ancestry.mainAttributes };
		let secondaryAttributes =
			this.calculateSecondaryAttributes(mainAttributes);

		if (this.novicePath) {
			this.novicePath.applyModifiers(
				this,
				mainAttributes,
				secondaryAttributes
			);
		}

		if (this.expertPath) {
			this.expertPath.applyModifiers(
				this,
				mainAttributes,
				secondaryAttributes
			);
		}

		this.ancestry.applyModifiers(this, mainAttributes, secondaryAttributes);

		if (this.masterPath) {
			this.masterPath.applyModifiers(
				this,
				mainAttributes,
				secondaryAttributes
			);
		}

		// Recalculate healing rate after all modifiers have been applied
		secondaryAttributes.healingRate =
			this.ancestry.secondaryAttributeRules.healingRate(
				mainAttributes,
				this.level,
				secondaryAttributes
			);

		return { ...mainAttributes, ...secondaryAttributes };
	}

	calculateSecondaryAttributes(
		mainAttrs: mainAttributes
	): secondaryAttributes {
		const rules = this.ancestry.secondaryAttributeRules;
		let secondaryAttrs: secondaryAttributes = {
			perception: 0,
			defense: 0,
			health: 0,
			healingRate: 0,
			size: 0,
			speed: 0,
			power: 0,
			damage: 0,
			insanity: 0,
			corruption: 0,
			languages: [],
			professions: [],
			skills: [],
		};

		// Calculate health first
		secondaryAttrs.health = rules.health(
			mainAttrs,
			this.level,
			secondaryAttrs
		);

		// Calculate other attributes
		for (const key in rules) {
			if (key !== "health" && key !== "healingRate") {
				const rule = rules[key as keyof secondaryAttributes];
				if (
					key === "languages" ||
					key === "professions" ||
					key === "skills"
				) {
					(
						secondaryAttrs[
							key as keyof secondaryAttributes
						] as any[]
					).push(
						...(rule(
							mainAttrs,
							this.level,
							secondaryAttrs
						) as any[])
					);
				} else {
					(secondaryAttrs[
						key as keyof secondaryAttributes
					] as number) = rule(
						mainAttrs,
						this.level,
						secondaryAttrs
					) as number;
				}
			}
		}

		// Calculate healing rate after all other attributes are set
		secondaryAttrs.healingRate = rules.healingRate(
			mainAttrs,
			this.level,
			secondaryAttrs
		);

		return secondaryAttrs;
	}

	setPath(path: Path) {
		if (path instanceof Novice) {
			this.novicePath = path;
		} else if (path instanceof Expert) {
			this.expertPath = path;
		} else if (path instanceof Master) {
			this.masterPath = path;
		}
	}

	levelUp() {
		this.level++;
	}
}
