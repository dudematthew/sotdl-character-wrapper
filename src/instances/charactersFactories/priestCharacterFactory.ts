import { Character } from "../../characters";
import humanAncestry from "../ancestries/HumanAncestry";
import priestNovicePath from "../paths/novice/priestNovicePath";
import { SpellRegistry } from "../../spells/SpellRegistry";
import { CORE_SPELLS, CORE_TRADITIONS } from "../../data/spells";

const peterCharacterFactory = () => {
	// Initialize spell registry with core content
	const registry = SpellRegistry.getInstance();
	CORE_TRADITIONS.forEach((tradition) =>
		registry.registerTradition(tradition)
	);
	CORE_SPELLS.forEach((spell) => registry.registerSpell(spell));

	// Create character
	const peterCharacter = new Character({ name: "Peter" }, humanAncestry);
	peterCharacter.novicePath = priestNovicePath;

	return peterCharacter;
};

export default peterCharacterFactory;
