/**
 * Main entry point for the character builder application
 * Creates a sample character and displays its progression through levels
 */
import edwardCharacterFactory from "./instances/charactersFactories/edwardCharacterFactory";

// Create a test character and display its attributes at each level
const myCharacter = edwardCharacterFactory();

for (let i = 0; i <= 4; i++) {
	// Display character stats at current level
	console.log(`Level ${myCharacter.level} =====================`);
	console.log(`Strength: ${myCharacter.attributes.strength}`);
	console.log(`Agility: ${myCharacter.attributes.agility}`);
	console.log(`Intellect: ${myCharacter.attributes.intellect}`);
	console.log(`Will: ${myCharacter.attributes.will}`);
	console.log(`Health: ${myCharacter.attributes.health}`);
	console.log(`Defense: ${myCharacter.attributes.defense}`);
	console.log(`Healing Rate: ${myCharacter.attributes.healingRate}`);
	console.log(`Speed: ${myCharacter.attributes.speed}`);
	console.log(`Languages: ${myCharacter.attributes.languages}`);
	console.log(`Professions: ${myCharacter.attributes.professions}`);
	console.log(
		`Skills: ${myCharacter.attributes.skills.map((s) => s.name).join(", ")}`
	);
	// FIXME: This is not working
	console.log(`Choices: ${myCharacter.getChoicesForLevel(i)}`);
	console.log(`=============================`);
	myCharacter.levelUp();
}
