import { Character } from "../character";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import { createPathFromData } from "../factories/pathFactory";
import fs from "fs";
import path from "path";
import { Novice, Expert, Master } from "../attributes";

describe("Character with Master Path", () => {
	// Define a test character with all path types
	let testCharacter: Character;

	// Create paths from JSON
	const novicePathData = JSON.parse(
		fs.readFileSync(
			path.resolve(
				__dirname,
				"../data/paths/novice/warriorNovicePath.json"
			),
			"utf8"
		)
	);
	const expertPathData = JSON.parse(
		fs.readFileSync(
			path.resolve(
				__dirname,
				"../data/paths/expert/berserkerExpertPath.json"
			),
			"utf8"
		)
	);
	const masterPathData = JSON.parse(
		fs.readFileSync(
			path.resolve(
				__dirname,
				"../data/paths/master/warlordMasterPath.json"
			),
			"utf8"
		)
	);

	beforeEach(() => {
		// Create a fresh character for each test
		testCharacter = new Character({ name: "Master Tester" }, humanAncestry);

		// Create and assign paths with proper type assertions
		const novicePath = createPathFromData(novicePathData) as Novice;
		const expertPath = createPathFromData(expertPathData) as Expert;
		const masterPath = createPathFromData(masterPathData) as Master;

		testCharacter.novicePath = novicePath;
		testCharacter.expertPath = expertPath;
		testCharacter.masterPath = masterPath;
	});

	test("Level 1-4 should only have Novice path abilities", () => {
		// Level 1
		testCharacter.levelUp();
		expect(testCharacter.level).toBe(1);

		// Should have warrior abilities
		const level1Skills = testCharacter.attributes.skills;
		expect(
			level1Skills.some((s) => s.name === "Catch Your Breath")
		).toBeTruthy();
		expect(
			level1Skills.some((s) => s.name === "Weapon Training")
		).toBeTruthy();

		// Should NOT have expert or master abilities
		expect(level1Skills.some((s) => s.name === "Rage")).toBeFalsy();
		expect(
			level1Skills.some((s) => s.name === "Battlefield Prowess")
		).toBeFalsy();

		// Level up to 2
		testCharacter.levelUp();
		const level2Skills = testCharacter.attributes.skills;
		expect(
			level2Skills.some((s) => s.name === "Combat Prowess")
		).toBeTruthy();

		// Still no expert or master abilities
		expect(level2Skills.some((s) => s.name === "Rage")).toBeFalsy();
	});

	test("Level 5+ should include Novice and Expert path abilities", () => {
		// Level up to 5
		for (let i = 0; i < 5; i++) {
			testCharacter.levelUp();
		}

		const level5Skills = testCharacter.attributes.skills;

		// Should have level 5 warrior abilities
		expect(
			level5Skills.some((s) => s.name === "Combat Expertise")
		).toBeTruthy();

		// Should have level 3 berserker abilities
		expect(level5Skills.some((s) => s.name === "Rage")).toBeTruthy();
		expect(level5Skills.some((s) => s.name === "Thick Skin")).toBeTruthy();

		// Should NOT have master abilities yet
		expect(
			level5Skills.some((s) => s.name === "Battlefield Prowess")
		).toBeFalsy();
	});

	test("Level 7+ should include all path abilities", () => {
		// Level up to 7
		for (let i = 0; i < 7; i++) {
			testCharacter.levelUp();
		}

		const level7Skills = testCharacter.attributes.skills;

		// Should have novice path abilities
		expect(
			level7Skills.some((s) => s.name === "Combat Expertise")
		).toBeTruthy();

		// Should have expert path abilities
		expect(level7Skills.some((s) => s.name === "Rage")).toBeTruthy();
		expect(
			level7Skills.some((s) => s.name === "Danger Sense")
		).toBeTruthy();

		// Should have master path abilities for level 7
		expect(
			level7Skills.some((s) => s.name === "Battlefield Prowess")
		).toBeTruthy();
		expect(
			level7Skills.some((s) => s.name === "Tactical Command")
		).toBeTruthy();

		// Should NOT have level 10 master abilities yet
		expect(
			level7Skills.some((s) => s.name === "Strategic Mind")
		).toBeFalsy();
	});

	test("Level 10 should have all highest level abilities", () => {
		// Level up to 10
		for (let i = 0; i < 10; i++) {
			testCharacter.levelUp();
		}

		const level10Skills = testCharacter.attributes.skills;

		// Should have all novice path abilities
		expect(
			level10Skills.some((s) => s.name === "Combat Mastery")
		).toBeTruthy();
		expect(level10Skills.some((s) => s.name === "Grit")).toBeTruthy();

		// Should have all expert path abilities
		expect(
			level10Skills.some((s) => s.name === "Unending Rage")
		).toBeTruthy();
		expect(
			level10Skills.some((s) => s.name === "Frightening")
		).toBeTruthy();

		// Should have all master path abilities
		expect(
			level10Skills.some((s) => s.name === "Strategic Mind")
		).toBeTruthy();
		expect(
			level10Skills.some((s) => s.name === "Stand Against the Horde")
		).toBeTruthy();

		// Check defense bonus from master path
		expect(testCharacter.attributes.defense).toBeGreaterThan(10);
	});

	test("Character statistics should scale properly with level", () => {
		// Level 1
		testCharacter.levelUp();
		const level1Health = testCharacter.attributes.health;

		// Level 4
		testCharacter.levelUp();
		testCharacter.levelUp();
		testCharacter.levelUp();
		const level4Health = testCharacter.attributes.health;
		expect(level4Health).toBeGreaterThan(level1Health);

		// Level 7
		testCharacter.levelUp();
		testCharacter.levelUp();
		testCharacter.levelUp();
		const level7Health = testCharacter.attributes.health;
		expect(level7Health).toBeGreaterThan(level4Health);

		// Level 10
		testCharacter.levelUp();
		testCharacter.levelUp();
		testCharacter.levelUp();
		const level10Health = testCharacter.attributes.health;
		expect(level10Health).toBeGreaterThan(level7Health);

		// By level 10, health should be significantly higher
		expect(level10Health - level1Health).toBeGreaterThanOrEqual(20);
	});
});
