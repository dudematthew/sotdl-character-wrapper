import { Character } from "../character";
import peterCharacterFactory from "../instances/charactersFactories/priestCharacterFactory";
import { SpellRegistry } from "../spells/SpellRegistry";

describe("Priest Character", () => {
	let character: Character;

	beforeEach(() => {
		character = peterCharacterFactory();
	});

	test("Initial priest character attributes", () => {
		const attrs = character.attributes;
		expect(attrs.power).toBe(0); // Starts at 0 before leveling
		expect(attrs.health).toBe(10); // Base human health
	});

	test("Level 1 priest abilities", () => {
		character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(1);
		expect(attrs.health).toBe(14); // Base 10 + 4 from level 1

		// Check for Shared Recovery
		expect(
			attrs.skills.some((skill) => skill.name === "Shared Recovery")
		).toBe(true);
	});

	test("Level 2 priest abilities", () => {
		character.levelUp();
		character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(1);
		expect(attrs.health).toBe(18); // Base 10 + 4 + 4

		// Check for Prayer
		expect(attrs.skills.some((skill) => skill.name === "Prayer")).toBe(
			true
		);
	});

	test("Level 5 priest abilities", () => {
		for (let i = 0; i < 5; i++) character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(2);
		expect(attrs.health).toBe(27); // Base 10 + (4 * 5) + ancestry bonus at level 4

		// Check for Divine Strike
		expect(
			attrs.skills.some((skill) => skill.name === "Divine Strike")
		).toBe(true);
	});

	test("Level 8 priest abilities", () => {
		for (let i = 0; i < 8; i++) character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(2);
		expect(attrs.health).toBe(31); // Base 10 + (4 * 8) + ancestry bonus at level 4

		// Check for level 8 abilities
		expect(
			attrs.skills.some((skill) => skill.name === "Inspiring Prayer")
		).toBe(true);
		expect(
			attrs.skills.some(
				(skill) => skill.name === "Improved Shared Recovery"
			)
		).toBe(true);
	});

	test("Level 1 priest spell choices", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const spellChoices = choices.filter(
			(c) => c.location.level === 1 && c.config.type === "spell"
		);

		expect(spellChoices.length).toBe(2); // Should have two spell choice configs at level 1

		// First choice is tradition discovery
		const traditionChoice = spellChoices[0];
		if (traditionChoice && traditionChoice.config.type === "spell") {
			expect(traditionChoice.config.count).toBe(1);
			expect(traditionChoice.config.choices[0].type).toBe(
				"discoverTradition"
			);
			expect(traditionChoice.config.choices[0].description).toBeTruthy();
			expect(traditionChoice.config.choices[0].defaultChoice).toBe(
				"celestial"
			);
		}

		// Second choice is for learning spells
		const spellChoice = spellChoices[1];
		if (spellChoice && spellChoice.config.type === "spell") {
			expect(spellChoice.config.count).toBe(2);
			expect(spellChoice.config.choices.length).toBe(2);
			expect(spellChoice.config.choices[0].type).toBe("learnSpell");
			expect(spellChoice.config.choices[0].description).toBeTruthy();
			expect(spellChoice.config.choices[1].type).toBe("learnSpell");
			expect(spellChoice.config.choices[1].description).toBeTruthy();
		}
	});

	test("Level 2 priest spell choices", () => {
		character.levelUp();
		character.levelUp();
		const choices = character.getAvailableChoices();
		const spellChoices = choices.filter(
			(c) => c.location.level === 2 && c.config.type === "spell"
		);

		expect(spellChoices.length).toBe(1);
		const spellChoice = spellChoices[0];
		if (spellChoice && spellChoice.config.type === "spell") {
			expect(spellChoice.config.count).toBe(2);
			expect(spellChoice.config.choices.length).toBe(2);
			expect(spellChoice.config.choices[0].type).toBe("learnSpell");
			expect(spellChoice.config.choices[1].type).toBe("learnSpell");

			// Check available spell ranks
			const registry = SpellRegistry.getInstance();
			const availableSpells = registry.getAvailableSpellsForChoice(
				spellChoice.config,
				character.attributes.power
			);
			// At level 2, power is 1, so only rank 0-1 spells should be available
			expect(
				Math.max(...availableSpells.map((s) => s.rank))
			).toBeLessThanOrEqual(1);
		}
	});

	test("Spell choice descriptions are meaningful and helpful", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const spellChoices = choices.filter(
			(c) => c.location.level === 1 && c.config.type === "spell"
		);

		// Verify tradition discovery description
		const traditionChoice = spellChoices[0];
		if (traditionChoice && traditionChoice.config.type === "spell") {
			const firstChoice = traditionChoice.config.choices[0];
			expect(firstChoice.description).toBeTruthy();
			expect(firstChoice.description?.length).toBeGreaterThan(20);
			expect(firstChoice.description).toContain("faith"); // Should mention faith for priests
		}

		// Verify spell learning descriptions
		const spellChoice = spellChoices[1];
		if (spellChoice && spellChoice.config.type === "spell") {
			spellChoice.config.choices.forEach((choice) => {
				expect(choice.description).toBeTruthy();
				expect(choice.description?.length).toBeGreaterThan(20);
				expect(choice.description).toContain("faith"); // Should mention faith for priests
			});
		}
	});
});
