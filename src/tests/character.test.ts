import { Character } from "../character";
import edwardCharacterFactory from "../instances/charactersFactories/edwardCharacterFactory";

const levelUpBy = (character: Character, levels: number) => {
	for (let i = 0; i < levels; i++) {
		character.levelUp();
	}
};

describe("Character Attributes Calculation", () => {
	let character: Character;

	beforeEach(() => {
		character = edwardCharacterFactory();
	});

	test("Default attribute choices are applied when no selection is made", () => {
		character.levelUp(); // Level up to 1 where warrior gets attribute choices
		const attrs = character.attributes;

		// Warrior path has default choices of strength and agility
		expect(attrs.strength).toBe(11); // Base 10 + 1 from default choice
		expect(attrs.agility).toBe(11); // Base 10 + 1 from default choice
		expect(attrs.intellect).toBe(10); // Base 10, no increase
		expect(attrs.will).toBe(10); // Base 10, no increase
	});

	test("Selected attributes override default choices", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const attributeChoice = choices.find(
			(c) => c.location.level === 1 && c.config.type === "attribute"
		);

		expect(attributeChoice).toBeDefined();
		if (attributeChoice && attributeChoice.config.type === "attribute") {
			// Override defaults with different choices
			character.setChoice(attributeChoice.location, {
				...attributeChoice.config,
				selectedAttributes: ["strength", "strength"],
			});

			const attrs = character.attributes;
			expect(attrs.strength).toBe(12); // Base 10 + 2 from selected choices
			expect(attrs.agility).toBe(10); // Base 10, no increase (default was overridden)
		}
	});

	// TODO: Add increment of attributes for ancestry
	test("Initial level attributes", () => {
		const attrs = character.attributes;
		expect(attrs.health).toBe(10);
		expect(attrs.defense).toBe(10);
		expect(attrs.healingRate).toBe(2);
		expect(attrs.speed).toBe(10);
		expect(attrs.languages).toContain("Common");
		expect(attrs.professions).toEqual([]);
	});

	test("Attributes after leveling up to level 1", () => {
		levelUpBy(character, 1);
		expect(character.level).toBe(1);
		const attrs = character.attributes;
		expect(attrs.health).toBe(15);
		expect(attrs.defense).toBe(10);
		expect(attrs.healingRate).toBe(3);
	});

	test("Attributes after leveling up to level 2", () => {
		levelUpBy(character, 2);
		expect(character.level).toBe(2);
		const attrs = character.attributes;
		expect(attrs.health).toBe(20);
		expect(attrs.defense).toBe(10);
		expect(attrs.healingRate).toBe(5);
	});

	test("Attributes after leveling up to level 3", () => {
		levelUpBy(character, 3);
		expect(character.level).toBe(3);
		const attrs = character.attributes;
		expect(attrs.health).toBe(23);
		expect(attrs.defense).toBe(10);
		expect(attrs.healingRate).toBe(5);
	});

	// FIXME: Health and probably other stats are not applied here
	// Ensure that the initial health calculation and the level 4 modifier application are correct.
	test("Attributes after leveling up to level 4", () => {
		levelUpBy(character, 4);
		expect(character.level).toBe(4);
		const attrs = character.attributes;
		expect(attrs.health).toBe(28);
		expect(attrs.skills.some((skill) => skill.name === "Determined")).toBe(
			true
		);
		expect(attrs.defense).toBe(10);
		expect(attrs.healingRate).toBe(7);
	});
});
