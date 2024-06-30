import { Character } from "../characters";
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

	test("Initial level attributes", () => {
		const attrs = character.attributes;
		expect(attrs.health).toBe(10);
		expect(attrs.defense).toBe(10);
		expect(attrs.healingRate).toBe(2);
		expect(attrs.speed).toBe(10);
		expect(attrs.languages).toContain("Common");
		expect(attrs.professions).toContain("Warrior");
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

	test("Attributes after leveling up to level 4", () => {
		levelUpBy(character, 4);
		expect(character.level).toBe(4);
		const attrs = character.attributes;
		expect(attrs.health).toBe(28);
		expect(attrs.defense).toBe(10);
		expect(attrs.healingRate).toBe(7);
	});
});
