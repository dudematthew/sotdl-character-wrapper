import fs from "fs";
import path from "path";
import { createAncestryFromData } from "../factories/ancestryFactory";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import {
	AttributeChoiceConfig,
	ProfessionChoiceConfig,
	SkillChoiceConfig,
} from "../types";
import { SpellChoice } from "../types/spell";

// Check if tests are running in verbose mode
const isVerbose = process.argv.includes("--verbose");

// Helper function to conditionally log output only if verbose or there's an error
function conditionalLog(message: string, forceLog = false): void {
	if (isVerbose || forceLog) {
		console.log(message);
	}
}

describe("Ancestry factory", () => {
	describe("Human ancestry", () => {
		// Load the human ancestry JSON data
		const jsonPath = path.resolve(
			__dirname,
			"../data/ancestries/humanAncestry.json"
		);
		const humanAncestryJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

		// Create an ancestry from the JSON
		const fromJsonAncestry = createAncestryFromData(humanAncestryJson);

		// Test base attributes
		test("should have the same base attributes", () => {
			expect(fromJsonAncestry.mainAttributes).toEqual(
				humanAncestry.mainAttributes
			);
		});

		// Test initial choices
		test("should have the same initial choices", () => {
			// Get the choices from both objects
			const fromJsonChoices = fromJsonAncestry.initialChoices;
			const directChoices = humanAncestry.initialChoices;

			// Only log in verbose mode
			conditionalLog(
				"Initial choices from JSON: " + JSON.stringify(fromJsonChoices)
			);
			conditionalLog(
				"Initial choices direct: " + JSON.stringify(directChoices)
			);

			// Check if both have choices or both don't have choices
			const bothHaveChoices = !!fromJsonChoices && !!directChoices;
			const neitherHaveChoices = !fromJsonChoices && !directChoices;

			// Fail the test if one has choices and the other doesn't
			if (!(bothHaveChoices || neitherHaveChoices)) {
				// Force log when there's an error
				conditionalLog(
					"Initial choices from JSON: " +
						JSON.stringify(fromJsonChoices),
					true
				);
				conditionalLog(
					"Initial choices direct: " + JSON.stringify(directChoices),
					true
				);
				conditionalLog("Initial choices discrepancy found:", true);
				conditionalLog(
					"From JSON has choices: " + !!fromJsonChoices,
					true
				);
				conditionalLog("Direct has choices: " + !!directChoices, true);

				fail(
					"Initial choices mismatch: one has choices, the other doesn't"
				);
				return;
			}

			// Only proceed with detailed comparison if both have choices
			if (bothHaveChoices) {
				// Convert to arrays if not already
				const fromJsonArray = Array.isArray(fromJsonChoices)
					? fromJsonChoices
					: [fromJsonChoices];
				const directArray = Array.isArray(directChoices)
					? directChoices
					: [directChoices];

				// Check if they have the same length
				if (fromJsonArray.length !== directArray.length) {
					conditionalLog(
						`Different number of initial choices: JSON=${fromJsonArray.length}, Direct=${directArray.length}`,
						true
					);
					fail(
						`Initial choices count mismatch: JSON=${fromJsonArray.length}, Direct=${directArray.length}`
					);
					return;
				}

				// Track if we found any mismatches for the final assertion
				let foundMismatch = false;
				// Collection of mismatch messages to show on failure
				const mismatchMessages: string[] = [];

				// Compare choices with as much detail as possible
				fromJsonArray.forEach((jsonChoice, index) => {
					if (index >= directArray.length) {
						const msg = `Extra choice in JSON: ${jsonChoice.type}`;
						mismatchMessages.push(msg);
						foundMismatch = true;
						return;
					}

					const directChoice = directArray[index];

					if (jsonChoice.type !== directChoice.type) {
						const msg = `Choice type mismatch at index ${index}: JSON=${jsonChoice.type}, Direct=${directChoice.type}`;
						mismatchMessages.push(msg);
						foundMismatch = true;
						return;
					}

					if (jsonChoice.count !== directChoice.count) {
						const msg = `Choice count mismatch at index ${index}: JSON=${jsonChoice.count}, Direct=${directChoice.count}`;
						mismatchMessages.push(msg);
						foundMismatch = true;
					}

					// Compare specific fields based on choice type
					if (
						jsonChoice.type === "attribute" &&
						directChoice.type === "attribute"
					) {
						const jsonAttrChoice =
							jsonChoice as AttributeChoiceConfig;
						const directAttrChoice =
							directChoice as AttributeChoiceConfig;

						if (
							!arraysEqual(
								jsonAttrChoice.availableAttributes,
								directAttrChoice.availableAttributes
							)
						) {
							mismatchMessages.push(
								`Available attributes mismatch at index ${index}:`
							);
							mismatchMessages.push(
								`JSON: ${jsonAttrChoice.availableAttributes}`
							);
							mismatchMessages.push(
								`Direct: ${directAttrChoice.availableAttributes}`
							);
							foundMismatch = true;
						}

						if (
							!arraysEqual(
								jsonAttrChoice.defaultAttributes,
								directAttrChoice.defaultAttributes
							)
						) {
							mismatchMessages.push(
								`Default attributes mismatch at index ${index}:`
							);
							mismatchMessages.push(
								`JSON: ${jsonAttrChoice.defaultAttributes}`
							);
							mismatchMessages.push(
								`Direct: ${directAttrChoice.defaultAttributes}`
							);
							foundMismatch = true;
						}
					} else if (
						jsonChoice.type === "profession" &&
						directChoice.type === "profession"
					) {
						const jsonProfChoice =
							jsonChoice as ProfessionChoiceConfig;
						const directProfChoice =
							directChoice as ProfessionChoiceConfig;

						if (
							!arraysEqual(
								jsonProfChoice.availableProfessions,
								directProfChoice.availableProfessions
							)
						) {
							mismatchMessages.push(
								`Available professions mismatch at index ${index}:`
							);
							mismatchMessages.push(
								`JSON: ${jsonProfChoice.availableProfessions}`
							);
							mismatchMessages.push(
								`Direct: ${directProfChoice.availableProfessions}`
							);
							foundMismatch = true;
						}

						if (
							!arraysEqual(
								jsonProfChoice.defaultProfessions,
								directProfChoice.defaultProfessions
							)
						) {
							mismatchMessages.push(
								`Default professions mismatch at index ${index}:`
							);
							mismatchMessages.push(
								`JSON: ${jsonProfChoice.defaultProfessions}`
							);
							mismatchMessages.push(
								`Direct: ${directProfChoice.defaultProfessions}`
							);
							foundMismatch = true;
						}
					}
				});

				// Check for choices in direct that aren't in fromJson
				if (directArray.length > fromJsonArray.length) {
					for (
						let i = fromJsonArray.length;
						i < directArray.length;
						i++
					) {
						const msg = `Extra choice in direct: ${directArray[i].type}`;
						mismatchMessages.push(msg);
						foundMismatch = true;
					}
				}

				// Fail the test if any mismatches were found
				if (foundMismatch) {
					// Log all the mismatch messages
					mismatchMessages.forEach((msg) =>
						conditionalLog(msg, true)
					);
					fail("Initial choices have mismatches");
				}
			}
		});

		// Test level 4 ancestry benefits
		test("should have the same level 4 ancestry benefits", () => {
			// Track mismatches for final assertion
			let foundMismatch = false;
			// Collection of mismatch messages to show on failure
			const mismatchMessages: string[] = [];

			// Test modifiers in ancestry modifier
			const fromJsonModifiers = fromJsonAncestry.ancestryModifier;
			const directModifiers = humanAncestry.ancestryModifier;

			// Check health modification is the same
			if (fromJsonModifiers.health !== directModifiers.health) {
				const msg = `Health modifier mismatch: JSON=${fromJsonModifiers.health}, Direct=${directModifiers.health}`;
				mismatchMessages.push(msg);
				foundMismatch = true;
			}

			// Compare level 4 choice config
			const fromJsonChoices = fromJsonModifiers.getChoiceConfig();
			const directChoices = directModifiers.getChoiceConfig();

			// Only log in verbose mode
			conditionalLog(
				"Level 4 benefits from JSON: " + JSON.stringify(fromJsonChoices)
			);
			conditionalLog(
				"Level 4 benefits direct: " + JSON.stringify(directChoices)
			);

			// Check if both have or don't have choices
			const bothHaveChoices = !!fromJsonChoices && !!directChoices;
			const neitherHaveChoices = !fromJsonChoices && !directChoices;

			if (!(bothHaveChoices || neitherHaveChoices)) {
				// Force log when there's an error
				conditionalLog(
					"Level 4 benefits from JSON: " +
						JSON.stringify(fromJsonChoices),
					true
				);
				conditionalLog(
					"Level 4 benefits direct: " + JSON.stringify(directChoices),
					true
				);
				conditionalLog("Level 4 choices discrepancy found:", true);
				conditionalLog(
					"From JSON has choices: " + !!fromJsonChoices,
					true
				);
				conditionalLog("Direct has choices: " + !!directChoices, true);

				fail(
					"Level 4 choices mismatch: one has choices, the other doesn't"
				);
				return;
			}

			if (bothHaveChoices) {
				// Convert to arrays if they're not already
				const fromJsonArray = Array.isArray(fromJsonChoices)
					? fromJsonChoices
					: [fromJsonChoices];
				const directArray = Array.isArray(directChoices)
					? directChoices
					: [directChoices];

				// Check length
				if (fromJsonArray.length !== directArray.length) {
					const msg = `Different number of level 4 choices: JSON=${fromJsonArray.length}, Direct=${directArray.length}`;
					mismatchMessages.push(msg);
					foundMismatch = true;
				}

				// Test the "Determined" talent is available in both
				const jsonSkillChoice = fromJsonArray.find(
					(choice) => choice.type === "skill"
				) as SkillChoiceConfig | undefined;

				const directSkillChoice = directArray.find(
					(choice) => choice.type === "skill"
				) as SkillChoiceConfig | undefined;

				if (jsonSkillChoice && directSkillChoice) {
					const jsonDetermined =
						jsonSkillChoice.availableSkills?.find(
							(skill) => skill.name === "Determined"
						);
					const directDetermined =
						directSkillChoice.availableSkills?.find(
							(skill) => skill.name === "Determined"
						);

					if (!jsonDetermined || !directDetermined) {
						mismatchMessages.push("Determined skill mismatch:");
						mismatchMessages.push(
							"JSON has Determined: " + !!jsonDetermined
						);
						mismatchMessages.push(
							"Direct has Determined: " + !!directDetermined
						);
						foundMismatch = true;
					}
				} else {
					mismatchMessages.push("Skill choice mismatch:");
					mismatchMessages.push(
						"JSON has skill choice: " + !!jsonSkillChoice
					);
					mismatchMessages.push(
						"Direct has skill choice: " + !!directSkillChoice
					);
					foundMismatch = true;
				}

				// Check spell choice if it exists
				const jsonSpellChoice = fromJsonArray.find(
					(choice) => choice.type === "spell"
				) as SpellChoice | undefined;

				const directSpellChoice = directArray.find(
					(choice) => choice.type === "spell"
				) as SpellChoice | undefined;

				if (
					(jsonSpellChoice && !directSpellChoice) ||
					(!jsonSpellChoice && directSpellChoice)
				) {
					mismatchMessages.push("Spell choice discrepancy:");
					mismatchMessages.push(
						"JSON has spell choice: " + !!jsonSpellChoice
					);
					mismatchMessages.push(
						"Direct has spell choice: " + !!directSpellChoice
					);
					foundMismatch = true;
				}

				if (jsonSpellChoice && directSpellChoice) {
					if (jsonSpellChoice.count !== directSpellChoice.count) {
						const msg = `Spell choice count mismatch: JSON=${jsonSpellChoice.count}, Direct=${directSpellChoice.count}`;
						mismatchMessages.push(msg);
						foundMismatch = true;
					}
				}

				// Fail the test if any mismatches were found
				if (foundMismatch) {
					// Log all the mismatch messages
					mismatchMessages.forEach((msg) =>
						conditionalLog(msg, true)
					);
					fail("Level 4 ancestry benefits have mismatches");
				}
			}
		});

		// Test secondary attribute calculations - create a mock character and check results
		test("should calculate the same secondary attributes", () => {
			// Create mock attributes for testing
			const mockMainAttrs = {
				strength: 12,
				agility: 14,
				intellect: 10,
				will: 9,
			};
			const mockSecondaryAttrs = {
				health: 0,
				perception: 0,
				defense: 0,
				healingRate: 0,
				size: 0,
				speed: 0,
				power: 0,
				damage: 0,
				insanity: 0,
				corruption: 0,
				languages: [],
				professions: [],
				skills: [],
			};
			const mockLevel = 0;

			// Test each secondary attribute calculation
			const secondaryAttrNames = [
				"perception",
				"defense",
				"health",
				"healingRate",
				"size",
				"speed",
				"power",
				"damage",
				"insanity",
				"corruption",
			];

			// Track any failures
			const failures: string[] = [];

			secondaryAttrNames.forEach((attrName) => {
				// Calculate using both calculation functions
				const fromJsonValue = fromJsonAncestry.secondaryAttributeRules[
					attrName
				](mockMainAttrs, mockLevel, mockSecondaryAttrs);
				const directValue = humanAncestry.secondaryAttributeRules[
					attrName
				](mockMainAttrs, mockLevel, mockSecondaryAttrs);

				// Only log on verbose mode or if values don't match
				if (fromJsonValue !== directValue) {
					const msg = `${attrName}: fromJson=${fromJsonValue}, direct=${directValue}`;
					conditionalLog(msg, true);
					failures.push(msg);
				} else {
					conditionalLog(
						`${attrName}: fromJson=${fromJsonValue}, direct=${directValue}`
					);
				}

				// Compare the results
				expect(fromJsonValue).toBe(directValue);
			});

			// Test array attributes (languages, professions, skills)
			["languages", "professions", "skills"].forEach((attrName) => {
				const fromJsonArray = fromJsonAncestry.secondaryAttributeRules[
					attrName
				](mockMainAttrs, mockLevel, mockSecondaryAttrs);
				const directArray = humanAncestry.secondaryAttributeRules[
					attrName
				](mockMainAttrs, mockLevel, mockSecondaryAttrs);

				// Only log on verbose mode or if values don't match
				if (
					JSON.stringify(fromJsonArray) !==
					JSON.stringify(directArray)
				) {
					const msg = `${attrName}: fromJson=${JSON.stringify(
						fromJsonArray
					)}, direct=${JSON.stringify(directArray)}`;
					conditionalLog(msg, true);
					failures.push(msg);
				}

				expect(fromJsonArray).toEqual(directArray);
			});

			// If there are failures, we could log them here, but Jest will show them anyway
		});
	});
});

// Helper function to compare arrays
function arraysEqual(a?: any[], b?: any[]): boolean {
	if (!a && !b) return true;
	if (!a || !b) return false;
	if (a.length !== b.length) return false;

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}

	return true;
}

/**
 * Helper function to fail a test with a specific message
 */
function fail(message: string): never {
	throw new Error(message);
}
