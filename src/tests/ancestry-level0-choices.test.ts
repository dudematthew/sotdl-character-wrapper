import { Character } from "../character";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import languerAncestry from "../instances/ancestries/LanguerAncestry";

describe("Ancestry Level 0 Choices", () => {
	test("Human ancestry should have level 0 choices available at character creation", () => {
		const character = new Character({ name: "TestHuman" }, humanAncestry);
		// Ensure character is at level 0
		character.level = 0;

		// Get available choices
		const choices = character.getAvailableChoices();

		// Filter to find level 0 choices from ancestry
		const level0Choices = choices.filter(
			(c) => c.location.source === "ancestry" && c.location.level === 0
		);

		// Check if we have level 0 choices
		expect(level0Choices.length).toBeGreaterThan(0);

		// There should be an attribute choice
		const attributeChoice = level0Choices.find(
			(c) => c.config.type === "attribute"
		);
		expect(attributeChoice).toBeDefined();

		// There should be a profession choice
		const professionChoice = level0Choices.find(
			(c) => c.config.type === "profession"
		);
		expect(professionChoice).toBeDefined();
	});

	test("Languer ancestry should have level 0 choices available at character creation", () => {
		const character = new Character(
			{ name: "TestLanguer" },
			languerAncestry
		);
		// Ensure character is at level 0
		character.level = 0;

		// Get available choices
		const choices = character.getAvailableChoices();

		// Filter to find level 0 choices from ancestry
		const level0Choices = choices.filter(
			(c) => c.location.source === "ancestry" && c.location.level === 0
		);

		// Check if we have level 0 choices
		expect(level0Choices.length).toBeGreaterThan(0);

		// There should be an attribute choice
		const attributeChoice = level0Choices.find(
			(c) => c.config.type === "attribute"
		);
		expect(attributeChoice).toBeDefined();

		// There should be a language choice
		const languageChoice = level0Choices.find(
			(c) => c.config.type === "language"
		);
		expect(languageChoice).toBeDefined();
	});

	test("Level 0 choices can be set and reflected in character attributes", () => {
		const character = new Character({ name: "TestHuman" }, humanAncestry);
		character.level = 0;

		// Get available choices
		const choices = character.getAvailableChoices();

		// Find attribute choice
		const attributeChoice = choices.find(
			(c) => c.config.type === "attribute" && c.location.level === 0
		);

		// Find profession choice
		const professionChoice = choices.find(
			(c) => c.config.type === "profession" && c.location.level === 0
		);

		// Set attribute choice
		if (attributeChoice && attributeChoice.config.type === "attribute") {
			character.setChoice(attributeChoice.location, {
				type: "attribute",
				count: 1,
				increaseBy: 1,
				selectedAttributes: ["intellect"],
			});
		}

		// Set profession choice
		if (professionChoice && professionChoice.config.type === "profession") {
			character.setChoice(professionChoice.location, {
				type: "profession",
				count: 1,
				availableProfessions:
					professionChoice.config.availableProfessions,
				selectedProfessions: ["Academic"],
			});
		}

		// Check that attributes were modified correctly
		expect(character.attributes.intellect).toBe(11); // Base 10 + 1 from choice

		// Check that profession was added
		expect(character.attributes.professions).toContain("Academic");
	});
});
