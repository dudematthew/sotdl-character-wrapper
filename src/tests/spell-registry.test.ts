import { Character } from "../character";
import { CORE_SPELLS, CORE_TRADITIONS } from "../data/spells";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import magicianNovicePath from "../instances/paths/novice/magicianNovicePath";
import { SpellRegistry } from "../spells/SpellRegistry";
import { SpellChoice, SpellChoiceOption } from "../types/spell";

describe("Spell Registry", () => {
	// Initialize registry before tests
	beforeEach(() => {
		// Clear registry first to ensure a clean state
		const registry = SpellRegistry.getInstance();
		registry.clear();

		// Register core traditions
		CORE_TRADITIONS.forEach((tradition) =>
			registry.registerTradition(tradition)
		);

		// Register core spells
		CORE_SPELLS.forEach((spell) => registry.registerSpell(spell));
	});

	describe("Spell Choice Validation", () => {
		test("SpellRegistry validates choices according to their type", () => {
			const registry = SpellRegistry.getInstance();

			// Create a spell choice configuration for testing
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
			const character = new Character(
				{ name: "TestMage" },
				humanAncestry
			);
			character.novicePath = magicianNovicePath;
			character.level = 1;

			// Get a spell choice
			const choices = character.getAvailableChoices();
			const spellChoice = choices.find(
				(c) => c.location.level === 1 && c.config.type === "spell"
			);

			if (spellChoice && spellChoice.config.type === "spell") {
				// Should work with regular spell choices
				const spellsForLearnSpell =
					registry.getAvailableSpellsForChoice(
						{
							...spellChoice.config,
							choices: [{ type: "learnSpell" }],
						},
						1, // power level
						0 // choice index
					);

				expect(spellsForLearnSpell.length).toBeGreaterThan(0);
				expect(
					Math.max(...spellsForLearnSpell.map((s) => s.rank))
				).toBeLessThanOrEqual(1);

				// Should return no spells for tradition discovery
				const spellsForTradition = registry.getAvailableSpellsForChoice(
					{
						...spellChoice.config,
						choices: [{ type: "discoverTradition" }],
					},
					1,
					0
				);

				expect(spellsForTradition.length).toBe(0);

				// Should work with flexible choices
				const spellsForFlexible = registry.getAvailableSpellsForChoice(
					{
						...spellChoice.config,
						choices: [{ type: "flexibleChoice" }],
					},
					1,
					0
				);

				expect(spellsForFlexible.length).toBeGreaterThan(0);
			}
		});

		test("SpellRegistry returns available traditions based on choice type", () => {
			const registry = SpellRegistry.getInstance();
			const character = new Character(
				{ name: "TestMage" },
				humanAncestry
			);
			character.novicePath = magicianNovicePath;
			character.level = 1;

			// Get a spell choice
			const choices = character.getAvailableChoices();
			const spellChoice = choices.find(
				(c) => c.location.level === 1 && c.config.type === "spell"
			);

			if (spellChoice && spellChoice.config.type === "spell") {
				// Should return traditions for tradition discovery
				const traditionsForDiscovery =
					registry.getAvailableTraditionsForChoice(
						{
							...spellChoice.config,
							choices: [{ type: "discoverTradition" }],
						},
						0, // choice index
						[] // discovered traditions
					);

				expect(traditionsForDiscovery.length).toBeGreaterThan(0);
				expect(
					traditionsForDiscovery.some((t) => t.id === "magician")
				).toBeTruthy();

				// Should return no traditions for spell learning
				const traditionsForSpell =
					registry.getAvailableTraditionsForChoice(
						{
							...spellChoice.config,
							choices: [{ type: "learnSpell" }],
						},
						0,
						[]
					);

				expect(traditionsForSpell.length).toBe(0);

				// Should work with flexible choices
				const traditionsForFlexible =
					registry.getAvailableTraditionsForChoice(
						{
							...spellChoice.config,
							choices: [{ type: "flexibleChoice" }],
						},
						0,
						[]
					);

				expect(traditionsForFlexible.length).toBeGreaterThan(0);
			}
		});
	});

	describe("Spell Descriptions", () => {
		test("Spell choice descriptions should be meaningful and helpful", () => {
			const character = new Character(
				{ name: "TestMage" },
				humanAncestry
			);
			character.novicePath = magicianNovicePath;
			character.level = 1;

			const choices = character.getAvailableChoices();
			const spellChoices = choices.filter(
				(c) => c.location.level === 1 && c.config.type === "spell"
			);

			expect(spellChoices.length).toBeGreaterThan(0);

			// Check spell choice descriptions
			if (spellChoices[0]?.config.type === "spell") {
				spellChoices[0].config.choices.forEach((choice) => {
					expect(choice.description).toBeDefined();
					expect(choice.description?.length).toBeGreaterThan(20);
				});
			}
		});
	});

	describe("Spell Power Limitations", () => {
		test("Spell power level is limited by character power", () => {
			const registry = SpellRegistry.getInstance();

			// Create a mock spell choice config
			const spellChoice: SpellChoice = {
				type: "spell",
				count: 1,
				choices: [{ type: "learnSpell" }],
			};

			// Check spells at power level 1
			const spellsAtPower1 = registry.getAvailableSpellsForChoice(
				spellChoice,
				1,
				0
			);

			if (spellsAtPower1.length > 0) {
				expect(
					Math.max(...spellsAtPower1.map((s) => s.rank))
				).toBeLessThanOrEqual(1);
			}

			// Check spells at power level 2
			const spellsAtPower2 = registry.getAvailableSpellsForChoice(
				spellChoice,
				2,
				0
			);

			if (spellsAtPower2.length > 0) {
				expect(
					Math.max(...spellsAtPower2.map((s) => s.rank))
				).toBeLessThanOrEqual(2);
			}

			// Higher power level should include more spells
			expect(spellsAtPower2.length).toBeGreaterThanOrEqual(
				spellsAtPower1.length
			);
		});
	});
});
