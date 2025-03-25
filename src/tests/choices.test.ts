import { Character } from "../character/Character";
import humanAncestry from "../instances/ancestries/HumanAncestry";
import magicianNovicePath from "../instances/paths/novice/magicianNovicePath";

describe("Character Choice System", () => {
	test("Invalid language choices are removed during validation", () => {
		// Create a character with a language choice
		const magicianCharacter = new Character(
			{ name: "Test Magician" },
			humanAncestry
		);
		magicianCharacter.novicePath = magicianNovicePath;

		// Set an invalid language choice
		magicianCharacter.setChoice(
			{ source: "novicePath", level: 1 },
			{
				type: "language",
				count: 1,
				selectedLanguages: ["Common", "InvalidLanguage"],
				canReadExisting: true,
				canLearnNew: true,
			}
		);

		// Verify that the character's attributes only include valid languages
		const attrs = magicianCharacter.attributes;
		expect(attrs.languages).toEqual(["Common"]);
	});
});
