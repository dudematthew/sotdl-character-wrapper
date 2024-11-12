import { Tradition } from "../../types";
import { airSpells } from "./spells";

export const airTradition: Tradition = {
    id: 'air-tradition',
    name: 'Air Magic',
    description: 'Spells of the Air tradition harness the power of the wind, allowing casters to direct it where they will. Many users of Air magic discover the tradition by forging a bond with wind genies encountered in high places or in areas where the air is never still. Others come to it by studying the ancient writings of accomplished elementalists and mastering the mystic phrases required to control the air.\n\nOnce you have discovered this tradition, the air always moves around you. It stirs your hair, rustles your clothing, and whispers in your ears. Some find the constant motion maddening. You might take comfort from the ever-present companionship of your favored element. Each time you cast an Air spell, the air moving around you picks up speed—just enough to cause flames to flicker and to disturb lightweight objects.',
    level0Spells: [
        airSpells.stirTheAir,
        airSpells.windBlast
    ]
}; 