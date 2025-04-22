import fs from "fs";
import path from "path";
import { Master } from "../attributes";
import { createPathFromData } from "../factories/pathFactory";
import { AttributeChoiceConfig } from "../types";

describe("Master Paths loader", () => {
	describe("Master paths from JSON", () => {
		// Directory containing the master path JSON files
		const masterPathsDir = path.resolve(__dirname, "../data/paths/master");

		// Get all JSON files in the directory
		const pathFiles = fs
			.readdirSync(masterPathsDir)
			.filter((file) => file.endsWith(".json"));

		// Load each path and store in a map
		const loadedPaths = new Map<string, Master>();

		for (const file of pathFiles) {
			// Read the file
			const filePath = path.join(masterPathsDir, file);
			const pathData = JSON.parse(fs.readFileSync(filePath, "utf8"));

			// Create the path object
			const pathObj = createPathFromData(pathData) as Master;

			// Store in the map with the name as key
			loadedPaths.set(pathData.name, pathObj);
		}

		test("should load all master paths from JSON files", () => {
			// Check if we loaded paths
			expect(loadedPaths.size).toBeGreaterThan(0);
			expect(loadedPaths.size).toEqual(pathFiles.length);

			// Log the names of loaded paths
			console.log(
				`Loaded ${loadedPaths.size} master paths: ${Array.from(
					loadedPaths.keys()
				).join(", ")}`
			);
		});

		test("Acrobat path should have mobility-focused skills", () => {
			// Get the Acrobat path
			const acrobat = loadedPaths.get("Acrobat");
			expect(acrobat).toBeTruthy();

			if (acrobat) {
				// Check for acrobatic defense skill
				const skills = acrobat.l7Mod.skills || [];
				const acrobaticDefense = skills.find(
					(s) => s.name === "Acrobatic Defense"
				);
				expect(acrobaticDefense).toBeTruthy();

				// Check for tumble skill
				const tumble = skills.find((s) => s.name === "Tumble");
				expect(tumble).toBeTruthy();

				// Check for Improved Acrobatic Defense at level 10
				const l10Skills = acrobat.l10Mod.skills || [];
				const improvedAcrobaticDefense = l10Skills.find(
					(s) => s.name === "Improved Acrobatic Defense"
				);
				expect(improvedAcrobaticDefense).toBeTruthy();

				// Check for attribute choices
				const choiceConfig = acrobat.l7Mod.getChoiceConfig();
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
					expect(attrChoice.defaultAttributes).toContain("agility");
				}
			}
		});

		test("Archmage path should have spellcasting abilities", () => {
			// Get the Archmage path
			const archmage = loadedPaths.get("Archmage");
			expect(archmage).toBeTruthy();

			if (archmage) {
				// Check for Power attribute increase
				expect(archmage.l7Mod.power).toEqual(1);
				expect(archmage.l10Mod.power).toEqual(1);

				// Check for arcane mastery skill
				const skills = archmage.l7Mod.skills || [];
				const arcaneMastery = skills.find(
					(s) => s.name === "Arcane Mastery"
				);
				expect(arcaneMastery).toBeTruthy();

				// Check for Arcane Might at level 10
				const l10Skills = archmage.l10Mod.skills || [];
				const arcaneMight = l10Skills.find(
					(s) => s.name === "Arcane Might"
				);
				expect(arcaneMight).toBeTruthy();

				// Check for spell choices at level 10
				const choiceConfig = archmage.l10Mod.getChoiceConfig();
				// Convert to array if it's not already an array
				const choices = Array.isArray(choiceConfig)
					? choiceConfig
					: [choiceConfig];
				const spellChoices = choices.filter(
					(choice) => choice && choice.type === "spell"
				);
				expect(spellChoices.length).toBeGreaterThan(0);
			}
		});

		test("Warlord path should have leadership abilities", () => {
			// Get the Warlord path
			const warlord = loadedPaths.get("Warlord");
			expect(warlord).toBeTruthy();

			if (warlord) {
				// Check for health bonus
				expect(warlord.l7Mod.health).toEqual(5);
				expect(warlord.l10Mod.health).toEqual(5);

				// Check for Tactical Command skill
				const skills = warlord.l7Mod.skills || [];
				const tacticalCommand = skills.find(
					(s) => s.name === "Tactical Command"
				);
				expect(tacticalCommand).toBeTruthy();

				// Check for Strategic Mind at level 10
				const l10Skills = warlord.l10Mod.skills || [];
				const strategicMind = l10Skills.find(
					(s) => s.name === "Strategic Mind"
				);
				expect(strategicMind).toBeTruthy();

				// Check for defense bonus at level 10
				expect(warlord.l10Mod.defense).toEqual(1);
			}
		});
	});
});
