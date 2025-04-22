import fs from "fs";
import path from "path";
import { Novice } from "../attributes";
import { createPathFromData } from "../factories/pathFactory";
import warriorNovicePath from "../instances/paths/novice/warriorNovicePath";

// Check if tests are running in verbose mode
const isVerbose = process.argv.includes("--verbose");

// Helper function to conditionally log output only if verbose or there's an error
function conditionalLog(message: string, forceLog = false): void {
	if (isVerbose || forceLog) {
		console.log(message);
	}
}

describe("Path factory", () => {
	describe("Warrior novice path", () => {
		// Load the warrior novice path JSON data
		const jsonPath = path.resolve(
			__dirname,
			"../data/paths/novice/warriorNovicePath.json"
		);
		const warriorPathJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

		// Create a path from the JSON
		const fromJsonPath = createPathFromData(warriorPathJson) as Novice;

		// Test level 1 modifier
		test("should have the same level 1 abilities", () => {
			// Check some key attributes
			expect(fromJsonPath.l1Mod.health).toEqual(
				warriorNovicePath.l1Mod.health
			);

			// Check skills
			const jsonSkills = fromJsonPath.l1Mod.skills || [];
			const directSkills = warriorNovicePath.l1Mod.skills || [];
			expect(jsonSkills.length).toEqual(directSkills.length);

			// Check if 'Catch Your Breath' skill exists
			const jsonCatchBreath = jsonSkills.find(
				(s) => s.name === "Catch Your Breath"
			);
			const directCatchBreath = directSkills.find(
				(s) => s.name === "Catch Your Breath"
			);
			expect(jsonCatchBreath).toBeTruthy();
			expect(directCatchBreath).toBeTruthy();

			// Log the details of the skills for debugging
			conditionalLog(`JSON skills: ${JSON.stringify(jsonSkills)}`);
			conditionalLog(`Direct skills: ${JSON.stringify(directSkills)}`);
		});

		// Test level 1 choices
		test("should have the same level 1 choices", () => {
			const jsonChoices = fromJsonPath.l1Mod.getChoiceConfig();
			const directChoices = warriorNovicePath.l1Mod.getChoiceConfig();

			// Both should have choices
			expect(jsonChoices).toBeTruthy();
			expect(directChoices).toBeTruthy();

			// Convert to arrays if they're not already
			const jsonChoicesArray = Array.isArray(jsonChoices)
				? jsonChoices
				: [jsonChoices];
			const directChoicesArray = Array.isArray(directChoices)
				? directChoices
				: [directChoices];

			// Check length
			expect(jsonChoicesArray.length).toEqual(directChoicesArray.length);

			// Check the first choice
			if (jsonChoicesArray.length > 0 && directChoicesArray.length > 0) {
				expect(jsonChoicesArray[0].type).toEqual(
					directChoicesArray[0].type
				);
				expect(jsonChoicesArray[0].count).toEqual(
					directChoicesArray[0].count
				);
			}
		});

		// Test level 2 modifier
		test("should have the same level 2 abilities", () => {
			expect(fromJsonPath.l2Mod.health).toEqual(
				warriorNovicePath.l2Mod.health
			);

			// Check if 'Combat Prowess' skill exists
			const jsonSkills = fromJsonPath.l2Mod.skills || [];
			const directSkills = warriorNovicePath.l2Mod.skills || [];
			const jsonCombatProwess = jsonSkills.find(
				(s) => s.name === "Combat Prowess"
			);
			const directCombatProwess = directSkills.find(
				(s) => s.name === "Combat Prowess"
			);
			expect(jsonCombatProwess).toBeTruthy();
			expect(directCombatProwess).toBeTruthy();
		});

		// Test level 5 modifier
		test("should have the same level 5 abilities", () => {
			expect(fromJsonPath.l5Mod.health).toEqual(
				warriorNovicePath.l5Mod.health
			);
			expect(fromJsonPath.l5Mod.defense).toEqual(
				warriorNovicePath.l5Mod.defense
			);

			// Check if 'Combat Expertise' skill exists
			const jsonSkills = fromJsonPath.l5Mod.skills || [];
			const directSkills = warriorNovicePath.l5Mod.skills || [];
			const jsonCombatExpertise = jsonSkills.find(
				(s) => s.name === "Combat Expertise"
			);
			const directCombatExpertise = directSkills.find(
				(s) => s.name === "Combat Expertise"
			);
			expect(jsonCombatExpertise).toBeTruthy();
			expect(directCombatExpertise).toBeTruthy();
		});

		// Test level 8 modifier
		test("should have the same level 8 abilities", () => {
			expect(fromJsonPath.l8Mod.health).toEqual(
				warriorNovicePath.l8Mod.health
			);

			// Check if both 'Grit' and 'Combat Mastery' skills exist
			const jsonSkills = fromJsonPath.l8Mod.skills || [];
			const directSkills = warriorNovicePath.l8Mod.skills || [];
			expect(jsonSkills.length).toEqual(directSkills.length);

			const jsonGrit = jsonSkills.find((s) => s.name === "Grit");
			const directGrit = directSkills.find((s) => s.name === "Grit");
			expect(jsonGrit).toBeTruthy();
			expect(directGrit).toBeTruthy();

			const jsonCombatMastery = jsonSkills.find(
				(s) => s.name === "Combat Mastery"
			);
			const directCombatMastery = directSkills.find(
				(s) => s.name === "Combat Mastery"
			);
			expect(jsonCombatMastery).toBeTruthy();
			expect(directCombatMastery).toBeTruthy();
		});
	});
});
