import {
	characterConfig,
	mainAttributes,
	secondaryAttributes,
	attributes,
	ChoiceConfig,
	ChoiceLocation,
	AttributeChoiceConfig,
	LanguageSuggestion,
	LanguageChoiceConfig,
} from "../types";
import { Ancestry } from "./Ancestry";
import { Novice } from "../attributes/Novice";
import { Expert } from "../attributes/Expert";
import { Master } from "../attributes/Master";
import { Path } from "../attributes/Path";

export interface ChoiceValidationConfig {
	validateOnPathChange: boolean;
	validateOnAncestryChange: boolean;
	preserveInvalidChoices: boolean;
}

/**
 * Represents a playable character in the game
 * Manages character progression, attributes, and paths
 */
export class Character {
	public name: string;
	public level: number = 0;
	private _ancestry: Ancestry;
	private _novicePath: Novice | null = null;
	private _expertPath: Expert | null = null;
	private _masterPath: Master | null = null;
	private choicesByLocation: Map<string, ChoiceConfig> = new Map();
	private validationConfig: ChoiceValidationConfig = {
		validateOnPathChange: true,
		validateOnAncestryChange: true,
		preserveInvalidChoices: false,
	};

	constructor(config: characterConfig, ancestry: Ancestry) {
		this.name = config.name;
		this._ancestry = ancestry;
	}

	// Getters and setters for paths and ancestry
	get ancestry(): Ancestry {
		return this._ancestry;
	}

	set ancestry(value: Ancestry) {
		this._ancestry = value;
		if (this.validationConfig.validateOnAncestryChange) {
			this.validateChoicesForSource("ancestry");
		}
	}

	get novicePath(): Novice | null {
		return this._novicePath;
	}

	set novicePath(value: Novice | null) {
		this._novicePath = value;
		if (this.validationConfig.validateOnPathChange) {
			this.validateChoicesForSource("novicePath");
		}
	}

	get expertPath(): Expert | null {
		return this._expertPath;
	}

	set expertPath(value: Expert | null) {
		this._expertPath = value;
		if (this.validationConfig.validateOnPathChange) {
			this.validateChoicesForSource("expertPath");
		}
	}

	get masterPath(): Master | null {
		return this._masterPath;
	}

	set masterPath(value: Master | null) {
		this._masterPath = value;
		if (this.validationConfig.validateOnPathChange) {
			this.validateChoicesForSource("masterPath");
		}
	}

	/**
	 * Configures how choices are validated when paths or ancestry change
	 */
	setValidationConfig(config: Partial<ChoiceValidationConfig>) {
		const oldConfig = this.validationConfig;
		this.validationConfig = { ...this.validationConfig, ...config };

		// If validation was enabled, validate immediately
		if (
			!oldConfig.validateOnPathChange &&
			this.validationConfig.validateOnPathChange
		) {
			this.validateAllChoices();
		}
		if (
			!oldConfig.validateOnAncestryChange &&
			this.validationConfig.validateOnAncestryChange
		) {
			this.validateChoicesForSource("ancestry");
		}
	}

	/**
	 * Validates all choices for all sources
	 */
	private validateAllChoices() {
		this.validateChoicesForSource("ancestry");
		this.validateChoicesForSource("novicePath");
		this.validateChoicesForSource("expertPath");
		this.validateChoicesForSource("masterPath");
	}

	/**
	 * Clears choices for a specific source or all choices if no source specified
	 */
	clearChoices(
		source?: "ancestry" | "novicePath" | "expertPath" | "masterPath"
	) {
		if (source) {
			Array.from(this.choicesByLocation.keys())
				.filter((key) => key.startsWith(source))
				.forEach((key) => this.choicesByLocation.delete(key));
		} else {
			this.choicesByLocation.clear();
		}
	}

