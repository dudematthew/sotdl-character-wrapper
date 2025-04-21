import { Character } from "../character";
import magicianCharacterFactory from "../instances/charactersFactories/magicianCharacterFactory";
import priestCharacterFactory from "../instances/charactersFactories/priestCharacterFactory";
import { SpellRegistry } from "../spells/SpellRegistry";

describe("Character Path Abilities", () => {
	describe("Magician Path", () => {
		let magicianCharacter: Character;

		beforeEach(() => {
			magicianCharacter = magicianCharacterFactory();
		});

		test("Initial magician attributes", () => {
			const attrs = magicianCharacter.attributes;
			expect(attrs.power).toBe(0); // Starts at 0 before leveling
			expect(attrs.health).toBe(11); // Base human health
		});

		test("Level 1 magician abilities", () => {
			magicianCharacter.levelUp();
			const attrs = magicianCharacter.attributes;

			// Check attributes
			expect(attrs.power).toBe(1);
			expect(attrs.health).toBe(13); // Base 11 + 2 from level 1 magician

			// Check for skills
			expect(
				attrs.skills.some((skill) => skill.name === "Sense Magic")
			).toBe(true);
			expect(attrs.skills.some((skill) => skill.name === "Cantrip")).toBe(
				true
			);
			expect(
				attrs.skills.some(
					(skill) => skill.name === "Academic Knowledge"
				)
			).toBe(true);
		});

		test("Level 2 magician abilities", () => {
			magicianCharacter.levelUp();
			magicianCharacter.levelUp();
			const attrs = magicianCharacter.attributes;

			expect(attrs.power).toBe(1);
			expect(attrs.health).toBe(15); // Base 11 + 2 + 2

			// Check for Spell Recovery
			expect(
				attrs.skills.some((skill) => skill.name === "Spell Recovery")
			).toBe(true);
		});

		test("Level 5 magician abilities", () => {
			for (let i = 0; i < 5; i++) magicianCharacter.levelUp();
			const attrs = magicianCharacter.attributes;

			expect(attrs.power).toBe(2);
			expect(attrs.health).toBe(22); // Base 11 + (2 * 5) + ancestry bonus at level 4

			// Check for Counterspell
			expect(
				attrs.skills.some((skill) => skill.name === "Counterspell")
			).toBe(true);
		});

		test("Level 8 magician abilities", () => {
			for (let i = 0; i < 8; i++) magicianCharacter.levelUp();
			const attrs = magicianCharacter.attributes;

			expect(attrs.power).toBe(2);
			expect(attrs.health).toBe(24); // Base 11 + (2 * 8) + ancestry bonus at level 4

			// Check for Improved Spell Recovery
			expect(
				attrs.skills.some(
					(skill) => skill.name === "Improved Spell Recovery"
				)
			).toBe(true);
		});

		test("Magician should have appropriate spell choices at each level", () => {
			// Level 1 - check for tradition discovery
			magicianCharacter.levelUp();
			let choices = magicianCharacter.getAvailableChoices();
			let spellChoices = choices.filter(
				(c) => c.location.level === 1 && c.config.type === "spell"
			);

			expect(spellChoices.length).toBe(1);
			if (spellChoices[0]?.config.type === "spell") {
				expect(spellChoices[0].config.count).toBe(4);
				expect(spellChoices[0].config.specificSpells).toContain(
					"senseMagic"
				);
				expect(spellChoices[0].config.choices[0].type).toBe(
					"discoverTradition"
				);
			}

			// Level 2 - check for spell learning
			magicianCharacter.levelUp();
			choices = magicianCharacter.getAvailableChoices();
			spellChoices = choices.filter(
				(c) => c.location.level === 2 && c.config.type === "spell"
			);

			expect(spellChoices.length).toBe(1);
			if (spellChoices[0]?.config.type === "spell") {
				expect(spellChoices[0].config.count).toBe(2);
				expect(spellChoices[0].config.choices[0].type).toBe(
					"learnSpell"
				);
			}
		});
	});

	describe("Priest Path", () => {
		let priestCharacter: Character;

		beforeEach(() => {
			priestCharacter = priestCharacterFactory();
		});

		test("Initial priest attributes", () => {
			const attrs = priestCharacter.attributes;
			expect(attrs.power).toBe(0); // Starts at 0 before leveling
			expect(attrs.health).toBe(11); // Base human health
		});

		test("Level 1 priest abilities", () => {
			priestCharacter.levelUp();
			const attrs = priestCharacter.attributes;

			expect(attrs.power).toBe(1);
			expect(attrs.health).toBe(15); // Base 11 + 4 from level 1 priest

			// Check for Shared Recovery
			expect(
				attrs.skills.some((skill) => skill.name === "Shared Recovery")
			).toBe(true);
		});

		test("Level 2 priest abilities", () => {
			priestCharacter.levelUp();
			priestCharacter.levelUp();
			const attrs = priestCharacter.attributes;

			expect(attrs.power).toBe(1);
			expect(attrs.health).toBe(19); // Base 11 + 4 + 4

			// Check for Prayer
			expect(attrs.skills.some((skill) => skill.name === "Prayer")).toBe(
				true
			);
		});

		test("Level 5 priest abilities", () => {
			for (let i = 0; i < 5; i++) priestCharacter.levelUp();
			const attrs = priestCharacter.attributes;

			expect(attrs.power).toBe(2);
			expect(attrs.health).toBe(28); // Base 11 + (4 * 5) + ancestry bonus at level 4

			// Check for Divine Strike
			expect(
				attrs.skills.some((skill) => skill.name === "Divine Strike")
			).toBe(true);
		});

		test("Level 8 priest abilities", () => {
			for (let i = 0; i < 8; i++) priestCharacter.levelUp();
			const attrs = priestCharacter.attributes;

			expect(attrs.power).toBe(2);
			expect(attrs.health).toBe(32); // Base 11 + (4 * 8) + ancestry bonus at level 4

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

		test("Priest should have appropriate spell choices at each level", () => {
			// Level 1
			priestCharacter.levelUp();
			let choices = priestCharacter.getAvailableChoices();
			let spellChoices = choices.filter(
				(c) => c.location.level === 1 && c.config.type === "spell"
			);

			expect(spellChoices.length).toBe(2);

			// First choice - tradition discovery
			if (spellChoices[0]?.config.type === "spell") {
				expect(spellChoices[0].config.count).toBe(1);
				expect(spellChoices[0].config.choices[0].type).toBe(
					"discoverTradition"
				);
			}

			// Second choice - learn spells
			if (spellChoices[1]?.config.type === "spell") {
				expect(spellChoices[1].config.count).toBe(2);
				expect(spellChoices[1].config.choices[0].type).toBe(
					"learnSpell"
				);
			}

			// Level 2
			priestCharacter.levelUp();
			choices = priestCharacter.getAvailableChoices();
			spellChoices = choices.filter(
				(c) => c.location.level === 2 && c.config.type === "spell"
			);

			expect(spellChoices.length).toBe(1);
			if (spellChoices[0]?.config.type === "spell") {
				expect(spellChoices[0].config.count).toBe(2);
				expect(spellChoices[0].config.choices[0].type).toBe(
					"learnSpell"
				);
			}
		});
	});

	describe("Spell Power Levels", () => {
		test("Available spells are limited by character power", () => {
			const character = magicianCharacterFactory();
			character.levelUp(); // Level 1, power = 1

			// Get level 1 spell choices
			const choices = character.getAvailableChoices();
			const spellChoice = choices.find(
				(c) => c.location.level === 1 && c.config.type === "spell"
			);

			if (spellChoice?.config.type === "spell") {
				const registry = SpellRegistry.getInstance();
				const availableSpells = registry.getAvailableSpellsForChoice(
					spellChoice.config,
					character.attributes.power
				);

				// At level 1, power is 1, so only rank 0-1 spells should be available
				expect(
					Math.max(...availableSpells.map((s) => s.rank))
				).toBeLessThanOrEqual(1);
			}

			// Level up to 5, power should be 2
			for (let i = 1; i < 5; i++) character.levelUp();
			expect(character.attributes.power).toBe(2);

			// Get level 5 spell choices
			const choicesLevel5 = character.getAvailableChoices();
			const spellChoiceLevel5 = choicesLevel5.find(
				(c) => c.location.level === 5 && c.config.type === "spell"
			);

			if (spellChoiceLevel5?.config.type === "spell") {
				const registry = SpellRegistry.getInstance();
				const availableSpells = registry.getAvailableSpellsForChoice(
					spellChoiceLevel5.config,
					character.attributes.power
				);

				// At level 5, power is 2, so rank 0-2 spells should be available
				expect(
					Math.max(...availableSpells.map((s) => s.rank))
				).toBeLessThanOrEqual(2);
			}
		});
	});
});
