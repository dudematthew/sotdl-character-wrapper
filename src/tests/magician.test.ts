import { Character } from "../characters";
import magicianCharacterFactory from "../instances/charactersFactories/magicianCharacterFactory";
import { SpellRegistry } from "../spells/SpellRegistry";

describe("Magician Character", () => {
	let character: Character;

	beforeEach(() => {
		character = magicianCharacterFactory();
	});

	test("Initial magician character attributes", () => {
		const attrs = character.attributes;
		expect(attrs.power).toBe(0); // Starts at 0 before leveling
		expect(attrs.health).toBe(10); // Base human health
	});

	test("Level 1 magician abilities", () => {
		character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(1);
		expect(attrs.health).toBe(12); // Base 10 + 2 from level 1

		// Check for Sense Magic skill
		expect(attrs.skills.some((skill) => skill.name === "Sense Magic")).toBe(
			true
		);
		expect(attrs.skills.some((skill) => skill.name === "Cantrip")).toBe(
			true
		);
		expect(
			attrs.skills.some((skill) => skill.name === "Academic Knowledge")
		).toBe(true);
	});

	test("Level 1 magician attribute choices", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const attributeChoice = choices.find(
			(c) => c.location.level === 1 && c.config.type === "attribute"
		);

		expect(attributeChoice).toBeDefined();
		if (attributeChoice && attributeChoice.config.type === "attribute") {
			// Test that we can select any attribute
			character.setChoice(attributeChoice.location, {
				...attributeChoice.config,
				selectedAttributes: ["intellect", "will"],
			});

			const attrs = character.attributes;
			expect(attrs.intellect).toBe(11); // Base 10 + 1
			expect(attrs.will).toBe(11); // Base 10 + 1
		}
	});

	test("Level 1 magician spell choices", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const spellChoices = choices.filter(
			(c) => c.location.level === 1 && c.config.type === "spell"
		);

		expect(spellChoices.length).toBe(1); // Should have one spell choice config at level 1
		const spellChoice = spellChoices[0];
		if (spellChoice && spellChoice.config.type === "spell") {
			expect(spellChoice.config.count).toBe(4); // Should be able to choose 4 spells
			expect(spellChoice.config.maxPowerLevel).toBe(0); // Should only be able to choose rank 0 spells
			expect(spellChoice.config.specificSpells).toContain("senseMagic"); // Should include Sense Magic
		}
	});

	test("Level 2 magician abilities", () => {
		character.levelUp();
		character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(1);
		expect(attrs.health).toBe(14); // Base 10 + 2 + 2

		// Check for Spell Recovery
		expect(
			attrs.skills.some((skill) => skill.name === "Spell Recovery")
		).toBe(true);

		// Check level 2 spell choices
		const choices = character.getAvailableChoices();
		const spellChoices = choices.filter(
			(c) => c.location.level === 2 && c.config.type === "spell"
		);
		expect(spellChoices.length).toBe(1);
		const spellChoice = spellChoices[0];
		if (spellChoice && spellChoice.config.type === "spell") {
			expect(spellChoice.config.count).toBe(2); // Should be able to choose 2 spells
			expect(spellChoice.config.maxPowerLevel).toBe(0); // Should still be rank 0 spells
		}
	});

	test("Level 5 magician abilities", () => {
		for (let i = 0; i < 5; i++) character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(2);
		expect(attrs.health).toBe(21); // Base 10 + (2 * 5) + ancestry bonus at level 4

		// Check for Counterspell
		expect(
			attrs.skills.some((skill) => skill.name === "Counterspell")
		).toBe(true);

		// Check level 5 spell choices
		const choices = character.getAvailableChoices();
		const spellChoices = choices.filter(
			(c) => c.location.level === 5 && c.config.type === "spell"
		);
		expect(spellChoices.length).toBe(1);
		const spellChoice = spellChoices[0];
		if (spellChoice && spellChoice.config.type === "spell") {
			expect(spellChoice.config.count).toBe(1); // Should be able to choose 1 spell
			expect(spellChoice.config.maxPowerLevel).toBe(1); // Should now be able to choose rank 1 spells
		}
	});

	test("Level 8 magician abilities", () => {
		for (let i = 0; i < 8; i++) character.levelUp();
		const attrs = character.attributes;
		expect(attrs.power).toBe(2);
		expect(attrs.health).toBe(23); // Base 10 + (2 * 8) + ancestry bonus at level 4

		// Check for Improved Spell Recovery
		expect(
			attrs.skills.some(
				(skill) => skill.name === "Improved Spell Recovery"
			)
		).toBe(true);

		// Check level 8 spell choices
		const choices = character.getAvailableChoices();
		const spellChoices = choices.filter(
			(c) => c.location.level === 8 && c.config.type === "spell"
		);
		expect(spellChoices.length).toBe(1);
		const spellChoice = spellChoices[0];
		if (spellChoice && spellChoice.config.type === "spell") {
			expect(spellChoice.config.count).toBe(1); // Should be able to choose 1 spell
			expect(spellChoice.config.maxPowerLevel).toBe(2); // Should now be able to choose rank 2 spells
		}
	});
});