	/**
	 * Gets invalid choices that would be removed by validation
	 * Useful for showing warnings to the user before making changes
	 */
	getInvalidChoices(
		source: "ancestry" | "novicePath" | "expertPath" | "masterPath"
	): ChoiceConfig[] {
		const invalidChoices: ChoiceConfig[] = [];
		const choicesToValidate = Array.from(this.choicesByLocation.entries())
			.filter(([key]) => key.startsWith(source))
			.map(([key, value]) => ({ key, value }));

		for (const { key, value } of choicesToValidate) {
			let availableChoices = this.getAvailableChoices();
			let currentChoice = availableChoices.find(
				(c) =>
					`${c.location.source}-${c.location.level}` === key &&
					c.config.type === value.type
			);

			if (!currentChoice) {
				invalidChoices.push(value);
				continue;
			}

			// Check count validation
			if (
				value.type === "attribute" &&
				currentChoice.config.type === "attribute"
			) {
				if (
					value.selectedAttributes &&
					value.selectedAttributes.length > currentChoice.config.count
				) {
					invalidChoices.push(value);
				}
			} else if (
				value.type === "skill" &&
				currentChoice.config.type === "skill"
			) {
				if (
					value.selectedSkills &&
					value.selectedSkills.length > currentChoice.config.count
				) {
					invalidChoices.push(value);
				}
			} else if (
				value.type === "profession" &&
				currentChoice.config.type === "profession"
			) {
				if (
					value.selectedProfessions &&
					value.selectedProfessions.length >
						currentChoice.config.count
				) {
					invalidChoices.push(value);
				}
			} else if (
				value.type === "language" &&
				currentChoice.config.type === "language"
			) {
				if (
					value.selectedLanguages &&
					value.selectedLanguages.length > currentChoice.config.count
				) {
					invalidChoices.push(value);
				}
			}
		}

		return invalidChoices;
	}

	/**
	 * Checks if a choice is valid against current configuration
	 */
	private isChoiceValid(
		choice: ChoiceConfig,
		currentConfig: ChoiceConfig
	): boolean {
		if (choice.type !== currentConfig.type) return false;

		switch (choice.type) {
			case "attribute":
				if (currentConfig.type !== "attribute") return false;
				// All attributes are valid now
				return true;

			case "skill":
				if (currentConfig.type !== "skill") return false;
				return (
					choice.selectedSkills?.every((skill) =>
						currentConfig.availableSkills.some(
							(vs) => vs.name === skill.name
						)
					) ?? false
				);

			case "profession":
				if (currentConfig.type !== "profession") return false;
				return (
					choice.selectedProfessions?.every((prof) =>
						currentConfig.availableProfessions.includes(prof)
					) ?? false
				);

			case "language":
				if (currentConfig.type !== "language") return false;
				// For languages, we only validate that the count is correct
				// The actual language validation happens at choice creation
				return (
					(choice.selectedLanguages?.length ?? 0) <=
					currentConfig.count
				);

			default:
				return false;
		}
	}

