import { Character } from "../characters";
import peterCharacterFactory from "../instances/charactersFactories/priestCharacterFactory";

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
});
