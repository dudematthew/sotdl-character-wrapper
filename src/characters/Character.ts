import {
	characterConfig,
	mainAttributes,
	secondaryAttributes,
	attributes,
	ChoiceConfig,
	ChoiceLocation,
	AttributeChoiceConfig,
} from "../types";
import { Ancestry } from "./Ancestry";
import { Novice } from "../attributes/Novice";
import { Expert } from "../attributes/Expert";
import { Master } from "../attributes/Master";
import { Path } from "../attributes/Path";

/**
 * Represents a playable character in the game
 * Manages character progression, attributes, and paths
 */
export class Character {
	public name: string;
	public level: number = 0;
	public ancestry: Ancestry;
	public novicePath: Novice | null = null;
	public expertPath: Expert | null = null;
	public masterPath: Master | null = null;
	private choicesByLocation: Map<string, ChoiceConfig> = new Map();

	constructor(config: characterConfig, ancestry: Ancestry) {
		this.name = config.name;
		this.ancestry = ancestry;
	}

	/**
	 * Gets all available choices for the character
	 */
	getAvailableChoices(): {
		location: ChoiceLocation;
		config: ChoiceConfig;
	}[] {
		const choices: { location: ChoiceLocation; config: ChoiceConfig }[] =
			[];

		// Get ancestry choices
		if (this.ancestry && this.level >= 4) {
			const ancestryChoices = this.ancestry.getChoices();
			if (ancestryChoices) {
				choices.push({
					location: { source: "ancestry", level: 4 },
					config: ancestryChoices,
				});
			}
		}

		// Get path choices
		if (this.novicePath) {
			const noviceChoices = this.novicePath.getChoices(this.level);
			choices.push(
				...noviceChoices.map((choice) => ({
					location: {
						source: "novicePath" as const,
						level: choice.level,
					},
					config: choice.config,
				}))
			);
		}

		if (this.expertPath) {
			const expertChoices = this.expertPath.getChoices(this.level);
			choices.push(
				...expertChoices.map((choice) => ({
					location: {
						source: "expertPath" as const,
						level: choice.level,
					},
					config: choice.config,
				}))
			);
		}

		if (this.masterPath) {
			const masterChoices = this.masterPath.getChoices(this.level);
			choices.push(
				...masterChoices.map((choice) => ({
					location: {
						source: "masterPath" as const,
						level: choice.level,
					},
					config: choice.config,
				}))
			);
		}

		return choices;
	}

	/**
	 * Sets a choice for a specific location
	 */
	setChoice(location: ChoiceLocation, selection: Partial<ChoiceConfig>) {
		const key = `${location.source}-${location.level}`;
		const currentChoice = this.choicesByLocation.get(key);

		if (currentChoice) {
			const updatedChoice = { ...currentChoice };
			if (selection.type === currentChoice.type) {
				Object.assign(updatedChoice, selection);
				this.choicesByLocation.set(key, updatedChoice);
			}
		} else {
			// If no choice exists yet, create a new one
			this.choicesByLocation.set(key, selection as ChoiceConfig);
		}
	}

	/**
	 * Gets the current selection for a specific choice
	 */
	getChoice(location: ChoiceLocation): ChoiceConfig | undefined {
		return this.choicesByLocation.get(
			`${location.source}-${location.level}`
		);
	}

	/**
	 * Calculates and returns the character's current attributes
	 * Includes base attributes plus all applicable modifiers
	 */
	get attributes(): attributes {
		let mainAttributes = { ...this.ancestry.mainAttributes };
		let secondaryAttributes =
			this.calculateSecondaryAttributes(mainAttributes);

		// Apply ancestry modifiers first
		if (this.level >= 4) {
			this.ancestry.applyModifiers(
				this,
				mainAttributes,
				secondaryAttributes
			);
		}

		// Then apply path modifiers
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
		if (this.masterPath) {
			this.masterPath.applyModifiers(
				this,
				mainAttributes,
				secondaryAttributes
			);
		}

		// Apply choices
		Array.from(this.choicesByLocation.values()).forEach((choice) => {
			if (choice.type === "attribute" && choice.selectedAttributes) {
				for (const attr of choice.selectedAttributes) {
					mainAttributes[attr] += choice.increaseBy;
				}
			}
		});

		// Recalculate healing rate after all modifiers have been applied
		secondaryAttributes.healingRate =
			this.ancestry.secondaryAttributeRules.healingRate(
				mainAttributes,
				this.level,
				secondaryAttributes
			);

		return { ...mainAttributes, ...secondaryAttributes };
	}

	/**
	 * Calculates secondary attributes based on main attributes
	 * Handles derived stats like health, defense, etc.
	 */
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

	/**
	 * Assigns a path (Novice, Expert, or Master) to the character
	 */
	setPath(path: Path) {
		if (path instanceof Novice) {
			this.novicePath = path;
		} else if (path instanceof Expert) {
			this.expertPath = path;
		} else if (path instanceof Master) {
			this.masterPath = path;
		}
	}

	/**
	 * Increases character level by 1
	 */
	levelUp() {
		this.level++;
	}

	// Legacy methods for backward compatibility
	/**
	 * @deprecated Use setChoice instead
	 */
	setChoicesForLevel(level: number, choices: (keyof mainAttributes)[]) {
		this.setChoice({ source: "novicePath", level }, {
			type: "attribute",
			count: choices.length,
			increaseBy: 1,
			availableAttributes: ["strength", "agility", "intellect", "will"],
			selectedAttributes: choices,
		} as AttributeChoiceConfig);
	}

	/**
	 * @deprecated Use getChoice instead
	 */
	getChoicesForLevel(level: number): (keyof mainAttributes)[] {
		const choice = this.getChoice({ source: "novicePath", level });
		if (choice && choice.type === "attribute") {
			return choice.selectedAttributes || [];
		}
		return [];
	}
}
