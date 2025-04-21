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
		character.setChoice(
			firstChoice.location,
			{
				type: "language",
				count: firstChoice.config.count,
				canReadExisting: firstChoice.config.canReadExisting,
				canLearnNew: firstChoice.config.canLearnNew,
				selectedLanguages: ["Elvish"],
			},
			0 // Index 0 for first language choice
		);

		console.log("After setting first language choice:");
		console.log("Languages:", character.attributes.languages);
	}
}

// Set second language choice
if (languageChoices.length > 1) {
	const secondChoice = languageChoices[1];
	console.log("\nSecond language choice:", secondChoice);

	if (secondChoice.config.type === "language") {
		character.setChoice(
			secondChoice.location,
			{
				type: "language",
				count: secondChoice.config.count,
				canReadExisting: secondChoice.config.canReadExisting,
				canLearnNew: secondChoice.config.canLearnNew,
				selectedLanguages: ["Primordial"],
			},
			1 // Index 1 for second language choice
		);

		console.log("After setting second language choice:");
		console.log("Languages:", character.attributes.languages);
	}
}

// Find profession choices
const professionChoices = choices.filter((c) => c.config.type === "profession");
console.log("\nProfession choices:", professionChoices.length);

// Set profession choices
if (professionChoices.length > 0) {
	const firstChoice = professionChoices[0];

	if (firstChoice.config.type === "profession") {
		character.setChoice(
			firstChoice.location,
			{
				type: "profession",
				count: firstChoice.config.count,
				availableProfessions: firstChoice.config.availableProfessions,
				selectedProfessions: ["Diplomat"],
			},
			0 // Index 0 for first profession choice
		);

		console.log("After setting first profession choice:");
		console.log("Professions:", character.attributes.professions);
	}

	if (professionChoices.length > 1) {
		const secondChoice = professionChoices[1];

		if (secondChoice.config.type === "profession") {
			character.setChoice(
				secondChoice.location,
				{
					type: "profession",
					count: secondChoice.config.count,
					availableProfessions:
						secondChoice.config.availableProfessions,
					selectedProfessions: ["Linguist"],
				},
				1 // Index 1 for second profession choice
			);

			console.log("After setting second profession choice:");
			console.log("Professions:", character.attributes.professions);
		}
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
console.log("Final professions:", character.attributes.professions);