	/**
	 * Validates choices for a specific source (ancestry or path)
	 * Removes invalid choices and updates partially valid ones
	 */
	private validateChoicesForSource(
		source: "ancestry" | "novicePath" | "expertPath" | "masterPath"
	) {
		if (this.validationConfig.preserveInvalidChoices) {
			return;
		}

		// Get all choices for this source
		const choicesToValidate = Array.from(this.choicesByLocation.entries())
			.filter(([key]) => key.startsWith(source))
			.map(([key, value]) => ({ key, value }));

		for (const { key, value } of choicesToValidate) {
			let availableChoices = this.getAvailableChoices();
			let currentChoice = availableChoices.find(
				(c) =>
					`${c.location.source}-${c.location.level}` === key &&
					c.config.type === value.type
			);

			if (!currentChoice) {
				// Choice is no longer available, remove it
				this.choicesByLocation.delete(key);
				continue;
			}

			// Validate selected options based on choice type
			if (
				value.type === "attribute" &&
				currentChoice.config.type === "attribute"
			) {
				const selectedAttributes = value.selectedAttributes;
				if (selectedAttributes && selectedAttributes.length > 0) {
					// Update choice with valid number of attributes
					this.choicesByLocation.set(key, {
						...value,
						selectedAttributes: selectedAttributes.slice(
							0,
							currentChoice.config.count
						),
					});
				} else {
					// No valid attributes remain, remove the choice
					this.choicesByLocation.delete(key);
				}
			} else if (
				value.type === "skill" &&
				currentChoice.config.type === "skill"
			) {
				const validSkills = currentChoice.config.availableSkills;
				const selectedSkills = value.selectedSkills?.filter((skill) =>
					validSkills.some((vs) => vs.name === skill.name)
				);

				if (selectedSkills && selectedSkills.length > 0) {
					// Update choice with only valid skills
					this.choicesByLocation.set(key, {
						...value,
						selectedSkills: selectedSkills.slice(
							0,
							currentChoice.config.count
						),
					});
				} else {
					// No valid skills remain, remove the choice
					this.choicesByLocation.delete(key);
				}
			} else if (
				value.type === "profession" &&
				currentChoice.config.type === "profession"
			) {
				const validProfessions =
					currentChoice.config.availableProfessions;
				const selectedProfessions = value.selectedProfessions?.filter(
					(prof) => validProfessions.includes(prof)
				);

				if (selectedProfessions && selectedProfessions.length > 0) {
					// Update choice with only valid professions
					this.choicesByLocation.set(key, {
						...value,
						selectedProfessions: selectedProfessions.slice(
							0,
							currentChoice.config.count
						),
					});
				} else {
					// No valid professions remain, remove the choice
					this.choicesByLocation.delete(key);
				}
			} else if (
				value.type === "language" &&
				currentChoice.config.type === "language"
			) {
				const selectedLanguages = value.selectedLanguages;

				if (selectedLanguages && selectedLanguages.length > 0) {
					// Update choice with only valid languages
					this.choicesByLocation.set(key, {
						...value,
						selectedLanguages: selectedLanguages.slice(
							0,
							currentChoice.config.count
						),
					});
				} else {
					// No valid languages remain, remove the choice
					this.choicesByLocation.delete(key);
				}
			}
		}
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
		if (this.ancestry) {
			// Level 0 choices are always available regardless of character level
			const initialChoices = this.ancestry.getChoices(0);
			if (initialChoices) {
				if (Array.isArray(initialChoices)) {
					initialChoices.forEach((choice) => {
						choices.push({
							location: { source: "ancestry", level: 0 },
							config: choice,
						});
					});
				} else {
					choices.push({
						location: { source: "ancestry", level: 0 },
						config: initialChoices,
					});
				}
			}

			// Level 4 choices are only available at level 4 or higher
			if (this.level >= 4) {
				const ancestryChoices = this.ancestry.getChoices(4);
				if (ancestryChoices) {
					if (Array.isArray(ancestryChoices)) {
						ancestryChoices.forEach((choice) => {
							choices.push({
								location: { source: "ancestry", level: 4 },
								config: choice,
							});
						});
					} else {
						choices.push({
							location: { source: "ancestry", level: 4 },
							config: ancestryChoices,
						});
					}
				}
			}
		}

		// Get path choices
		if (this.novicePath) {
			const noviceChoices = this.novicePath.getChoices(this.level);
			noviceChoices.forEach((choice) => {
				if (Array.isArray(choice.config)) {
					choice.config.forEach((config) => {
						choices.push({
							location: {
								source: "novicePath",
								level: choice.level,
							},
							config,
						});
					});
				} else {
					choices.push({
						location: {
							source: "novicePath",
							level: choice.level,
						},
						config: choice.config,
					});
				}
			});
		}

		if (this.expertPath) {
			const expertChoices = this.expertPath.getChoices(this.level);
			expertChoices.forEach((choice) => {
				if (Array.isArray(choice.config)) {
					choice.config.forEach((config) => {
						choices.push({
							location: {
								source: "expertPath",
								level: choice.level,
							},
							config,
						});
					});
				} else {
					choices.push({
						location: {
							source: "expertPath",
							level: choice.level,
						},
						config: choice.config,
					});
				}
			});
		}

		if (this.masterPath) {
			const masterChoices = this.masterPath.getChoices(this.level);
			masterChoices.forEach((choice) => {
				if (Array.isArray(choice.config)) {
					choice.config.forEach((config) => {
						choices.push({
							location: {
								source: "masterPath",
								level: choice.level,
							},
							config,
						});
					});
				} else {
					choices.push({
						location: {
							source: "masterPath",
							level: choice.level,
						},
						config: choice.config,
					});
				}
			});
		}

		return choices;
	}

