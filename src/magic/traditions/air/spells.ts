import { Spell } from "../../types";

export const airSpells: Record<string, Spell> = {
    // Level 0
    stirTheAir: {
        id: 'stir_the_air',
        name: 'Stir the Air',
        tradition: 'air',
        level: 0,
        type: 'utility',
        description: 'Area A sphere with a 2-yard radius centered on a point you can reach\nDuration 1 minute\nYou create a light breeze in the area, which moves with you for the duration. The breeze clears away odors and dust, scatters lightweight objects such as papers, extinguishes candles, and causes larger flames to flicker and dance.\nCreatures in the area that attack you with thrown or ranged weapons make their attack rolls with 1 bane.',
        source: 'tradition'
    },
    windBlast: {
        id: 'wind_blast',
        name: 'Wind Blast',
        tradition: 'air',
        level: 0,
        type: 'attack',
        description: 'Target One creature or object within short range\nA powerful wind assails the target. Make a Will attack roll against the target\'s Strength. On a success, the wind moves the target 1d6 yards away from you.\nAttack Roll 20+ The target falls prone at the end of this movement.',
        source: 'tradition'
    },

    // Level 1
    evokeGale: {
        id: 'evoke_gale',
        name: 'Evoke Gale',
        tradition: 'air',
        level: 1,
        type: 'attack',
        description: 'Area A cone, 3 yards long, originating from a point within short range\nA howling wind disperses vapors, fog, smoke, and gas from the area. Unprotected flames gutter out, and lightweight objects are blown to the nearest edge of the area. Each creature in the area must get a success on a Strength challenge roll or be moved 1d6 yards away from the origin point. Flying creatures make the roll with 1 bane.',
        source: 'tradition'
    },
    flense: {
        id: 'flense',
        name: 'Flense',
        tradition: 'air',
        level: 1,
        type: 'attack',
        description: 'Target One creature or object within short range\nWindborne grit scours your target. Make a Will attack roll against the target\'s Strength. On a success, the target takes 2d6 + 3 damage. A living creature that becomes incapacitated by this damage dies instantly, its flesh (if any) stripped from its bones.\nAttack Roll 20+ The target takes 2d6 extra damage.',
        source: 'tradition'
    },
    glide: {
        id: 'glide',
        name: 'Glide',
        tradition: 'air',
        level: 1,
        type: 'utility',
        description: 'Target One creature within long range\nDuration 1 minute\nTriggered You use a triggered action to cast this spell when you see the target fall. For the duration, the target takes no damage from landing after a fall. If it continues to fall after the effect ends, it takes damage based on where it continues falling from.',
        source: 'tradition'
    },

    // Level 2
    stillTheAir: {
        id: 'still_the_air',
        name: 'Still the Air',
        tradition: 'air',
        level: 2,
        type: 'utility',
        description: 'Area A sphere with a 4-yard radius centered on a point within medium range\nDuration 1 hour\nFor the duration, no sound emanates from or reaches into the area. Creatures in the area are deafened and are immune to any sound-based attack, such as the thunderclap spell.',
        source: 'tradition'
    },
    thunderclap: {
        id: 'thunderclap',
        name: 'Thunderclap',
        tradition: 'air',
        level: 2,
        type: 'attack',
        description: 'Area A sphere with a 10-yard radius centered on a point within medium range\nA wave of thunderous noise spreads out from the center of the area, dealing 1d6 + 1 damage to everything in it. Each creature in the area must make a Strength challenge roll, taking half the damage on a success. On a failure, the creature also becomes deafened for 1 minute.',
        source: 'tradition'
    },

    // Level 3
    bestowFlight: {
        id: 'bestow_flight',
        name: 'Bestow Flight',
        tradition: 'air',
        level: 3,
        type: 'utility',
        description: 'Target One creature you can reach\nDuration 1 hour\nYou touch the target. It can fly at its normal Speed for the duration.',
        source: 'tradition'
    },
    fling: {
        id: 'fling',
        name: 'Fling',
        tradition: 'air',
        level: 3,
        type: 'attack',
        description: 'Area A cylinder, 4 yards tall with a radius of 4 yards, centered on a point within long range\nA powerful blast of wind erupts from the origin point. Each creature in the area must make a Strength challenge roll; Size 1 or smaller creatures make the roll with 1 bane. On a failure, it falls prone and is moved 5d6 yards away from the origin point. If it encounters a solid surface before moving the full distance, it and the surface it strikes each take 1d6 damage plus 1d6 extra damage per 5 yards remaining in this movement (round down).',
        source: 'tradition'
    },

    // Level 4
    createCyclone: {
        id: 'create_cyclone',
        name: 'Create Cyclone',
        tradition: 'air',
        level: 4,
        type: 'attack',
        description: 'Area A line, 20 yards long, 10 yards high, and 2 yards wide originating from a point within long range\nA powerful whirlwind appears at one end of the area and moves along and through it, dealing 3d6 damage to anything whose space it enters. Each unsecured object damaged in this way is moved 1d6 yards in a direction you choose. Each creature damaged in this way must make a Strength challenge roll. On a failure, it is moved 1d6 yards in a direction you choose and falls prone. On a success, it just takes half the damage.',
        source: 'tradition'
    },

    // Level 5
    bindWindGenie: {
        id: 'bind_wind_genie',
        name: 'Bind Wind Genie',
        tradition: 'air',
        level: 5,
        type: 'utility',
        description: 'Target A cube of air, 2 yards on a side, originating from a point within long range\nDuration 1 minute\nAt the end of the round in which you cast this spell, the target cube becomes a Size 2 wind genie. You cannot voluntarily end this spell. When the genie appears, make a Will attack roll against its Will. The genie becomes compelled for the duration on a success, or becomes hostile to you on a failure.',
        source: 'tradition'
    }
} as const;

export const extendAirSpells = (newSpells: Record<string, Spell>) => {
    Object.assign(airSpells, newSpells);
}; 