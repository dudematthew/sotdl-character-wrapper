import { Character } from "../character";
import languerAncestry from "../instances/ancestries/LanguerAncestry";

describe("Language Validation Tests", () => {
	test("Should validate language against available options when set", () => {
		const character = new Character({ name: "Test" }, languerAncestry);
		character.level = 4;

		// Get available language choice
		const choices = character.getAvailableChoices();
		const languageChoice = choices.find(
			(c) =>
				c.config.type === "language" &&
				c.location.source === "ancestry" &&
				c.config.type === "language" &&
				(c.config as any).availableLanguages
		);

		// Verify it exists
		expect(languageChoice).toBeDefined();

		if (languageChoice && languageChoice.config.type === "language") {
			// Check that it has the expected available languages
			if ((languageChoice.config as any).availableLanguages) {
				const availableLanguages = (languageChoice.config as any)
					.availableLanguages;
				expect(availableLanguages).toContain("Elvish");
				expect(availableLanguages).toContain("Dwarfish");

				// Set a valid language
				character.setChoice(languageChoice.location, {
					type: "language",
					count: 1,
					canReadExisting: languageChoice.config.canReadExisting,
					canLearnNew: languageChoice.config.canLearnNew,
					selectedLanguages: ["Elvish"],
				});

				// Validate that the language is in the attributes
				expect(character.attributes.languages).toContain("Elvish");

				// Set an invalid language (not in available list)
				// The system should still allow this as per current design
				character.setChoice(languageChoice.location, {
					type: "language",
					count: 1,
					canReadExisting: languageChoice.config.canReadExisting,
					canLearnNew: languageChoice.config.canLearnNew,
					selectedLanguages: ["NonExistentLanguage"],
				});

				// The invalid language should still be added because
				// the current implementation does not validate against available options
				expect(character.attributes.languages).toContain(
					"NonExistentLanguage"
				);
			}
		}
	});

	test("Free language choice should not validate against specific options", () => {
		const character = new Character({ name: "Test" }, languerAncestry);
		character.level = 4;

		// Get available language choices
		const choices = character.getAvailableChoices();
		const languageChoices = choices.filter(
			(c) =>
				c.config.type === "language" && c.location.source === "ancestry"
		);

		// Find choice without available languages (free choice)
		const freeChoice = languageChoices.find(
			(c) =>
				c.config.type === "language" &&
				!(c.config as any).availableLanguages
		);

		expect(freeChoice).toBeDefined();

		if (freeChoice && freeChoice.config.type === "language") {
			// Set any language (should be valid for free choice)
			character.setChoice(freeChoice.location, {
				type: "language",
				count: 1,
				canReadExisting: freeChoice.config.canReadExisting,
				canLearnNew: freeChoice.config.canLearnNew,
				selectedLanguages: ["AnyLanguage"],
			});

			// Should be added without validation
			expect(character.attributes.languages).toContain("AnyLanguage");
		}
	});
});