	/**
	 * Sets a choice for a specific location
	 */
	setChoice(
		location: ChoiceLocation,
		selection: Partial<ChoiceConfig>,
		index: number = 0
	) {
		// Create a more specific key that includes choice type and index to support multiple choices of same type
		const key = `${location.source}-${location.level}-${selection.type}-${index}`;
		const currentChoice = this.choicesByLocation.get(key);

		if (currentChoice) {
			const updatedChoice = { ...currentChoice };
			if (selection.type === currentChoice.type) {
				Object.assign(updatedChoice, selection);
				this.choicesByLocation.set(key, updatedChoice);
			}
		} else {
			// If no choice exists yet, create a new one
			// For language choices, ensure selected languages don't overlap with existing ones
			if (selection.type === "language" && selection.selectedLanguages) {
				// Don't filter out existing languages - we want to allow any language to be chosen
				this.choicesByLocation.set(key, selection as ChoiceConfig);
			} else {
				this.choicesByLocation.set(key, selection as ChoiceConfig);
			}
		}
	}

	/**
	 * Gets the current selection for a specific choice
	 */
	getChoice(
		location: ChoiceLocation,
		type: string = "",
		index: number = 0
	): ChoiceConfig | undefined {
		// Support the old format for backward compatibility
		const oldKey = `${location.source}-${location.level}`;
		const newKey = `${location.source}-${location.level}-${type}-${index}`;

		// Try the new key format first, fall back to old format
		return (
			this.choicesByLocation.get(newKey) ||
			this.choicesByLocation.get(oldKey)
		);
	}

	/**
	 * Gets the effective attributes for a choice (selected or default)
	 */
	private getEffectiveAttributeChoice(
		location: ChoiceLocation
	): (keyof mainAttributes)[] {
		const availableChoices = this.getAvailableChoices();
		const currentChoice = availableChoices.find(
			(c) =>
				c.location.source === location.source &&
				c.location.level === location.level
		);

		if (!currentChoice || currentChoice.config.type !== "attribute") {
			return [];
		}

		// Include the type parameter to ensure we find choices stored with the new key format
		const savedChoice = this.getChoice(location, "attribute");
		if (
			savedChoice?.type === "attribute" &&
			savedChoice.selectedAttributes
		) {
			return savedChoice.selectedAttributes.slice(
				0,
				currentChoice.config.count
			);
		}

		// Use default attributes if available, limited by count
		if (currentChoice.config.defaultAttributes) {
			return currentChoice.config.defaultAttributes.slice(
				0,
				currentChoice.config.count
			);
		}

		// If no defaults are provided, use all attributes up to count
		const allAttributes: (keyof mainAttributes)[] = [
			"strength",
			"agility",
			"intellect",
			"will",
		];
		return allAttributes.slice(0, currentChoice.config.count);
	}

	/**
	 * Gets the effective professions for a choice (selected or default)
	 */
	private getEffectiveProfessionChoice(location: ChoiceLocation): string[] {
		const availableChoices = this.getAvailableChoices();
		// Find all profession choices for this location
		const professionChoices = availableChoices.filter(
			(c) =>
				c.location.source === location.source &&
				c.location.level === location.level &&
				c.config.type === "profession"
		);

		// If no profession choices exist, return empty array
		if (professionChoices.length === 0) {
			return [];
		}

		let selectedProfessions: string[] = [];

		// Collect all selected professions from all profession choices
		for (let i = 0; i < professionChoices.length; i++) {
			const currentChoice = professionChoices[i];
			if (currentChoice.config.type !== "profession") continue;

			const savedChoice = this.getChoice(location, "profession", i);

			if (
				savedChoice?.type === "profession" &&
				savedChoice.selectedProfessions
			) {
				selectedProfessions = [
					...selectedProfessions,
					...savedChoice.selectedProfessions.slice(
						0,
						currentChoice.config.count
					),
				];
			} else if (currentChoice.config.defaultProfessions) {
				// Use default professions if available, limited by count
				selectedProfessions = [
					...selectedProfessions,
					...currentChoice.config.defaultProfessions.slice(
						0,
						currentChoice.config.count
					),
				];
			}
		}

		// Remove duplicates - fix for TypeScript compatibility
		return Array.from(new Set(selectedProfessions));
	}

