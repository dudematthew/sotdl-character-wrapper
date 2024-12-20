import { Character } from "../characters";
import { AttributeModifier } from "../attributes/AttributeModifier";
import { Ancestry } from "../characters/Ancestry";
import { Novice } from "../attributes/Novice";
import edwardCharacterFactory from "../instances/charactersFactories/edwardCharacterFactory";
import {
	AttributeChoiceConfig,
	SkillChoiceConfig,
	mainAttributes,
} from "../types";

describe("Character Choice System", () => {
	let character: Character;

	beforeEach(() => {
		character = edwardCharacterFactory();
	});

	test("Initial character has no choices at level 0", () => {
		const choices = character.getAvailableChoices();
		expect(choices.length).toBe(0);
	});

	test("Character has novice path choices at level 1", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const noviceChoices = choices.filter(
			(c) => c.location.source === "novicePath" && c.location.level === 1
		);

		expect(noviceChoices.length).toBe(1);
		const choice = noviceChoices[0].config as AttributeChoiceConfig;
		expect(choice.type).toBe("attribute");
		expect(choice.count).toBe(2);
		expect(choice.availableAttributes).toContain("strength");
		expect(choice.availableAttributes).toContain("agility");
	});

	test("Can set and retrieve attribute choices", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const noviceChoice = choices.find(
			(c) => c.location.source === "novicePath" && c.location.level === 1
		);

		expect(noviceChoice).toBeDefined();
		if (noviceChoice && noviceChoice.config.type === "attribute") {
			character.setChoice(noviceChoice.location, {
				...noviceChoice.config,
				selectedAttributes: ["strength", "agility"],
			});

			const savedChoice = character.getChoice(noviceChoice.location);
			expect(savedChoice).toBeDefined();
			if (savedChoice && savedChoice.type === "attribute") {
				expect(savedChoice.selectedAttributes).toEqual([
					"strength",
					"agility",
				]);
			}
		}
	});

	test("Character has ancestry choices at level 4", () => {
		// Level up to 4
		for (let i = 0; i < 4; i++) {
			character.levelUp();
		}

		const choices = character.getAvailableChoices();
		const ancestryChoices = choices.filter(
			(c) => c.location.source === "ancestry" && c.location.level === 4
		);

		expect(ancestryChoices.length).toBe(1);
		const choice = ancestryChoices[0].config as SkillChoiceConfig;
		expect(choice.type).toBe("skill");
		expect(
			choice.availableSkills.some((skill) => skill.name === "Determined")
		).toBe(true);
	});

	test("Choices affect character attributes", () => {
		character.levelUp();
		const choices = character.getAvailableChoices();
		const noviceChoice = choices.find(
			(c) => c.location.source === "novicePath" && c.location.level === 1
		);

		if (noviceChoice && noviceChoice.config.type === "attribute") {
			character.setChoice(noviceChoice.location, {
				...noviceChoice.config,
				selectedAttributes: ["strength", "strength"],
			});

			const attrs = character.attributes;
			// Verify that strength was increased twice
			expect(attrs.strength).toBe(12); // Base 10 + 2 from choices
		}
	});

	test("Invalid choices are removed when changing path", () => {
		// Setup initial path and choices
		character.levelUp();
		const initialChoices = character.getAvailableChoices();
		const noviceChoice = initialChoices.find(
			(c) => c.location.source === "novicePath" && c.location.level === 1
		);

		if (noviceChoice && noviceChoice.config.type === "attribute") {
			character.setChoice(noviceChoice.location, {
				...noviceChoice.config,
				selectedAttributes: ["strength", "agility"],
			});
		}

		// Create new path with different available attributes
		const newPath = new Novice(
			new AttributeModifier(
				{},
				{
					type: "attribute",
					count: 2,
					increaseBy: 1,
					availableAttributes: ["intellect", "will"],
				}
			),
			new AttributeModifier({}, undefined),
			new AttributeModifier({}, undefined),
			new AttributeModifier({}, undefined)
		);

		// Change path
		character.novicePath = newPath;

		// Verify old choices were removed
		const savedChoice = character.getChoice({
			source: "novicePath",
			level: 1,
		});
		expect(savedChoice).toBeUndefined();
	});

	test("Partially valid choices are preserved when changing path", () => {
		// Setup initial path and choices
		character.levelUp();
		const initialChoices = character.getAvailableChoices();
		const noviceChoice = initialChoices.find(
			(c) => c.location.source === "novicePath" && c.location.level === 1
		);

		if (noviceChoice && noviceChoice.config.type === "attribute") {
			character.setChoice(noviceChoice.location, {
				...noviceChoice.config,
				selectedAttributes: ["strength", "agility"],
			});
		}

		// Create new path that includes strength but not agility
		const newPath = new Novice(
			new AttributeModifier(
				{},
				{
					type: "attribute",
					count: 2,
					increaseBy: 1,
					availableAttributes: ["strength", "intellect"],
				}
			),
			new AttributeModifier({}, undefined),
			new AttributeModifier({}, undefined),
			new AttributeModifier({}, undefined)
		);

		// Change path
		character.novicePath = newPath;

		// Verify only valid choices were preserved
		const savedChoice = character.getChoice({
			source: "novicePath",
			level: 1,
		});
		expect(savedChoice).toBeDefined();
		if (savedChoice && savedChoice.type === "attribute") {
			expect(savedChoice.selectedAttributes).toEqual(["strength"]);
		}
	});

	test("Choices are validated when changing ancestry", () => {
		// Level up to 4 and set ancestry choice
		for (let i = 0; i < 4; i++) {
			character.levelUp();
		}

		const initialChoices = character.getAvailableChoices();
		const ancestryChoice = initialChoices.find(
			(c) => c.location.source === "ancestry" && c.location.level === 4
		);

		if (ancestryChoice && ancestryChoice.config.type === "skill") {
			character.setChoice(ancestryChoice.location, {
				...ancestryChoice.config,
				selectedSkills: [
					{
						name: "Determined",
						description:
							"You gain 1 Fortune point at the start of each session.",
					},
				],
			});
		}

		// Create new ancestry with different available skills
		const newAncestry = new Ancestry(
			{ strength: 10, agility: 10, intellect: 10, will: 10 },
			character.ancestry.secondaryAttributeRules,
			new AttributeModifier(
				{},
				{
					type: "skill",
					count: 1,
					availableSkills: [
						{
							name: "Different Skill",
							description: "A different skill description",
						},
					],
				}
			)
		);

		// Change ancestry
		character.ancestry = newAncestry;

		// Verify old choices were removed
		const savedChoice = character.getChoice({
			source: "ancestry",
			level: 4,
		});
		expect(savedChoice).toBeUndefined();
	});

	describe("Choice Validation Configuration", () => {
		test("Validation can be disabled for path changes", () => {
			// Setup initial path and choices
			character.levelUp();
			const initialChoices = character.getAvailableChoices();
			const noviceChoice = initialChoices.find(
				(c) =>
					c.location.source === "novicePath" && c.location.level === 1
			);

			if (noviceChoice && noviceChoice.config.type === "attribute") {
				character.setChoice(noviceChoice.location, {
					...noviceChoice.config,
					selectedAttributes: ["strength", "agility"],
				});
			}

			// Disable validation
			character.setValidationConfig({ validateOnPathChange: false });

			// Create new path with different attributes
			const newPath = new Novice(
				new AttributeModifier(
					{},
					{
						type: "attribute",
						count: 2,
						increaseBy: 1,
						availableAttributes: ["intellect", "will"],
					}
				),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined)
			);

			// Change path
			character.novicePath = newPath;

			// Verify choices were preserved
			const savedChoice = character.getChoice({
				source: "novicePath",
				level: 1,
			});
			expect(savedChoice).toBeDefined();
			if (savedChoice && savedChoice.type === "attribute") {
				expect(savedChoice.selectedAttributes).toEqual([
					"strength",
					"agility",
				]);
			}
		});

		test("getInvalidChoices returns choices that would be removed", () => {
			// Setup initial path and choices
			character.levelUp();
			const initialChoices = character.getAvailableChoices();
			const noviceChoice = initialChoices.find(
				(c) =>
					c.location.source === "novicePath" && c.location.level === 1
			);

			if (noviceChoice && noviceChoice.config.type === "attribute") {
				character.setChoice(noviceChoice.location, {
					...noviceChoice.config,
					selectedAttributes: ["strength", "agility"],
				});
			}

			// Create new path with only intellect
			const newPath = new Novice(
				new AttributeModifier(
					{},
					{
						type: "attribute",
						count: 1,
						increaseBy: 1,
						availableAttributes: ["intellect"],
					}
				),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined)
			);

			// Temporarily set the path to check what would be invalid
			const oldPath = character.novicePath;
			character.setValidationConfig({ validateOnPathChange: false });
			character.novicePath = newPath;

			const invalidChoices = character.getInvalidChoices("novicePath");
			expect(invalidChoices.length).toBe(1);
			const invalidChoice = invalidChoices[0];
			if (invalidChoice.type === "attribute") {
				expect(invalidChoice.selectedAttributes).toEqual([
					"strength",
					"agility",
				]);
			}

			// Restore the old path
			character.novicePath = oldPath;
			character.setValidationConfig({ validateOnPathChange: true });
		});

		test("clearChoices removes specific source choices", () => {
			// Setup choices for multiple sources
			character.levelUp();
			for (let i = 0; i < 3; i++) character.levelUp(); // Level 4 for ancestry choices

			// Set novice path choice
			const noviceChoice = character
				.getAvailableChoices()
				.find(
					(c) =>
						c.location.source === "novicePath" &&
						c.location.level === 1
				);
			if (noviceChoice && noviceChoice.config.type === "attribute") {
				character.setChoice(noviceChoice.location, {
					...noviceChoice.config,
					selectedAttributes: ["strength", "agility"],
				});
			}

			// Set ancestry choice
			const ancestryChoice = character
				.getAvailableChoices()
				.find(
					(c) =>
						c.location.source === "ancestry" &&
						c.location.level === 4
				);
			if (ancestryChoice && ancestryChoice.config.type === "skill") {
				character.setChoice(ancestryChoice.location, {
					...ancestryChoice.config,
					selectedSkills: [
						{
							name: "Determined",
							description:
								"You gain 1 Fortune point at the start of each session.",
						},
					],
				});
			}

			// Clear only novice path choices
			character.clearChoices("novicePath");

			// Verify novice choice was cleared but ancestry choice remains
			expect(
				character.getChoice({ source: "novicePath", level: 1 })
			).toBeUndefined();
			expect(
				character.getChoice({ source: "ancestry", level: 4 })
			).toBeDefined();
		});

		test("clearChoices with no argument removes all choices", () => {
			// Setup choices for multiple sources
			character.levelUp();
			for (let i = 0; i < 3; i++) character.levelUp(); // Level 4 for ancestry choices

			// Set novice path choice
			const noviceChoice = character
				.getAvailableChoices()
				.find(
					(c) =>
						c.location.source === "novicePath" &&
						c.location.level === 1
				);
			if (noviceChoice && noviceChoice.config.type === "attribute") {
				character.setChoice(noviceChoice.location, {
					...noviceChoice.config,
					selectedAttributes: ["strength", "agility"],
				});
			}

			// Set ancestry choice
			const ancestryChoice = character
				.getAvailableChoices()
				.find(
					(c) =>
						c.location.source === "ancestry" &&
						c.location.level === 4
				);
			if (ancestryChoice && ancestryChoice.config.type === "skill") {
				character.setChoice(ancestryChoice.location, {
					...ancestryChoice.config,
					selectedSkills: [
						{
							name: "Determined",
							description:
								"You gain 1 Fortune point at the start of each session.",
						},
					],
				});
			}

			// Clear all choices
			character.clearChoices();

			// Verify all choices were cleared
			expect(
				character.getChoice({ source: "novicePath", level: 1 })
			).toBeUndefined();
			expect(
				character.getChoice({ source: "ancestry", level: 4 })
			).toBeUndefined();
		});

		test("preserveInvalidChoices config keeps invalid choices", () => {
			// Setup initial path and choices
			character.levelUp();
			const initialChoices = character.getAvailableChoices();
			const noviceChoice = initialChoices.find(
				(c) =>
					c.location.source === "novicePath" && c.location.level === 1
			);

			if (noviceChoice && noviceChoice.config.type === "attribute") {
				character.setChoice(noviceChoice.location, {
					...noviceChoice.config,
					selectedAttributes: ["strength", "agility"],
				});
			}

			// Configure to preserve invalid choices
			character.setValidationConfig({
				validateOnPathChange: true,
				preserveInvalidChoices: true,
			});

			// Create new path with different attributes
			const newPath = new Novice(
				new AttributeModifier(
					{},
					{
						type: "attribute",
						count: 2,
						increaseBy: 1,
						availableAttributes: ["intellect", "will"],
					}
				),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined)
			);

			// Change path
			character.novicePath = newPath;

			// Verify invalid choices were preserved
			const savedChoice = character.getChoice({
				source: "novicePath",
				level: 1,
			});
			expect(savedChoice).toBeDefined();
			if (savedChoice && savedChoice.type === "attribute") {
				expect(savedChoice.selectedAttributes).toEqual([
					"strength",
					"agility",
				]);
			}
		});

		test("validation config can be changed multiple times", () => {
			character.levelUp();
			const initialChoices = character.getAvailableChoices();
			const noviceChoice = initialChoices.find(
				(c) =>
					c.location.source === "novicePath" && c.location.level === 1
			);

			if (noviceChoice && noviceChoice.config.type === "attribute") {
				character.setChoice(noviceChoice.location, {
					...noviceChoice.config,
					selectedAttributes: ["strength", "agility"],
				});
			}

			// Disable validation
			character.setValidationConfig({ validateOnPathChange: false });

			// Create first new path
			const newPath1 = new Novice(
				new AttributeModifier(
					{},
					{
						type: "attribute",
						count: 2,
						increaseBy: 1,
						availableAttributes: ["intellect", "will"],
					}
				),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined)
			);

			// Change path with validation disabled
			character.novicePath = newPath1;

			// Verify choices were preserved
			let savedChoice = character.getChoice({
				source: "novicePath",
				level: 1,
			});
			expect(savedChoice).toBeDefined();

			// Enable validation
			character.setValidationConfig({ validateOnPathChange: true });

			// Create second new path
			const newPath2 = new Novice(
				new AttributeModifier(
					{},
					{
						type: "attribute",
						count: 2,
						increaseBy: 1,
						availableAttributes: ["intellect", "will"],
					}
				),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined)
			);

			// Change path with validation enabled
			character.novicePath = newPath2;

			// Verify choices were removed
			savedChoice = character.getChoice({
				source: "novicePath",
				level: 1,
			});
			expect(savedChoice).toBeUndefined();
		});

		test("validation happens immediately after enabling", () => {
			character.levelUp();
			const initialChoices = character.getAvailableChoices();
			const noviceChoice = initialChoices.find(
				(c) =>
					c.location.source === "novicePath" && c.location.level === 1
			);

			if (noviceChoice && noviceChoice.config.type === "attribute") {
				character.setChoice(noviceChoice.location, {
					...noviceChoice.config,
					selectedAttributes: ["strength", "agility"],
				});
			}

			// Create new path with different attributes
			const newPath = new Novice(
				new AttributeModifier(
					{},
					{
						type: "attribute",
						count: 2,
						increaseBy: 1,
						availableAttributes: ["intellect", "will"],
					}
				),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined),
				new AttributeModifier({}, undefined)
			);

			// Disable validation and change path
			character.setValidationConfig({ validateOnPathChange: false });
			character.novicePath = newPath;

			// Verify choices were preserved
			let savedChoice = character.getChoice({
				source: "novicePath",
				level: 1,
			});
			expect(savedChoice).toBeDefined();

			// Enable validation - should validate immediately
			character.setValidationConfig({ validateOnPathChange: true });

			// Verify choices were removed
			savedChoice = character.getChoice({
				source: "novicePath",
				level: 1,
			});
			expect(savedChoice).toBeUndefined();
		});
	});
});
