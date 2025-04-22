import fs from "fs";
import path from "path";
import { Novice } from "../attributes";
import { createPathFromData } from "../factories/pathFactory";

describe("Paths loader", () => {
	describe("Novice paths from JSON", () => {
		// Directory containing the novice path JSON files
		const novicePathsDir = path.resolve(__dirname, "../data/paths/novice");

		// Get all JSON files in the directory
		const pathFiles = fs
			.readdirSync(novicePathsDir)
			.filter((file) => file.endsWith(".json"));

		// Load each path and store in a map
		const loadedPaths = new Map<string, Novice>();

		for (const file of pathFiles) {
			// Read the file
			const filePath = path.join(novicePathsDir, file);
			const pathData = JSON.parse(fs.readFileSync(filePath, "utf8"));

			// Create the path object
			const pathObj = createPathFromData(pathData) as Novice;

			// Store in the map with the name as key
			loadedPaths.set(pathData.name, pathObj);
		}

		test("should load all novice paths from JSON files", () => {
			// Check if we loaded paths
			expect(loadedPaths.size).toBeGreaterThan(0);
			expect(loadedPaths.size).toEqual(pathFiles.length);

			// Log the names of loaded paths
			console.log(
				`Loaded ${loadedPaths.size} novice paths: ${Array.from(
					loadedPaths.keys()
				).join(", ")}`
			);
		});

		test("Warrior path should have combat-focused skills", () => {
			// Get the Warrior path
			const warrior = loadedPaths.get("Warrior");
			expect(warrior).toBeTruthy();

			if (warrior) {
				// Check for combat-related skills
				const skills = warrior.l1Mod.skills || [];
				const weaponTraining = skills.find(
					(s) => s.name === "Weapon Training"
				);
				expect(weaponTraining).toBeTruthy();

				// Check level 2 Combat Prowess
				const l2Skills = warrior.l2Mod.skills || [];
				const combatProwess = l2Skills.find(
					(s) => s.name === "Combat Prowess"
				);
				expect(combatProwess).toBeTruthy();
			}
		});

		test("Magician path should have spellcasting abilities", () => {
			// Get the Magician path
			const magician = loadedPaths.get("Magician");
			expect(magician).toBeTruthy();

			if (magician) {
				// Check for Power attribute increase
				expect(magician.l1Mod.power).toEqual(1);

				// Check for spellcasting skill
				const skills = magician.l1Mod.skills || [];
				const spellcasting = skills.find(
					(s) => s.name === "Spellcasting"
				);
				expect(spellcasting).toBeTruthy();

				// Check for spell tradition choice
				const choices = magician.l1Mod.getChoiceConfig();
				expect(choices).toBeTruthy();
			}
		});

		test("Priest path should have healing abilities", () => {
			// Get the Priest path
			const priest = loadedPaths.get("Priest");
			expect(priest).toBeTruthy();

			if (priest) {
				// Check for healing skill
				const skills = priest.l1Mod.skills || [];
				const healing = skills.find((s) => s.name === "Healing");
				expect(healing).toBeTruthy();

				// Check for Turn Undead at level 2
				const l2Skills = priest.l2Mod.skills || [];
				const turnUndead = l2Skills.find(
					(s) => s.name === "Turn Undead"
				);
				expect(turnUndead).toBeTruthy();

				// Check for Improved Healing at level 8
				const l8Skills = priest.l8Mod.skills || [];
				const improvedHealing = l8Skills.find(
					(s) => s.name === "Improved Healing"
				);
				expect(improvedHealing).toBeTruthy();
			}
		});
	});
});
