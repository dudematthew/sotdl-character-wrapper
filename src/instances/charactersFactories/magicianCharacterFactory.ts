import { Character } from "../../character";
import humanAncestry from "../ancestries/HumanAncestry";
import magicianNovicePath from "../paths/novice/magicianNovicePath";
import { SpellRegistry } from "../../spells/SpellRegistry";
import { CORE_SPELLS, CORE_TRADITIONS } from "../../data/spells";

const merlinCharacterFactory = () => {
	// Initialize spell registry with core content
	const registry = SpellRegistry.getInstance();
	CORE_TRADITIONS.forEach((tradition) =>
		registry.registerTradition(tradition)
	);
	CORE_SPELLS.forEach((spell) => registry.registerSpell(spell));

	// Create character
	const merlinCharacter = new Character({ name: "Merlin" }, humanAncestry);
	merlinCharacter.novicePath = magicianNovicePath;

	return merlinCharacter;
};

export default merlinCharacterFactory;
