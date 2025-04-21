import { Character } from "../character";
import languerAncestry from "../instances/ancestries/LanguerAncestry";
import magicianNovicePath from "../instances/paths/novice/magicianNovicePath";
import { LanguageChoiceConfig, ProfessionChoiceConfig } from "../types";

/**
 * Factory to create a character named Chad with Languer ancestry
 * Includes default choices for languages and professions
 */
export class ChadCharacterFactory {
	/**
	 * Creates a base character with Languer ancestry
	 */
	static createBaseCharacter(): Character {
		return new Character({ name: "Chad" }, languerAncestry);
	}

	/**
	 * Creates a level 4 character with all choices set
	 */
	static createLevel4Character(): Character {
		const character = this.createBaseCharacter();
		character.level = 4;

		// Get available choices to find the correct keys
		const availableChoices = character.getAvailableChoices();

		// Find language choices
		const languageChoices = availableChoices.filter(
			(choice) =>
				choice.config.type === "language" &&
				choice.location.source === "ancestry"
		);

		// Find profession choices
		const professionChoices = availableChoices.filter(
			(choice) =>
				choice.config.type === "profession" &&
				choice.location.source === "ancestry"
		);

		// Apply first language choice (from available options)
		if (languageChoices.length > 0) {
			const firstLanguageChoice = languageChoices[0];
			if (firstLanguageChoice.config.type === "language") {
				character.setChoice(firstLanguageChoice.location, {
					type: "language",
					count: firstLanguageChoice.config.count,
					canReadExisting: firstLanguageChoice.config.canReadExisting,
					canLearnNew: firstLanguageChoice.config.canLearnNew,
					selectedLanguages: ["Elvish"],
				} as LanguageChoiceConfig);
			}
		}

		// Apply second language choice (free choice)
		if (languageChoices.length > 1) {
			const secondLanguageChoice = languageChoices[1];
			if (secondLanguageChoice.config.type === "language") {
				character.setChoice(secondLanguageChoice.location, {
					type: "language",
					count: secondLanguageChoice.config.count,
					canReadExisting:
						secondLanguageChoice.config.canReadExisting,
					canLearnNew: secondLanguageChoice.config.canLearnNew,
					selectedLanguages: ["Primordial"],
				} as LanguageChoiceConfig);
			}
		}

		// Apply first profession choice (from available options)
		if (professionChoices.length > 0) {
			const firstProfessionChoice = professionChoices[0];
			if (firstProfessionChoice.config.type === "profession") {
				character.setChoice(firstProfessionChoice.location, {
					type: "profession",
					count: firstProfessionChoice.config.count,
					availableProfessions:
						firstProfessionChoice.config.availableProfessions,
					selectedProfessions: ["Diplomat"],
				} as ProfessionChoiceConfig);
			}
		}

		// Apply second profession choice (free choice)
		if (professionChoices.length > 1) {
			const secondProfessionChoice = professionChoices[1];
			if (secondProfessionChoice.config.type === "profession") {
				character.setChoice(secondProfessionChoice.location, {
					type: "profession",
					count: secondProfessionChoice.config.count,
					availableProfessions:
						secondProfessionChoice.config.availableProfessions,
					selectedProfessions: ["Linguist"],
				} as ProfessionChoiceConfig);
			}
		}

		return character;
	}

	/**
	 * Creates a level 4 character with Magician path
	 */
	static createLevel4Magician(): Character {
		const character = this.createLevel4Character();
		character.novicePath = magicianNovicePath;

		// Get available choices to find the Magician path choices
		const availableChoices = character.getAvailableChoices();

		// Find novice path language choice
		const noviceLanguageChoice = availableChoices.find(
			(choice) =>
				choice.config.type === "language" &&
				choice.location.source === "novicePath"
		);

		// Apply language choice from magician path
		if (
			noviceLanguageChoice &&
			noviceLanguageChoice.config.type === "language"
		) {
			character.setChoice(noviceLanguageChoice.location, {
				type: "language",
				count: noviceLanguageChoice.config.count,
				canReadExisting: noviceLanguageChoice.config.canReadExisting,
				canLearnNew: noviceLanguageChoice.config.canLearnNew,
				selectedLanguages: ["Dark Speech"],
			} as LanguageChoiceConfig);
		}

		// Find novice path profession choice
		const noviceProfessionChoice = availableChoices.find(
			(choice) =>
				choice.config.type === "profession" &&
				choice.location.source === "novicePath"
		);

		// Set profession choice
		if (
			noviceProfessionChoice &&
			noviceProfessionChoice.config.type === "profession"
		) {
			character.setChoice(noviceProfessionChoice.location, {
				type: "profession",
				count: noviceProfessionChoice.config.count,
				availableProfessions:
					noviceProfessionChoice.config.availableProfessions,
				selectedProfessions: ["Arcana"],
			} as ProfessionChoiceConfig);
		}

		return character;
	}
}
