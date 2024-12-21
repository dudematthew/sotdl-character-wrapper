import { Character } from "../characters";
import magicianCharacterFactory from "../instances/charactersFactories/magicianCharacterFactory";
import priestCharacterFactory from "../instances/charactersFactories/priestCharacterFactory";
import { LanguageChoiceConfig, AttributeChoiceConfig } from "../types";

describe("Language Suggestion System", () => {
	let magicianCharacter: Character;
	let priestCharacter: Character;

	beforeEach(() => {
		magicianCharacter = magicianCharacterFactory();
		priestCharacter = priestCharacterFactory();
	});

	test("Initial suggestions include Common for any character", () => {
		const suggestions = magicianCharacter.getSuggestedLanguages();
		expect(suggestions.some((s) => s.language === "Common")).toBe(true);
	});

	test("Suggestions don't include already known languages", () => {
		// Level up to get language choice
		magicianCharacter.levelUp();

		// Set a language choice
		const choices = magicianCharacter.getAvailableChoices();
		const languageChoice = choices.find(
			(c) => c.config.type === "language"
		);

		if (languageChoice) {
			const config = languageChoice.config as LanguageChoiceConfig;
			magicianCharacter.setChoice(languageChoice.location, {
				...config,
				selectedLanguages: ["High Archaic"],
			});
		}

		const suggestions = magicianCharacter.getSuggestedLanguages();
		expect(suggestions.some((s) => s.language === "High Archaic")).toBe(
			false
		);
	});

	test("High intellect characters get additional language suggestions", () => {
		// Create a character with high intellect
		const highIntellectCharacter = magicianCharacterFactory();
		highIntellectCharacter.levelUp();

		// Set intellect-increasing choice
		const choices = highIntellectCharacter.getAvailableChoices();
		const attributeChoice = choices.find(
			(c) => c.config.type === "attribute"
		);

		if (attributeChoice) {
			const config = attributeChoice.config as AttributeChoiceConfig;
			highIntellectCharacter.setChoice(attributeChoice.location, {
				...config,
				selectedAttributes: ["intellect", "intellect"],
			});
		}

		const suggestions = highIntellectCharacter.getSuggestedLanguages();
		expect(
			suggestions.some(
				(s) =>
					s.language === "Celestial" &&
					s.reason.includes("high intellect")
			)
		).toBe(true);
	});

	test("Magician gets specific language suggestions", () => {
		magicianCharacter.levelUp();
		const suggestions = magicianCharacter.getSuggestedLanguages();

		expect(
			suggestions.some(
				(s) =>
					s.language === "High Archaic" &&
					s.reason.includes("ancient texts and magic")
			)
		).toBe(true);
		expect(
			suggestions.some(
				(s) =>
					s.language === "Primordial" &&
					s.reason.includes("elemental magic")
			)
		).toBe(true);
	});

	test("Priest gets specific language suggestions", () => {
		priestCharacter.levelUp();
		const suggestions = priestCharacter.getSuggestedLanguages();

		expect(
			suggestions.some(
				(s) =>
					s.language === "Celestial" &&
					s.reason.includes("Sacred language")
			)
		).toBe(true);
		expect(
			suggestions.some(
				(s) =>
					s.language === "High Archaic" &&
					s.reason.includes("ancient texts and magic")
			)
		).toBe(true);
	});

	test("Each suggestion includes a meaningful reason", () => {
		const suggestions = magicianCharacter.getSuggestedLanguages();

		suggestions.forEach((suggestion) => {
			expect(suggestion.reason).toBeTruthy();
			expect(suggestion.reason.length).toBeGreaterThan(10);
		});
	});

	test("Suggestions are unique even with multiple reasons", () => {
		magicianCharacter.levelUp();
		const suggestions = magicianCharacter.getSuggestedLanguages();

		// Get unique languages
		const uniqueLanguages = new Set(suggestions.map((s) => s.language));
		expect(uniqueLanguages.size).toBe(suggestions.length);
	});
});
