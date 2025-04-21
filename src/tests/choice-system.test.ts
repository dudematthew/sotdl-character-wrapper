import { Character } from "../character";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import languerAncestry from "../instances/ancestries/LanguerAncestry";
import magicianNovicePath from "../instances/paths/novice/magicianNovicePath";

describe("Character Choice System", () => {
	describe("Ancestry Level 0 Choices", () => {
		test("Human ancestry should provide level 0 choices at character creation", () => {
			const character = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);
			// Ensure character is at level 0
			character.level = 0;

			// Get available choices
			const choices = character.getAvailableChoices();

			// Filter to find level 0 choices from ancestry
			const level0Choices = choices.filter(
				(c) =>
					c.location.source === "ancestry" && c.location.level === 0
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

		test("Languer ancestry should provide level 0 choices at character creation", () => {
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
				(c) =>
					c.location.source === "ancestry" && c.location.level === 0
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

		test("Level 0 choices should affect character attributes when set", () => {
			const character = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);
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
			if (
				attributeChoice &&
				attributeChoice.config.type === "attribute"
			) {
				character.setChoice(attributeChoice.location, {
					type: "attribute",
					count: 1,
					increaseBy: 1,
					selectedAttributes: ["intellect"],
				});
			}

			// Set profession choice
			if (
				professionChoice &&
				professionChoice.config.type === "profession"
			) {
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

	describe("Path Choices", () => {
		test("Novice path should provide appropriate choices", () => {
			const character = new Character(
				{ name: "TestMagician" },
				humanAncestry
			);
			character.novicePath = magicianNovicePath;
			character.level = 1;

			// Get available choices
			const choices = character.getAvailableChoices();

			// Filter to find novice path choices
			const novicePathChoices = choices.filter(
				(c) =>
					c.location.source === "novicePath" && c.location.level === 1
			);

			// Check if we have novice path choices
			expect(novicePathChoices.length).toBeGreaterThan(0);

			// Should have attribute choice
			const attributeChoice = novicePathChoices.find(
				(c) => c.config.type === "attribute"
			);
			expect(attributeChoice).toBeDefined();

			// Should have profession choice
			const professionChoice = novicePathChoices.find(
				(c) => c.config.type === "profession"
			);
			expect(professionChoice).toBeDefined();

			// Should have language choice
			const languageChoice = novicePathChoices.find(
				(c) => c.config.type === "language"
			);
			expect(languageChoice).toBeDefined();

			// Should have spell choice
			const spellChoice = novicePathChoices.find(
				(c) => c.config.type === "spell"
			);
			expect(spellChoice).toBeDefined();
		});
	});

	describe("Choice Validation", () => {
		test("Setting a valid choice should update character attributes", () => {
			const character = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);

			// Get available choices
			const choices = character.getAvailableChoices();
			const attributeChoice = choices.find(
				(c) => c.config.type === "attribute"
			);

			if (
				attributeChoice &&
				attributeChoice.config.type === "attribute"
			) {
				// Set a valid attribute choice
				character.setChoice(attributeChoice.location, {
					type: "attribute",
					count: 1,
					increaseBy: 1,
					selectedAttributes: ["strength"],
				});

				// Check that strength was increased
				expect(character.attributes.strength).toBe(11);
			}
		});

		test("Changing choice should update character attributes", () => {
			const character = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);

			// Get available choices
			const choices = character.getAvailableChoices();
			const attributeChoice = choices.find(
				(c) => c.config.type === "attribute"
			);

			if (
				attributeChoice &&
				attributeChoice.config.type === "attribute"
			) {
				// Set first attribute choice
				character.setChoice(attributeChoice.location, {
					type: "attribute",
					count: 1,
					increaseBy: 1,
					selectedAttributes: ["strength"],
				});

				// Check that strength was increased
				expect(character.attributes.strength).toBe(11);

				// Change attribute choice
				character.setChoice(attributeChoice.location, {
					type: "attribute",
					count: 1,
					increaseBy: 1,
					selectedAttributes: ["intellect"],
				});

				// Check that intellect is now increased and strength back to default
				expect(character.attributes.intellect).toBe(11);
				expect(character.attributes.strength).toBe(10);
			}
		});
	});
});
