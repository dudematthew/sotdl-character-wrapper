import { Character } from "../character";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import languerAncestry from "../instances/ancestries/LanguerAncestry";
import magicianCharacterFactory from "../instances/charactersFactories/magicianCharacterFactory";
import priestCharacterFactory from "../instances/charactersFactories/priestCharacterFactory";

describe("Character Language System", () => {
	let magicianCharacter: Character;
	let priestCharacter: Character;

	beforeEach(() => {
		magicianCharacter = magicianCharacterFactory();
		priestCharacter = priestCharacterFactory();
	});

	test("Characters have default ancestry languages", () => {
		// Human ancestry should have Common
		expect(magicianCharacter.attributes.languages).toContain("Common");

		// Create a Languer character
		const languerCharacter = new Character(
			{ name: "TestLanguer" },
			languerAncestry
		);
		// Languer ancestry should have Common and High Archaic
		expect(languerCharacter.attributes.languages).toContain("Common");
		expect(languerCharacter.attributes.languages).toContain("High Archaic");
	});

	test("Language choices are applied to character attributes", () => {
		// Create a character and set a language choice
		const character = new Character({ name: "TestHuman" }, humanAncestry);

		// Get available choices
		const choices = character.getAvailableChoices();
		const languageChoice = choices.find(
			(c) =>
				c.config.type === "language" && c.location.source === "ancestry"
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

	test("Default language choice values are used when not specified", () => {
		// Create a character
		const languerCharacter = new Character(
			{ name: "TestLanguer" },
			languerAncestry
		);
		const choices = languerCharacter.getAvailableChoices();

		// Find a language choice with default values
		const langChoice = choices.find(
			(c) =>
				c.config.type === "language" &&
				c.location.source === "ancestry" &&
				c.location.level === 0
		);

		// Verify the choice has available languages
		if (langChoice && langChoice.config.type === "language") {
			const availableLanguages = langChoice.config.availableLanguages;
			expect(availableLanguages).toBeDefined();

			if (availableLanguages) {
				// Check the available languages match what we expect
				expect(availableLanguages).toContain("Elvish");
				expect(availableLanguages).toContain("Dwarfish");
				expect(availableLanguages).toContain("Goblin");
				expect(availableLanguages).toContain("Primordial");
			}
		}
	});

	test("Multiple language choices can be made", () => {
		// Level up to get more language choices
		const languerCharacter = new Character(
			{ name: "TestLanguer" },
			languerAncestry
		);
		languerCharacter.level = 4;

		const choices = languerCharacter.getAvailableChoices();
		const languageChoices = choices.filter(
			(c) =>
				c.config.type === "language" && c.location.source === "ancestry"
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
			expect(languerCharacter.attributes.languages).toContain("Common");
			expect(languerCharacter.attributes.languages).toContain(
				"High Archaic"
			);
			expect(languerCharacter.attributes.languages).toContain("Elvish");
			expect(languerCharacter.attributes.languages).toContain("Dwarfish");

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
