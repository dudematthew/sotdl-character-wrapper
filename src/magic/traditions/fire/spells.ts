import { Spell } from "../../types";

export const fireSpells: Record<string, Spell> = {
    // Level 0
    controlFlame: {
        id: 'control_flame',
        name: 'Control Flame',
        tradition: 'fire',
        level: 0,
        type: 'utility',
        description: 'Target One Size 1 or smaller flammable object within short range\nThe target catches fire or you extinguish the flame if it\'s already burning.',
        source: 'tradition'
    },
    flameMissile: {
        id: 'flame_missile',
        name: 'Flame Missile',
        tradition: 'fire',
        level: 0,
        type: 'attack',
        description: 'Target One creature or object within long range\nYou loose a fiery missile at the target. Make a Will attack roll against the target\'s Agility. On a success, the target takes 1d6 damage.\nAttack Roll 20+ The target takes 1d6 extra damage.',
        source: 'tradition'
    },

    // Level 1
    fireBlast: {
        id: 'fire_blast',
        name: 'Fire Blast',
        tradition: 'fire',
        level: 1,
        type: 'attack',
        description: 'Area A cone, 3 yards long, originating from a point you can reach\nFlames rush out from your hand, dealing 3d6 damage to everything in the area. Each creature in the area takes half the damage with a success on an Agility challenge roll.',
        source: 'tradition'
    },
    meteor: {
        id: 'meteor',
        name: 'Meteor',
        tradition: 'fire',
        level: 1,
        type: 'attack',
        description: 'Target A point in space within medium range\nYou hurl a fiery stone. When it reaches the target, or if it encounters a solid creature or object before then, it explodes. Flames spread through a 1-yard-radius sphere centered on the target or on a point in the creature\'s or object\'s space, dealing 2d6 + 2 damage to everything in the area. Each creature in the area takes half the damage with a success on an Agility challenge roll.',
        source: 'tradition'
    },
    flameWard: {
        id: 'flame_ward',
        name: 'Flame Ward',
        tradition: 'fire',
        level: 1,
        type: 'utility',
        description: 'Target One creature you can reach\nDuration 1 hour\nYou touch the target. For the duration, it takes half damage from fire.',
        source: 'tradition'
    },

    // Level 2
    fieryVolley: {
        id: 'fiery_volley',
        name: 'Fiery Volley',
        tradition: 'fire',
        level: 2,
        type: 'attack',
        description: 'Target Up to three creatures or objects within medium range\nYou loose three fiery missiles, divided as you choose among the targets. For each missile, make a Will attack roll against the target\'s Agility. On a success, the target takes 1d6 + 1 damage.\nAttack Roll 20+ The target takes 1d3 extra damage.',
        source: 'tradition'
    },
    flamingShroud: {
        id: 'flaming_shroud',
        name: 'Flaming Shroud',
        tradition: 'fire',
        level: 2,
        type: 'utility',
        description: 'Duration 1 minute\nFlames envelop you for the duration, shedding bright light in a 10-yard radius around you. The flames are warm but do not harm you or anything you wear or carry.\nFor the duration, you take half damage from cold and you cannot become fatigued from exposure to cold temperatures. As well, when a creature touches you or gets a success on an attack roll against you using a melee weapon, it takes 1d6 damage from fire.',
        source: 'tradition'
    },

    // Level 3
    fireball: {
        id: 'fireball',
        name: 'Fireball',
        tradition: 'fire',
        level: 3,
        type: 'attack',
        description: 'Target A point in space within long range\nYou fling a globe of fire. When it reaches the target, or if it encounters a solid creature or object before then, it explodes. Flames spread through a 5-yard-radius sphere centered on the target or on a point in the creature\'s or object\'s space, dealing 5d6 damage to everything in the area. Each creature in the area takes half the damage with a success on an Agility challenge roll.',
        source: 'tradition'
    },
    immolate: {
        id: 'immolate',
        name: 'Immolate',
        tradition: 'fire',
        level: 3,
        type: 'attack',
        description: 'Target One creature or object within medium range\nThe target smolders and threatens to burst into flames. Make a Will attack roll against its Agility. On a success, the target takes 4d6 damage and catches fire.\nAttack Roll 20+ The target takes 2d6 extra damage.',
        source: 'tradition'
    },

    // Level 4
    wallOfFlames: {
        id: 'wall_of_flames',
        name: 'Wall of Flames',
        tradition: 'fire',
        level: 4,
        type: 'attack',
        description: 'Area A shapeable line 10 yards long, 5 yards tall, and 1 yard wide originating from a point within long range\nDuration 1 minute\nFlames fill the area for the duration, partially obscuring everything in and behind it. Creatures or objects in the area when you cast the spell or that enter it take 3d6 damage. At the end of each round for the duration, each creature and flammable object in the area takes 3d6 damage, and each within short range of the area\'s edge takes 1d6 damage unless it gets a success on a Strength challenge roll.',
        source: 'tradition'
    },

    // Level 5
    bindFlameGenie: {
        id: 'bind_flame_genie',
        name: 'Bind Flame Genie',
        tradition: 'fire',
        level: 5,
        type: 'utility',
        description: 'Target A cube of fire, 2 yards on a side, originating from a point within long range\nDuration 1 minute\nAt the end of the round in which you cast this spell, the target becomes a Size 2 flame genie. You cannot voluntarily end this spell. When the genie appears, make a Will attack roll against its Will. The genie becomes compelled for the duration on a success, or becomes hostile to you on a failure.',
        source: 'tradition'
    }
} as const;

// Allow extending spells from outside
export const extendFireSpells = (newSpells: Record<string, Spell>) => {
    Object.assign(fireSpells, newSpells);
};
 