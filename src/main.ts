import edwardCharacterFactory from "./instances/charactersFactories/edwardCharacterFactory";

const myCharacter = edwardCharacterFactory();

console.log(
	`Health (level ${myCharacter.level}): ${myCharacter.attributes.health}`
);
console.log(
	`Defense (level ${myCharacter.level}): ${myCharacter.attributes.defense}`
);
console.log(
	`Healing Rate (level ${myCharacter.level}): ${myCharacter.attributes.healingRate}`
);
console.log(
	`Languages (level ${
		myCharacter.level
	}): ${myCharacter.attributes.languages.join(", ")}`
);
console.log(
	`Professions (level ${
		myCharacter.level
	}): ${myCharacter.attributes.professions.join(", ")}`
);
console.log(
	`Skills (level ${myCharacter.level}): ${myCharacter.attributes.skills
		.map((skill) => skill.name)
		.join(", ")}`
);

myCharacter.levelUp(); // level 1

console.log(
	`Health (level ${myCharacter.level}): ${myCharacter.attributes.health}`
);
console.log(
	`Defense (level ${myCharacter.level}): ${myCharacter.attributes.defense}`
);
console.log(
	`Healing Rate (level ${myCharacter.level}): ${myCharacter.attributes.healingRate}`
);
console.log(
	`Languages (level ${
		myCharacter.level
	}): ${myCharacter.attributes.languages.join(", ")}`
);
console.log(
	`Professions (level ${
		myCharacter.level
	}): ${myCharacter.attributes.professions.join(", ")}`
);
console.log(
	`Skills (level ${myCharacter.level}): ${myCharacter.attributes.skills
		.map((skill) => skill.name)
		.join(", ")}`
);

myCharacter.levelUp(); // level 2

console.log(
	`Health (level ${myCharacter.level}): ${myCharacter.attributes.health}`
);
console.log(
	`Defense (level ${myCharacter.level}): ${myCharacter.attributes.defense}`
);
console.log(
	`Healing Rate (level ${myCharacter.level}): ${myCharacter.attributes.healingRate}`
);
console.log(
	`Languages (level ${
		myCharacter.level
	}): ${myCharacter.attributes.languages.join(", ")}`
);
console.log(
	`Professions (level ${
		myCharacter.level
	}): ${myCharacter.attributes.professions.join(", ")}`
);
console.log(
	`Skills (level ${myCharacter.level}): ${myCharacter.attributes.skills
		.map((skill) => skill.name)
		.join(", ")}`
);

myCharacter.levelUp(); // level 3

console.log(
	`Health (level ${myCharacter.level}): ${myCharacter.attributes.health}`
);
console.log(
	`Defense (level ${myCharacter.level}): ${myCharacter.attributes.defense}`
);
console.log(
	`Healing Rate (level ${myCharacter.level}): ${myCharacter.attributes.healingRate}`
);
console.log(
	`Languages (level ${
		myCharacter.level
	}): ${myCharacter.attributes.languages.join(", ")}`
);
console.log(
	`Professions (level ${
		myCharacter.level
	}): ${myCharacter.attributes.professions.join(", ")}`
);
console.log(
	`Skills (level ${myCharacter.level}): ${myCharacter.attributes.skills
		.map((skill) => skill.name)
		.join(", ")}`
);
