import { Character } from "../character";
import languerAncestry from "../instances/ancestries/LanguerAncestry";

// Create a simple character for debugging
const character = new Character({ name: "Debug" }, languerAncestry);
character.level = 4; // Set level to 4 to enable ancestry benefits

console.log("Base character:");
console.log("Languages:", character.attributes.languages);
console.log("Professions:", character.attributes.professions);

// Get available choices
const choices = character.getAvailableChoices();
console.log(
	"\nAvailable choices:",
	choices.map((c) => ({
		source: c.location.source,
		level: c.location.level,
		type: c.config.type,
	}))
);

// Find language choices
const languageChoices = choices.filter((c) => c.config.type === "language");
console.log("\nLanguage choices:", languageChoices.length);

// Set first language choice
if (languageChoices.length > 0) {
	const firstChoice = languageChoices[0];
	console.log("\nFirst language choice:", firstChoice);

	if (firstChoice.config.type === "language") {
		character.setChoice(firstChoice.location, {
			type: "language",
			count: firstChoice.config.count,
			canReadExisting: firstChoice.config.canReadExisting,
			canLearnNew: firstChoice.config.canLearnNew,
			selectedLanguages: ["Elvish"],
		});

		console.log("After setting first language choice:");
		console.log("Languages:", character.attributes.languages);
	}
}

// Set second language choice
if (languageChoices.length > 1) {
	const secondChoice = languageChoices[1];
	console.log("\nSecond language choice:", secondChoice);

	if (secondChoice.config.type === "language") {
		character.setChoice(secondChoice.location, {
			type: "language",
			count: secondChoice.config.count,
			canReadExisting: secondChoice.config.canReadExisting,
			canLearnNew: secondChoice.config.canLearnNew,
			selectedLanguages: ["Primordial"],
		});

		console.log("After setting second language choice:");
		console.log("Languages:", character.attributes.languages);
	}
}

// Print available choices
console.log("\nActual choices in character:");
const actualChoices = Array.from(
	// Using any to access private field for debugging
	(character as any).choicesByLocation.entries()
).map(([key, value]: [string, any]) => ({ key, value }));

console.log(actualChoices);

// Print final attributes
console.log("\nFinal languages:", character.attributes.languages);
