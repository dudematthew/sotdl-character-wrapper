import { Tradition } from "../../types";
import { fireSpells } from "./spells";

export const fireTradition: Tradition = {
    id: 'fire-tradition',
    name: 'Fire Magic',
    description: 'Fire magic creates and controls flame. Discovering this tradition, often from binding a genie, enhances your innate volatility: your skin becomes hot to the touch, your eyes literally blaze in anger, and you are always on the verge of losing your temper.',
    level0Spells: [
        fireSpells.controlFlame,
        fireSpells.flameMissile
    ]
}; 