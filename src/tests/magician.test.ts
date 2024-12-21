import { Character } from "../characters";
import magicianCharacterFactory from "../instances/charactersFactories/magicianCharacterFactory";
import { SpellRegistry } from "../spells/SpellRegistry";
import { SpellChoice, SpellChoiceOption } from "../types/spell";

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
			expect(spellChoice.config.specificSpells).toContain("senseMagic"); // Should include Sense Magic

			// Verify choice structure
			expect(spellChoice.config.choices.length).toBe(4);
			expect(spellChoice.config.choices[0].type).toBe(
				"discoverTradition"
			); // First must be tradition discovery
			expect(spellChoice.config.choices[1].type).toBe("flexibleChoice"); // Rest are flexible
			expect(spellChoice.config.choices[2].type).toBe("flexibleChoice");
			expect(spellChoice.config.choices[3].type).toBe("flexibleChoice");

			// Check available spell ranks
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
			expect(spellChoice.config.count).toBe(1); // Should be able to make one choice
			expect(spellChoice.config.choices.length).toBe(1);
			expect(spellChoice.config.choices[0].type).toBe("flexibleChoice"); // Can either discover tradition or learn spell

			// Check available spell ranks
			const registry = SpellRegistry.getInstance();
			const availableSpells = registry.getAvailableSpellsForChoice(
				spellChoice.config,
				character.attributes.power
			);
			// At level 5, power is 2, so only rank 0-2 spells should be available
			expect(
				Math.max(...availableSpells.map((s) => s.rank))
			).toBeLessThanOrEqual(2);
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

			// Check available spell ranks
			const registry = SpellRegistry.getInstance();
			const availableSpells = registry.getAvailableSpellsForChoice(
				spellChoice.config,
				character.attributes.power
			);
			// At level 8, power is still 2, so only rank 0-2 spells should be available
			expect(
				Math.max(...availableSpells.map((s) => s.rank))
			).toBeLessThanOrEqual(2);
		}
	});

	test("Spell power levels are based on character power at choice level", () => {
		// Level 1: Power 1
		character.levelUp();
		let choices = character.getAvailableChoices();
		let spellChoice = choices.find(
			(c) => c.location.level === 1 && c.config.type === "spell"
		);
		expect(spellChoice).toBeDefined();
		if (spellChoice && spellChoice.config.type === "spell") {
			const registry = SpellRegistry.getInstance();
			const availableSpells = registry.getAvailableSpellsForChoice(
				spellChoice.config,
				character.attributes.power
			);
			// At level 1, power is 1, so only rank 0-1 spells should be available
			const maxRank = Math.max(...availableSpells.map((s) => s.rank));
			expect(maxRank).toBeLessThanOrEqual(1);
		}

		// Level 5: Power 2
		for (let i = 0; i < 4; i++) character.levelUp();
		choices = character.getAvailableChoices();
		spellChoice = choices.find(
			(c) => c.location.level === 5 && c.config.type === "spell"
		);
		expect(spellChoice).toBeDefined();
		if (spellChoice && spellChoice.config.type === "spell") {
			const registry = SpellRegistry.getInstance();
			const availableSpells = registry.getAvailableSpellsForChoice(
				spellChoice.config,
				character.attributes.power
			);
			// At level 5, power is 2, so only rank 0-2 spells should be available
			const maxRank = Math.max(...availableSpells.map((s) => s.rank));
			expect(maxRank).toBeLessThanOrEqual(2);
		}

		// Level 8: Power 2 (unchanged)
		for (let i = 0; i < 3; i++) character.levelUp();
		choices = character.getAvailableChoices();
		spellChoice = choices.find(
			(c) => c.location.level === 8 && c.config.type === "spell"
		);
		expect(spellChoice).toBeDefined();
		if (spellChoice && spellChoice.config.type === "spell") {
			const registry = SpellRegistry.getInstance();
			const availableSpells = registry.getAvailableSpellsForChoice(
				spellChoice.config,
				character.attributes.power
			);
			// At level 8, power is 2, so only rank 0-2 spells should be available
			const maxRank = Math.max(...availableSpells.map((s) => s.rank));
			expect(maxRank).toBeLessThanOrEqual(2);
		}
	});

	test("Can make spell choices according to choice type", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const spellChoice = choices.find(
			(c) => c.location.level === 1 && c.config.type === "spell"
		);

		expect(spellChoice).toBeDefined();
		if (spellChoice && spellChoice.config.type === "spell") {
			// First choice must be tradition discovery
			character.setChoice(spellChoice.location, {
				...spellChoice.config,
				selectedChoices: [
					{
						type: "discoverTradition",
						traditionId: "magician",
					},
				],
			});

			// Verify the choice was saved
			const savedChoice = character.getChoice(spellChoice.location);
			expect(savedChoice).toBeDefined();
			if (savedChoice && savedChoice.type === "spell") {
				const firstChoice = savedChoice.selectedChoices?.[0];
				expect(firstChoice?.type).toBe("discoverTradition");
				if (firstChoice?.type === "discoverTradition") {
					expect(firstChoice.traditionId).toBe("magician");
				}
			}

			// Second choice can be either tradition or spell (flexible)
			character.setChoice(spellChoice.location, {
				...spellChoice.config,
				selectedChoices: [
					{
						type: "discoverTradition",
						traditionId: "magician",
					},
					{
						type: "learnSpell",
						spellId: "senseMagic",
					},
				],
			});

			// Verify both choices were saved
			const savedChoices = character.getChoice(spellChoice.location);
			if (savedChoices && savedChoices.type === "spell") {
				expect(savedChoices.selectedChoices?.length).toBe(2);
				expect(savedChoices.selectedChoices?.[0].type).toBe(
					"discoverTradition"
				);
				expect(savedChoices.selectedChoices?.[1].type).toBe(
					"learnSpell"
				);
			}
		}
	});

	test("Level 5 flexible choice allows either tradition or spell", () => {
		// Level up to 5
		for (let i = 0; i < 5; i++) character.levelUp();

		const choices = character.getAvailableChoices();
		const spellChoice = choices.find(
			(c) => c.location.level === 5 && c.config.type === "spell"
		);

		expect(spellChoice).toBeDefined();
		if (spellChoice && spellChoice.config.type === "spell") {
			// Can choose to discover tradition
			character.setChoice(spellChoice.location, {
				...spellChoice.config,
				selectedChoices: [
					{
						type: "discoverTradition",
						traditionId: "magician",
					},
				],
			});

			let savedChoice = character.getChoice(spellChoice.location);
			expect(savedChoice).toBeDefined();
			if (savedChoice && savedChoice.type === "spell") {
				expect(savedChoice.selectedChoices?.[0].type).toBe(
					"discoverTradition"
				);
			}

			// Or can choose to learn spell
			character.setChoice(spellChoice.location, {
				...spellChoice.config,
				selectedChoices: [
					{
						type: "learnSpell",
						spellId: "senseMagic",
					},
				],
			});

			savedChoice = character.getChoice(spellChoice.location);
			expect(savedChoice).toBeDefined();
			if (savedChoice && savedChoice.type === "spell") {
				expect(savedChoice.selectedChoices?.[0].type).toBe(
					"learnSpell"
				);
			}
		}
	});

	test("Level 2 choices must be spells", () => {
		// Level up to 2
		for (let i = 0; i < 2; i++) character.levelUp();

		const choices = character.getAvailableChoices();
		const spellChoice = choices.find(
			(c) => c.location.level === 2 && c.config.type === "spell"
		);

		expect(spellChoice).toBeDefined();
		if (spellChoice && spellChoice.config.type === "spell") {
			// Both choices must be learnSpell
			expect(
				spellChoice.config.choices.every((c) => c.type === "learnSpell")
			).toBe(true);

			// Set both spell choices
			character.setChoice(spellChoice.location, {
				...spellChoice.config,
				selectedChoices: [
					{
						type: "learnSpell",
						spellId: "senseMagic",
					},
					{
						type: "learnSpell",
						spellId: "senseMagic",
					},
				],
			});

			const savedChoice = character.getChoice(spellChoice.location);
			expect(savedChoice).toBeDefined();
			if (savedChoice && savedChoice.type === "spell") {
				expect(savedChoice.selectedChoices?.length).toBe(2);
				expect(
					savedChoice.selectedChoices?.every(
						(c) => c.type === "learnSpell"
					)
				).toBe(true);
			}
		}
	});

	test("SpellRegistry validates choices according to their type", () => {
		const registry = SpellRegistry.getInstance();
		const spellChoice: SpellChoice = {
			type: "spell",
			count: 3,
			choices: [
				{ type: "discoverTradition" },
				{ type: "learnSpell" },
				{ type: "flexibleChoice" },
			],
			specificSpells: ["senseMagic"],
		};

		// Valid choices
		expect(
			registry.validateSpellChoice(spellChoice, [
				{ type: "discoverTradition", traditionId: "magician" },
				{ type: "learnSpell", spellId: "senseMagic" },
				{ type: "learnSpell", spellId: "senseMagic" },
			])
		).toBe(true);

		// Invalid: wrong type for first choice
		expect(
			registry.validateSpellChoice(spellChoice, [
				{ type: "learnSpell", spellId: "senseMagic" },
				{ type: "learnSpell", spellId: "senseMagic" },
				{ type: "learnSpell", spellId: "senseMagic" },
			])
		).toBe(false);

		// Invalid: too many choices
		expect(
			registry.validateSpellChoice(spellChoice, [
				{ type: "discoverTradition", traditionId: "magician" },
				{ type: "learnSpell", spellId: "senseMagic" },
				{ type: "learnSpell", spellId: "senseMagic" },
				{ type: "learnSpell", spellId: "senseMagic" },
			])
		).toBe(false);
	});

	test("SpellRegistry returns appropriate spells based on choice type", () => {
		const registry = SpellRegistry.getInstance();
		const spellChoice: SpellChoice = {
			type: "spell",
			count: 3,
			choices: [
				{ type: "discoverTradition" },
				{ type: "learnSpell" },
				{ type: "flexibleChoice" },
			],
			specificSpells: ["senseMagic"],
		};

		// For discoverTradition choice type, no spells should be available
		const traditionSpells = registry.getAvailableSpellsForChoice(
			spellChoice,
			1,
			0
		);
		expect(traditionSpells.length).toBe(0);

		// For learnSpell choice type, spells should be available
		const learnSpells = registry.getAvailableSpellsForChoice(
			spellChoice,
			1,
			1
		);
		expect(learnSpells.length).toBeGreaterThan(0);

		// For flexibleChoice type, spells should be available
		const flexibleSpells = registry.getAvailableSpellsForChoice(
			spellChoice,
			1,
			2
		);
		expect(flexibleSpells.length).toBeGreaterThan(0);
	});

	test("SpellRegistry returns available traditions based on choice type", () => {
		const registry = SpellRegistry.getInstance();
		const spellChoice: SpellChoice = {
			type: "spell",
			count: 3,
			choices: [
				{ type: "discoverTradition" },
				{ type: "learnSpell" },
				{ type: "flexibleChoice" },
			],
		};

		// For discoverTradition choice type, traditions should be available
		const traditions = registry.getAvailableTraditionsForChoice(
			spellChoice,
			0,
			[]
		);
		expect(traditions.length).toBeGreaterThan(0);

		// For learnSpell choice type, no traditions should be available
		const noTraditions = registry.getAvailableTraditionsForChoice(
			spellChoice,
			1,
			[]
		);
		expect(noTraditions.length).toBe(0);

		// For flexibleChoice type, traditions should be available
		const flexibleTraditions = registry.getAvailableTraditionsForChoice(
			spellChoice,
			2,
			[]
		);
		expect(flexibleTraditions.length).toBeGreaterThan(0);

		// Already discovered traditions should be filtered out
		const filteredTraditions = registry.getAvailableTraditionsForChoice(
			spellChoice,
			0,
			["magician"]
		);
		expect(filteredTraditions.length).toBe(0);
	});
});
