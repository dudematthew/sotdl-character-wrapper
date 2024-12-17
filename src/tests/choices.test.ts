import { Character } from "../characters";
import edwardCharacterFactory from "../instances/charactersFactories/edwardCharacterFactory";
import { AttributeChoiceConfig, SkillChoiceConfig } from "../types";

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
});
