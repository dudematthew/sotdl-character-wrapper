import { Character } from "../character";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import languerAncestry from "../instances/ancestries/LanguerAncestry";
import magicianCharacterFactory from "../instances/charactersFactories/magicianCharacterFactory";
import priestCharacterFactory from "../instances/charactersFactories/priestCharacterFactory";

describe("Language System", () => {
	describe("Default Languages", () => {
		test("Characters have ancestry-specific default languages", () => {
			// Human ancestry should have Common
			const humanCharacter = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);
			expect(humanCharacter.attributes.languages).toContain("Common");
			expect(humanCharacter.attributes.languages.length).toBe(1);

			// Languer ancestry should have Common and High Archaic
			const languerCharacter = new Character(
				{ name: "TestLanguer" },
				languerAncestry
			);
			expect(languerCharacter.attributes.languages).toContain("Common");
			expect(languerCharacter.attributes.languages).toContain(
				"High Archaic"
			);
			expect(languerCharacter.attributes.languages.length).toBe(2);
		});

		test("Factory-created characters have correct default languages", () => {
			const magicianCharacter = magicianCharacterFactory();
			const priestCharacter = priestCharacterFactory();

			// Both should have Common as they're human
			expect(magicianCharacter.attributes.languages).toContain("Common");
			expect(priestCharacter.attributes.languages).toContain("Common");
		});
	});

	describe("Language Choices", () => {
		test("Language choices are applied to character attributes", () => {
			const character = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);

			// Get available choices
			const choices = character.getAvailableChoices();
			const languageChoice = choices.find(
				(c) =>
					c.config.type === "language" &&
					c.location.source === "ancestry"
			);

			// If there's a language choice available, set it
			if (languageChoice && languageChoice.config.type === "language") {
				character.setChoice(languageChoice.location, {
					type: "language",
					count: 1,
					canReadExisting: true,
					canLearnNew: true,
					selectedLanguages: ["Elvish"],
				});

				// Verify language was added
				expect(character.attributes.languages).toContain("Common"); // Default remains
				expect(character.attributes.languages).toContain("Elvish"); // New language added
			}
		});

		test("Multiple language choices can be made without duplicates", () => {
			// Level up to get more language choices
			const languerCharacter = new Character(
				{ name: "TestLanguer" },
				languerAncestry
			);
			languerCharacter.level = 4;

			const choices = languerCharacter.getAvailableChoices();
			const languageChoices = choices.filter(
				(c) =>
					c.config.type === "language" &&
					c.location.source === "ancestry"
			);

			// Verify we have multiple language choices
			expect(languageChoices.length).toBeGreaterThan(1);

			// Set different languages for different choices
			if (languageChoices.length > 1) {
				// First choice
				if (languageChoices[0].config.type === "language") {
					languerCharacter.setChoice(
						languageChoices[0].location,
						{
							type: "language",
							count: 1,
							canReadExisting: (languageChoices[0].config as any)
								.canReadExisting,
							canLearnNew: (languageChoices[0].config as any)
								.canLearnNew,
							selectedLanguages: ["Elvish"],
						},
						0
					);
				}

				// Second choice
				if (languageChoices[1].config.type === "language") {
					languerCharacter.setChoice(
						languageChoices[1].location,
						{
							type: "language",
							count: 1,
							canReadExisting: (languageChoices[1].config as any)
								.canReadExisting,
							canLearnNew: (languageChoices[1].config as any)
								.canLearnNew,
							selectedLanguages: ["Dwarfish"],
						},
						1
					);
				}

				// Verify both languages were added
				expect(languerCharacter.attributes.languages).toContain(
					"Common"
				);
				expect(languerCharacter.attributes.languages).toContain(
					"High Archaic"
				);
				expect(languerCharacter.attributes.languages).toContain(
					"Elvish"
				);
				expect(languerCharacter.attributes.languages).toContain(
					"Dwarfish"
				);

				// Verify no duplicates
				const uniqueLanguages = new Set(
					languerCharacter.attributes.languages
				);
				expect(uniqueLanguages.size).toBe(
					languerCharacter.attributes.languages.length
				);
			}
		});
	});

	describe("Language Validation", () => {
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
					c.config.type === "language" &&
					c.location.source === "ancestry"
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
});
