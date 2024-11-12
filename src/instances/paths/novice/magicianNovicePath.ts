import { AttributeModifier, Novice } from "../../../attributes";
import { ConfiguredChoiceBuilder } from "../../../choices";
import { SpellSource } from "../../../magic/types";
import { fireTradition } from "../../../magic/traditions";

// Define available traditions
const availableTraditions = [
    {
        id: fireTradition.id,
        name: fireTradition.name,
        type: 'tradition' as const,
        data: {
            spellSlots: 1,
            level0Spells: fireTradition.level0Spells
        }
    }
];

// Define available spells
const availableSpells = [
    {
        id: 'fireball',
        name: 'Fireball',
        type: 'spell' as const,
        data: {
            tradition: 'fire',
            level: 1,
            description: 'Throws a ball of fire'
        }
    },
    // Add more spells...
];

const magicianNovicePath = new Novice(
    // Level 1
    new AttributeModifier({
        health: 2,
        power: 1,
        skills: [
            {
                name: "Sense Magic",
                description: "Area A sphere with a 5-yard radius centered on a point within your space. You know if there are any ongoing magical effects in the area and from what points they originate."
            }
        ],
        choices: [
            new ConfiguredChoiceBuilder()
                .withId('level1-academic-knowledge')
                .withName('Academic Knowledge')
                .withDescription('Choose one academic area of knowledge')
                .withOptions([
                    { 
                        id: 'history',
                        name: 'History',
                        type: 'profession',
                        data: { description: 'Knowledge of historical events' }
                    },
                    { 
                        id: 'alchemy',
                        name: 'Alchemy',
                        type: 'profession',
                        data: { description: 'Knowledge of alchemical processes' }
                    }
                ])
                .withSelections(1, 1)
                .withBehavior('FirstAvailable'),
            // Magic choices
            ...[1,2,3,4].map(i => 
                new ConfiguredChoiceBuilder()
                    .withId(`level1-magic-choice-${i}`)
                    .withName(`Magic Choice ${i}`)
                    .withDescription('Discover one tradition or learn one spell')
                    .withOptions([...availableTraditions, ...availableSpells])
                    .withSelections(1, 1)
                    .withBehavior('FirstAvailable')
            )
        ]
    }),
    // Level 2 with its choices
    new AttributeModifier({
        health: 2,
        skills: [
            {
                name: "Spell Recovery",
                description: "You can use an action to heal damage equal to your healing rate and regain one casting you expended of a spell you learned. Once you use this talent, you cannot use it again until after you complete a rest."
            }
        ],
        choices: [
            ...[1,2].map(i => 
                new ConfiguredChoiceBuilder()
                    .withId(`level2-magic-choice-${i}`)
                    .withName(`Magic Choice ${i}`)
                    .withDescription('Discover one tradition or learn one spell')
                    .withOptions([...availableTraditions, ...availableSpells])
                    .withSelections(1, 1)
                    .withBehavior('FirstAvailable')
            )
        ]
    }),
    // Level 5
    new AttributeModifier({
        health: 2,
        power: 1,
        skills: [
            {
                name: "Counterspell",
                description: "When a creature you can see attacks you with a spell, you can use a triggered action to counter it. The triggering creature makes the attack roll with 1 bane and you make the challenge roll to resist it with 1 boon."
            }
        ]
    }),
    // Level 8
    new AttributeModifier({
        health: 2,
        skills: [
            {
                name: "Improved Spell Recovery",
                description: "When you use Spell Recovery, you regain two castings instead of one."
            }
        ]
    })
);

export default magicianNovicePath; 