	/**
	 * Gets the effective languages for a choice (selected or default)
	 */
	private getEffectiveLanguageChoice(location: ChoiceLocation): string[] {
		const availableChoices = this.getAvailableChoices();
		// Find all language choices for this location
		const languageChoices = availableChoices.filter(
			(c) =>
				c.location.source === location.source &&
				c.location.level === location.level &&
				c.config.type === "language"
		);

		// If no language choices exist, return empty array
		if (languageChoices.length === 0) {
			return [];
		}

		let selectedLanguages: string[] = [];

		// Collect all selected languages from all language choices
		for (let i = 0; i < languageChoices.length; i++) {
			const currentChoice = languageChoices[i];
			if (currentChoice.config.type !== "language") continue;

			const savedChoice = this.getChoice(location, "language", i);

			if (
				savedChoice?.type === "language" &&
				savedChoice.selectedLanguages
			) {
				selectedLanguages = [
					...selectedLanguages,
					...savedChoice.selectedLanguages.slice(
						0,
						currentChoice.config.count
					),
				];
			}
		}

		// Remove duplicates - fix for TypeScript compatibility
		return Array.from(new Set(selectedLanguages));
	}

	/**
	 * Calculates and returns the character's current attributes
	 * Includes base attributes plus all applicable modifiers
	 */
	get attributes(): attributes {
		// Start with the base attributes from ancestry
		const mainAttrs: mainAttributes = { ...this._ancestry.mainAttributes };
		console.log(
			`[DEBUG] attributes: Initial mainAttrs: ${JSON.stringify(
				mainAttrs
			)}`
		);

		// Calculate secondary attributes using ancestry rules
		const secondaryAttrs = this.calculateSecondaryAttributes(mainAttrs);
		console.log(
			`[DEBUG] attributes: After calculateSecondaryAttributes: health = ${secondaryAttrs.health}`
		);

		// Apply attribute choices first, so they affect base calculations
		// Process available choices
		const choices = this.getAvailableChoices();

		// Process tracking sets for unique values
		const uniqueLanguages = new Set<string>();
		const uniqueProfessions = new Set<string>();
		const uniqueSkills = new Set<string>();

		// First, add defaults to uniqueLanguages and uniqueProfessions
		secondaryAttrs.languages.forEach((lang) => uniqueLanguages.add(lang));
		secondaryAttrs.professions.forEach((prof) =>
			uniqueProfessions.add(prof)
		);

		// Apply ancestry level 0 choices first (character creation)
		for (const choice of choices) {
			// Skip choices not from ancestry level 0
			if (
				choice.location.source !== "ancestry" ||
				choice.location.level !== 0
			) {
				continue;
			}

			// Process choices based on type
			switch (choice.config.type) {
				case "attribute": {
					const selected = this.getEffectiveAttributeChoice(
						choice.location
					);
					console.log(
						`[DEBUG] attributes: Processing attribute choice: ${JSON.stringify(
							selected
						)}`
					);
					selected.forEach((attr) => {
						mainAttrs[attr] += (
							choice.config as AttributeChoiceConfig
						).increaseBy;
					});
					console.log(
						`[DEBUG] attributes: After attribute choice: strength = ${mainAttrs.strength}`
					);
					break;
				}
				case "profession": {
					const selected = this.getEffectiveProfessionChoice(
						choice.location
					);
					// Add user choices while preserving defaults
					selected.forEach((prof) => uniqueProfessions.add(prof));
					break;
				}
				case "language": {
					const selected = this.getEffectiveLanguageChoice(
						choice.location
					);
					// Add user choices while preserving defaults
					selected.forEach((lang) => uniqueLanguages.add(lang));
					break;
				}
			}
		}

		// Recalculate secondary attributes after applying attribute choices
		// This ensures health calculation correctly uses the updated strength
		secondaryAttrs.health = this.ancestry.secondaryAttributeRules.health(
			mainAttrs,
			this.level,
			secondaryAttrs
		);
		console.log(
			`[DEBUG] attributes: After recalculating health: health = ${secondaryAttrs.health}`
		);

		// Apply ancestry modifiers
		this._ancestry.applyModifiers(this, mainAttrs, secondaryAttrs);
		console.log(
			`[DEBUG] attributes: After ancestry modifiers: health = ${secondaryAttrs.health}`
		);

		// Apply level 4+ choices if at appropriate level
		if (this.level >= 4) {
			for (const choice of choices) {
				// Skip choices that are not applicable at current level
				if (choice.location.level > this.level) {
					continue;
				}

				// Skip level 0 choices (already processed)
				if (choice.location.level === 0) {
					continue;
				}

				// Process choices based on type
				switch (choice.config.type) {
					case "profession": {
						const selected = this.getEffectiveProfessionChoice(
							choice.location
						);
						// Add user choices
						selected.forEach((prof) => uniqueProfessions.add(prof));
						break;
					}
					case "language": {
						const selected = this.getEffectiveLanguageChoice(
							choice.location
						);
						// Add user choices
						selected.forEach((lang) => uniqueLanguages.add(lang));
						break;
					}
					case "skill": {
						// Add skills from choices - we don't currently track these separately
						// They'll be added from modifier processing
						break;
					}
				}
			}
		}

		// Apply modifiers from paths, ONLY if at appropriate level
		if (this._novicePath && this.level >= 1) {
			this._novicePath.applyModifiers(this, mainAttrs, secondaryAttrs);
			console.log(
				`[DEBUG] attributes: After novice path modifiers: health = ${secondaryAttrs.health}`
			);

			// Process novice path choices
			for (const choice of choices) {
				if (
					choice.location.source !== "novicePath" ||
					choice.location.level > this.level
				) {
					continue;
				}

				// Process choices based on type
				switch (choice.config.type) {
					case "attribute": {
						const selected = this.getEffectiveAttributeChoice(
							choice.location
						);
						selected.forEach((attr) => {
							mainAttrs[attr] += (
								choice.config as AttributeChoiceConfig
							).increaseBy;
						});
						break;
					}
					case "profession": {
						const selected = this.getEffectiveProfessionChoice(
							choice.location
						);
						selected.forEach((prof) => uniqueProfessions.add(prof));
						break;
					}
					case "language": {
						const selected = this.getEffectiveLanguageChoice(
							choice.location
						);
						selected.forEach((lang) => uniqueLanguages.add(lang));
						break;
					}
				}
			}
		}

		if (this._expertPath && this.level >= 3) {
			this._expertPath.applyModifiers(this, mainAttrs, secondaryAttrs);
			console.log(
				`[DEBUG] attributes: After expert path modifiers: health = ${secondaryAttrs.health}`
			);

			// Process expert path choices
			for (const choice of choices) {
				if (
					choice.location.source !== "expertPath" ||
					choice.location.level > this.level
				) {
					continue;
				}

				// Process expert path choices in same pattern as novice path
				// ... similar code as novice path
			}
		}

		if (this._masterPath && this.level >= 7) {
			this._masterPath.applyModifiers(this, mainAttrs, secondaryAttrs);
			console.log(
				`[DEBUG] attributes: After master path modifiers: health = ${secondaryAttrs.health}`
			);

			// Process master path choices
			for (const choice of choices) {
				if (
					choice.location.source !== "masterPath" ||
					choice.location.level > this.level
				) {
					continue;
				}

				// Process master path choices in same pattern as novice path
				// ... similar code as novice path
			}
		}

		// Apply unique language and profession arrays back to secondary attributes
		secondaryAttrs.languages = Array.from(uniqueLanguages);
		secondaryAttrs.professions = Array.from(uniqueProfessions);

		// Recalculate healing rate after all modifiers are applied
		secondaryAttrs.healingRate = Math.max(
			1,
			Math.floor(secondaryAttrs.health / 4)
		);

		console.log(
			`[DEBUG] attributes: Final health = ${secondaryAttrs.health}`
		);

		// Return combined attributes
		return {
			...mainAttrs,
			...secondaryAttrs,
		};
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

		console.log(
			`[DEBUG] calculateSecondaryAttributes: Health after rules.health: ${secondaryAttrs.health}`
		);
		console.log(
			`[DEBUG] calculateSecondaryAttributes: mainAttrs.strength: ${mainAttrs.strength}`
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

	/**
	 * Calculates the maximum spell power level available at a given character level
	 * This is based on the character's Power attribute at that level
	 */
	private getMaxSpellPowerForLevel(level: number): number {
		// Store current level
		const currentLevel = this.level;

		// Temporarily set level to calculate power
		this.level = level;

		// Get power at this level
		const powerAtLevel = this.attributes.power;

		// Restore original level
		this.level = currentLevel;

		return powerAtLevel;
	}

	/**
	 * Gets suggested languages based on the character's current state
	 * Returns a list of suggested languages that don't overlap with currently chosen languages
	 */
	getSuggestedLanguages(): LanguageSuggestion[] {
		// Get currently chosen languages (excluding base languages)
		const chosenLanguages = Array.from(this.choicesByLocation.values())
			.filter(
				(choice): choice is LanguageChoiceConfig =>
					choice.type === "language"
			)
			.flatMap((choice) => choice.selectedLanguages || []);

		// Ordered array of language preferences
		const languagePreferences = [
			{
				language: "Common",
				reason: "Basic communication language",
				canWrite: true,
			},
			{
				language: "High Archaic",
				reason: "Language of ancient texts and scholarly works",
				canWrite: false,
			},
			{
				language: "Celestial",
				reason: "Sacred language used in religious texts and ceremonies",
				canWrite: false,
			},
			{
				language: "Elvish",
				reason: "Language of the elven people and their traditions",
				canWrite: false,
			},
			{
				language: "Dwarfish",
				reason: "Language of dwarven culture and craftsmanship",
				canWrite: false,
			},
			{
				language: "Dark Speech",
				reason: "Forbidden language of dark magic and ancient curses",
				canWrite: false,
			},
		];

		// Add path-specific suggestions
		if (this.novicePath) {
			// Get all skills from the path's modifiers
			const pathSkills = [
				...(this.novicePath.l1Mod.skills || []),
				...(this.novicePath.l2Mod?.skills || []),
				...(this.novicePath.l5Mod?.skills || []),
				...(this.novicePath.l8Mod?.skills || []),
			];

			const hasMagicSkills = pathSkills.some((skill) =>
				["Sense Magic", "Cantrip", "Academic Knowledge"].includes(
					skill.name
				)
			);
			const hasPriestSkills = pathSkills.some((skill) =>
				["Shared Recovery", "Prayer"].includes(skill.name)
			);

			// Adjust writing preferences based on path
			if (hasMagicSkills || hasPriestSkills) {
				languagePreferences.forEach((pref) => {
					if (["High Archaic", "Celestial"].includes(pref.language)) {
						pref.canWrite = true;
						if (hasMagicSkills) {
							pref.reason +=
								" (You can write this language due to your magical training)";
						} else {
							pref.reason +=
								" (You can write this language due to your religious training)";
						}
					}
				});
			}
		}

		// Filter out languages the character has explicitly chosen
		const filteredSuggestions = languagePreferences.filter(
			(suggestion) => !chosenLanguages.includes(suggestion.language)
		);

		return filteredSuggestions;
	}
}
