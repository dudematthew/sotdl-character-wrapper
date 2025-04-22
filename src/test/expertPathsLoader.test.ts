import fs from "fs";
import path from "path";
import { Expert } from "../attributes";
import { createPathFromData } from "../factories/pathFactory";
import { AttributeChoiceConfig } from "../types";

describe("Expert Paths loader", () => {
	describe("Expert paths from JSON", () => {
		// Directory containing the expert path JSON files
		const expertPathsDir = path.resolve(__dirname, "../data/paths/expert");

		// Get all JSON files in the directory
		const pathFiles = fs
			.readdirSync(expertPathsDir)
			.filter((file) => file.endsWith(".json"));

		// Load each path and store in a map
		const loadedPaths = new Map<string, Expert>();

		for (const file of pathFiles) {
			// Read the file
			const filePath = path.join(expertPathsDir, file);
			const pathData = JSON.parse(fs.readFileSync(filePath, "utf8"));

			// Create the path object
			const pathObj = createPathFromData(pathData) as Expert;

			// Store in the map with the name as key
			loadedPaths.set(pathData.name, pathObj);
		}

		test("should load all expert paths from JSON files", () => {
			// Check if we loaded paths
			expect(loadedPaths.size).toBeGreaterThan(0);
			expect(loadedPaths.size).toEqual(pathFiles.length);

			// Log the names of loaded paths
			console.log(
				`Loaded ${loadedPaths.size} expert paths: ${Array.from(
					loadedPaths.keys()
				).join(", ")}`
			);
		});

		test("Assassin path should have stealth-focused skills", () => {
			// Get the Assassin path
			const assassin = loadedPaths.get("Assassin");
			expect(assassin).toBeTruthy();

			if (assassin) {
				// Check for assassinate skill
				const skills = assassin.l3Mod.skills || [];
				const assassinate = skills.find(
					(s) => s.name === "Assassinate"
				);
				expect(assassinate).toBeTruthy();

				// Check for Perception bonus
				expect(assassin.l3Mod.perception).toEqual(1);

				// Check for Killer's Eye at level 9
				const l9Skills = assassin.l9Mod.skills || [];
				const killersEye = l9Skills.find(
					(s) => s.name === "Killer's Eye"
				);
				expect(killersEye).toBeTruthy();
			}
		});

		test("Berserker path should have rage abilities", () => {
			// Get the Berserker path
			const berserker = loadedPaths.get("Berserker");
			expect(berserker).toBeTruthy();

			if (berserker) {
				// Check for Rage skill
				const skills = berserker.l3Mod.skills || [];
				const rage = skills.find((s) => s.name === "Rage");
				expect(rage).toBeTruthy();

				// Check for Improved Rage at level 6
				const l6Skills = berserker.l6Mod.skills || [];
				const improvedRage = l6Skills.find(
					(s) => s.name === "Improved Rage"
				);
				expect(improvedRage).toBeTruthy();

				// Check for Unending Rage at level 9
				const l9Skills = berserker.l9Mod.skills || [];
				const unendingRage = l9Skills.find(
					(s) => s.name === "Unending Rage"
				);
				expect(unendingRage).toBeTruthy();
			}
		});

		test("Commander path should have leadership abilities", () => {
			// Get the Commander path
			const commander = loadedPaths.get("Commander");
			expect(commander).toBeTruthy();

			if (commander) {
				// Check for Battlefield Presence skill
				const skills = commander.l3Mod.skills || [];
				const battlefieldPresence = skills.find(
					(s) => s.name === "Battlefield Presence"
				);
				expect(battlefieldPresence).toBeTruthy();

				// Check for Rally skill
				const rally = skills.find((s) => s.name === "Rally");
				expect(rally).toBeTruthy();

				// Check for Battlefield Commander at level 9
				const l9Skills = commander.l9Mod.skills || [];
				const battlefieldCommander = l9Skills.find(
					(s) => s.name === "Battlefield Commander"
				);
				expect(battlefieldCommander).toBeTruthy();

				// Check for attribute choices
				const choiceConfig = commander.l3Mod.getChoiceConfig();
				// Convert to array if it's not already an array
				const choices = Array.isArray(choiceConfig)
					? choiceConfig
					: [choiceConfig];
				const attributeChoices = choices.filter(
					(choice) => choice && choice.type === "attribute"
				);
				expect(attributeChoices.length).toBeGreaterThan(0);
				if (attributeChoices.length > 0) {
					// Type assertion to AttributeChoiceConfig
					const attrChoice =
						attributeChoices[0] as AttributeChoiceConfig;
					expect(attrChoice.defaultAttributes).toContain("intellect");
					expect(attrChoice.defaultAttributes).toContain("will");
				}
			}
		});
	});
});
