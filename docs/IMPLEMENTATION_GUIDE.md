# Implementation Guide: Adding New Ancestries and Paths

This guide provides step-by-step instructions for implementing new ancestries and paths with custom choices in the Shadow of the Demon Lord character system.

## Table of Contents

- [Creating a New Ancestry](#creating-a-new-ancestry)
- [Creating a New Path](#creating-a-new-path)
- [Adding Custom Choices](#adding-custom-choices)
- [Testing Your Implementation](#testing-your-implementation)
- [Integration with Character Factories](#integration-with-character-factories)

## Creating a New Ancestry

Ancestries define the base attributes and innate traits of a character. Here's how to create a new one:

### Step 1: Create a New File

Create a new file in `src/instances/ancestries/` with a descriptive name, e.g., `DwarfAncestry.ts`.

### Step 2: Define the Ancestry

Use the following template:

```typescript
import { AttributeModifier } from "../../attributes";
import { Ancestry } from "../../character";

/**
 * Defines the Dwarf ancestry
 * [Add a description of this ancestry]
 */
const dwarfAncestry = new Ancestry(
    // Base attributes for Dwarfs
    { strength: 11, agility: 9, intellect: 10, will: 10 },
    
    // Rules for calculating secondary attributes
    {
        perception: (mainAttrs) => mainAttrs.intellect,
        defense: (mainAttrs) => mainAttrs.agility,
        health: (mainAttrs) => mainAttrs.strength + 1, // Dwarfs are hardy
        healingRate: (mainAttrs, level, secondaryAttrs) =>
            Math.floor(secondaryAttrs.health / 4),
        size: () => 1,
        speed: () => 8, // Dwarfs are slower
        power: () => 0,
        damage: () => 0,
        insanity: () => 0,
        corruption: () => 0,
        languages: () => ["Common", "Dwarvish"], // Start with these languages
        professions: () => ["Smith"], // Start with one profession
        skills: () => [
            {
                name: "Darksight",
                description: "You can see in areas obscured by shadows or darkness within medium range as if those areas were lit."
            }
        ]
    },
    
    // Level 4 ancestry benefits with choices
    new AttributeModifier(
        {
            health: 4, // Bonus health at level 4
            skills: [
                {
                    name: "Robust Constitution",
                    description: "You gain immunity to poison."
                }
            ]
        },
        [
            // Choice 1: Skill selection
            {
                type: "skill",
                count: 1,
                availableSkills: [
                    {
                        name: "Robust Constitution",
                        description: "You gain immunity to poison."
                    },
                    {
                        name: "Stone Sense",
                        description: "You can detect structural weaknesses in stone and determine your depth underground."
                    }
                ]
            },
            // Choice 2: Profession selection
            {
                type: "profession",
                count: 1,
                availableProfessions: [
                    "Miner",
                    "Stonemason",
                    "Jeweler"
                ]
            }
        ]
<<<<<<< HEAD
    )
=======
    ),
    
    // Level 0 choices (available at character creation)
    [
        // Initial language choice
        {
            type: "language",
            count: 1,
            availableLanguages: ["High Dwarvish", "Goblin", "Trollish"],
            canReadExisting: false,
            canLearnNew: true
        },
        // Initial attribute choice
        {
            type: "attribute",
            count: 1,
            increaseBy: 1,
            availableAttributes: ["strength", "will"],
            defaultAttributes: ["strength"]
        }
    ]
>>>>>>> main
);

export default dwarfAncestry;
```

<<<<<<< HEAD
=======
### Key Components of an Ancestry

1. **Base Attributes**: Define the starting attribute values for the ancestry.
2. **Secondary Attribute Rules**: Define how secondary attributes are calculated from the main attributes.
3. **Level 4 Modifier**: Define modifiers that are applied when the character reaches level 4.
4. **Level 0 Choices**: Define choices that are available at character creation (level 0).

>>>>>>> main
### Step 3: Register the Ancestry (if needed)

If you have a registry system, make sure to register your new ancestry there.

## Creating a New Path

Paths represent a character's training and development. Here's how to create a new one:

### Step 1: Create a New File

Create a new file in the appropriate path directory:
- `src/instances/paths/novice/` for Novice paths
- `src/instances/paths/expert/` for Expert paths
- `src/instances/paths/master/` for Master paths

For example: `src/instances/paths/novice/fighterNovicePath.ts`

### Step 2: Define the Path

Use the following template for a Novice path:

```typescript
import { AttributeModifier, Novice } from "../../../attributes";

const fighterNovicePath = new Novice(
    // Level 1
    new AttributeModifier(
        {
            power: 1,
            health: 3,
            skills: [
                {
                    name: "Combat Prowess",
                    description: "When you make an attack roll, you do so with 1 boon."
                }
            ]
        },
        [
            {
                type: "attribute",
                count: 2,
                increaseBy: 1,
                defaultAttributes: ["strength", "agility"]
            },
            {
                type: "profession",
                count: 1,
                availableProfessions: ["Soldier", "Guard", "Mercenary", "Gladiator"],
                defaultProfessions: ["Soldier"]
            }
        ]
    ),
    
    // Level 2
    new AttributeModifier(
        {
            health: 3,
            skills: [
                {
                    name: "Forceful Strike",
                    description: "When you make an attack with a weapon, you can choose to roll with 1 bane. If the attack hits, you deal 1d6 extra damage."
                }
            ]
        }
    ),
    
    // Level 5
    new AttributeModifier(
        {
            power: 1,
            health: 3,
            skills: [
                {
                    name: "Battle Fury",
                    description: "You can use an action to enter a fury. Until the end of the round, you make attack rolls with 1 boon and damage rolls with 1d6 extra damage."
                }
            ]
        }
    ),
    
    // Level 8
    new AttributeModifier(
        {
            health: 3,
            skills: [
                {
                    name: "Unstoppable",
                    description: "Once per round, you can use a triggered action to remove one of the following afflictions: dazed, diseased, fatigued, frightened, poisoned, or slowed."
                }
            ]
        }
    )
);

export default fighterNovicePath;
```

The structure for Expert and Master paths is similar but with different level requirements.

## Adding Custom Choices

You can add choices to your ancestry or path by including them in the AttributeModifier constructor.

### Available Choice Types:

1. **Attribute Choices**
```typescript
{
    type: "attribute",
    count: 2,                    // How many attributes can be selected
    increaseBy: 1,               // How much each attribute increases by
    availableAttributes: ["strength", "agility", "intellect", "will"],  // Optional restriction
    defaultAttributes: ["strength", "agility"]  // Default selections if player doesn't choose
}
```

2. **Skill Choices**
```typescript
{
    type: "skill",
    count: 1,                    // How many skills can be selected
    availableSkills: [
        {
            name: "Skill Name",
            description: "Skill description"
        },
        // More skills...
    ]
}
```

3. **Profession Choices**
```typescript
{
    type: "profession",
    count: 1,                    // How many professions can be selected
    availableProfessions: ["Profession1", "Profession2"],  // Optional restriction
    defaultProfessions: ["Profession1"]  // Default selections
}
```

4. **Language Choices**
```typescript
{
    type: "language",
    count: 1,                    // How many languages can be selected
    availableLanguages: ["Elvish", "Dwarvish"],  // Optional restriction
    canReadExisting: true,       // Can the character read languages they already speak
    canLearnNew: true            // Can the character learn new languages
}
```

## Testing Your Implementation

### Step 1: Create a Test File

Create a test file in the `src/test/` directory, for example `dwarf-ancestry.test.ts`:

```typescript
import { Character } from "../character";
import dwarfAncestry from "../instances/ancestries/DwarfAncestry";

describe("Dwarf Ancestry Tests", () => {
    test("Base attributes should match expected values", () => {
        const character = new Character({ name: "Test Dwarf" }, dwarfAncestry);
        
        expect(character.attributes.strength).toBe(11);
        expect(character.attributes.agility).toBe(9);
        expect(character.attributes.intellect).toBe(10);
        expect(character.attributes.will).toBe(10);
        
        // Check secondary attributes
        expect(character.attributes.health).toBe(12); // strength + 1
        expect(character.attributes.speed).toBe(8);
    });
    
    test("Should have default languages and professions", () => {
        const character = new Character({ name: "Test Dwarf" }, dwarfAncestry);
        
        expect(character.attributes.languages).toContain("Common");
        expect(character.attributes.languages).toContain("Dwarvish");
        expect(character.attributes.languages.length).toBe(2);
        
        expect(character.attributes.professions).toContain("Smith");
        expect(character.attributes.professions.length).toBe(1);
    });
    
    test("Level 4 dwarf should have ancestry benefits", () => {
        const character = new Character({ name: "Test Dwarf" }, dwarfAncestry);
        character.level = 4;
        
        // Should have increased health
        expect(character.attributes.health).toBeGreaterThan(12);
        
        // Should have the default skill
        const robustConstitution = character.attributes.skills.find(
            skill => skill.name === "Robust Constitution"
        );
        expect(robustConstitution).toBeDefined();
    });
    
    test("Should be able to select skills and professions at level 4", () => {
        const character = new Character({ name: "Test Dwarf" }, dwarfAncestry);
        character.level = 4;
        
        // Get available choices
        const choices = character.getAvailableChoices();
        
        // Find skill choice
        const skillChoice = choices.find(
            c => c.config.type === "skill" && c.location.source === "ancestry"
        );
        
        expect(skillChoice).toBeDefined();
        
        if (skillChoice && skillChoice.config.type === "skill") {
            // Set skill choice to Stone Sense
            character.setChoice(skillChoice.location, {
                type: "skill",
                count: skillChoice.config.count,
                availableSkills: skillChoice.config.availableSkills,
                selectedSkills: [
                    {
                        name: "Stone Sense",
                        description: "You can detect structural weaknesses in stone and determine your depth underground."
                    }
                ]
            });
            
            // Verify skill is in attributes
            const stoneSense = character.attributes.skills.find(
                skill => skill.name === "Stone Sense"
            );
            expect(stoneSense).toBeDefined();
        }
    });
});
```

### Step 2: Run Tests

Run your tests with the Jest test runner:

```bash
npx jest src/test/dwarf-ancestry.test.ts
```

## Integration with Character Factories

If you want to create characters with your new ancestry or path programmatically, you can create a factory:

```typescript
import { Character } from "../character";
import dwarfAncestry from "../instances/ancestries/DwarfAncestry";
import fighterNovicePath from "../instances/paths/novice/fighterNovicePath";

export class DwarfFighterFactory {
    /**
     * Creates a base dwarf character
     */
    static createBaseCharacter(name: string = "Durin"): Character {
        return new Character({ name }, dwarfAncestry);
    }
    
    /**
     * Creates a level 4 dwarf fighter
     */
    static createLevel4Character(name: string = "Durin"): Character {
        const character = this.createBaseCharacter(name);
        character.level = 4;
        character.novicePath = fighterNovicePath;
        
        // Apply choices
        // ... (similar to ChadCharacterFactory)
        
        return character;
    }
}
```

## Best Practices

1. **Maintain Balance**: Follow the game's guidelines for attribute values and abilities to keep character options balanced.
2. **Document Thoroughly**: Add comments explaining the ancestry or path's theme and special abilities.
3. **Use Descriptive Names**: Choose clear names for skills, professions, and other elements.
4. **Write Tests**: Always create tests to verify your implementation works as expected.
5. **Follow Existing Patterns**: Look at other ancestries and paths for guidance on structure and design patterns.

## Further Reading

- [Character Choices System](CHARACTER_CHOICES.md) - Details on how the choice system works
- Read the existing ancestries and paths for examples and patterns to follow 