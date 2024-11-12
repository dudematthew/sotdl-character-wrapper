import { Character } from "../../characters";
import humanAncestry from "../ancestries/HumanAncestry";
import magicianNovicePath from "../paths/novice/magicianNovicePath";

const magicianCharacterFactory: () => Character = () => {
    const magicianCharacter = new Character({ name: "Aldrich" }, humanAncestry);
    magicianCharacter.setPath(magicianNovicePath);
    return magicianCharacter;
};

export default magicianCharacterFactory; 