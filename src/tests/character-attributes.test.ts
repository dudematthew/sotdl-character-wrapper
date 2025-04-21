import { Character } from "../character";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import languerAncestry from "../instances/ancestries/LanguerAncestry";
import edwardCharacterFactory from "../instances/charactersFactories/edwardCharacterFactory";

const levelUpBy = (character: Character, levels: number) => {
	for (let i = 0; i < levels; i++) {
		character.levelUp();
	}
};

describe("Character Attributes", () => {
	describe("Base Attributes Calculation", () => {
		test("Human character should have correct base attributes", () => {
			const character = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);

			// NOTE: The Human ancestry has a default attribute choice of strength
			// that gets applied automatically, so strength is 11 (10 + 1)
			expect(character.attributes.strength).toBe(11);
			expect(character.attributes.agility).toBe(10);
			expect(character.attributes.intellect).toBe(10);
			expect(character.attributes.will).toBe(10);

			// Secondary attributes
			expect(character.attributes.health).toBe(11); // Based on strength (11)
			expect(character.attributes.languages).toContain("Common");
		});

		test("Languer character should have correct base attributes", () => {
			const character = new Character(
				{ name: "TestLanguer" },
				languerAncestry
			);

			expect(character.attributes.strength).toBe(9);
			expect(character.attributes.agility).toBe(9);
			expect(character.attributes.intellect).toBe(13); // Base 12 + default 1
			expect(character.attributes.will).toBe(10);

			// Secondary attributes including racial bonuses
			expect(character.attributes.perception).toBe(14); // Intellect (13) + 1
			expect(character.attributes.health).toBe(8); // Strength (9) - 1
			expect(character.attributes.languages).toContain("Common");
			expect(character.attributes.languages).toContain("High Archaic");
		});
	});

	describe("Attribute Choices", () => {
		test("Default attribute choices are applied when no selection is made", () => {
			const character = edwardCharacterFactory();
			character.levelUp(); // Level up to 1 where warrior gets attribute choices

			// Warrior path has default choices of strength and agility
			expect(character.attributes.strength).toBe(12); // Base 10 + 1 from default choice + 1 from initial ancestry choice
			expect(character.attributes.agility).toBe(11); // Base 10 + 1 from default choice
		});

		test("Selected attributes override default choices", () => {
			const character = edwardCharacterFactory();
			character.levelUp();

			const choices = character.getAvailableChoices();
			const attributeChoice = choices.find(
				(c) => c.location.level === 1 && c.config.type === "attribute"
			);

			expect(attributeChoice).toBeDefined();
			if (
				attributeChoice &&
				attributeChoice.config.type === "attribute"
			) {
				// Override defaults with different choices
				character.setChoice(attributeChoice.location, {
					...attributeChoice.config,
					selectedAttributes: ["strength", "strength"],
				});

				expect(character.attributes.strength).toBe(13); // Base 10 + 2 from selected choices + 1 from initial ancestry choice
				expect(character.attributes.agility).toBe(10); // Base 10, no increase (default was overridden)
			}
		});
	});

	describe("Health Calculation", () => {
		test("Human character health is based on strength", () => {
			const character = new Character(
				{ name: "TestHuman" },
				humanAncestry
			);

			// Base health is equal to strength
			expect(character.attributes.health).toBe(
				character.attributes.strength
			);

			// Find attribute choice
			const choices = character.getAvailableChoices();
			const attributeChoice = choices.find(
				(c) => c.config.type === "attribute" && c.location.level === 0
			);

			if (
				attributeChoice &&
				attributeChoice.config.type === "attribute"
			) {
				// Change attribute choice to intellect
				character.setChoice(attributeChoice.location, {
					type: "attribute",
					count: 1,
					increaseBy: 1,
					selectedAttributes: ["intellect"],
				});

				// Health should be based on strength (now back to 10)
				expect(character.attributes.strength).toBe(10);
				expect(character.attributes.health).toBe(10);
			}
		});

		test("Health increases with character level", () => {
			const character = edwardCharacterFactory();
			expect(character.attributes.health).toBe(11); // Base health at level 0

			character.levelUp();
			expect(character.attributes.health).toBe(16); // After level 1

			character.levelUp();
			expect(character.attributes.health).toBe(21); // After level 2

			character.levelUp();
			expect(character.attributes.health).toBe(24); // After level 3

			character.levelUp();
			expect(character.attributes.health).toBe(29); // After level 4, with ancestry bonus
		});
	});
});
