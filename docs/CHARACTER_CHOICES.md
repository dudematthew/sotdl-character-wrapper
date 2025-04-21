# Character Choice System

## Overview

The character choice system is a flexible framework for managing character customization options that come from various sources including ancestries and paths. This document provides a technical overview of how choices work in the system, aimed at developers who need to work with or extend this functionality.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Choice Types](#choice-types)
- [How Choices are Stored](#how-choices-are-stored)
- [How Choices are Applied](#how-choices-are-applied)
- [Creating Custom Choices](#creating-custom-choices)
- [Troubleshooting](#troubleshooting)

## Core Concepts

### Choice Structure

Each character choice has several components:

1. **Location** - Where the choice comes from (ancestry, novice path, etc.)
2. **Type** - What kind of choice it is (attribute, skill, language, etc.)
3. **Configuration** - Parameters specific to the choice type
4. **Selection** - The player's selection for this choice

The system dynamically calculates available choices based on the character's current configuration and level. This means that changing a character's ancestry or path will update their available choices.

### Ancestry vs. Path Choices

There's an important distinction in how choices work between ancestries and paths:

- **Ancestry Choices**: Ancestries can provide choices at two points:
  - **Initial Choices**: Available at character creation (level 0) for initial customization
  - **Level 4 Choices**: Additional choices that become available when the character reaches level 4

- **Path Choices**: Paths provide choices at specific levels as the character progresses.

This distinction reflects the fundamental difference between ancestries and paths:
- **Ancestries** establish **rules** for how attributes behave throughout a character's life
- **Paths** provide **modifiers** that change attributes at specific levels

### Code References

- [ChoiceLocation Interface](../src/types/index.ts) - Defines the source and level of a choice
- [ChoiceConfig Types](../src/types/index.ts) - Union type of all possible choice configurations
- [Character Class - Choice Methods](../src/character/Character.ts) - Core methods for managing choices

## Choice Types

The system supports several types of choices:

### Attribute Choices

Allow players to select which attributes to increase.

```typescript
export type AttributeChoiceConfig = {
    type: "attribute";
    count: number;
    increaseBy: number;
    availableAttributes?: (keyof mainAttributes)[];
    selectedAttributes?: (keyof mainAttributes)[];
    defaultAttributes?: (keyof mainAttributes)[];
};
```

### Skill Choices

Allow players to select skills from a list.

```typescript
export type SkillChoiceConfig = {
    type: "skill";
    count: number;
    availableSkills: Skill[];
    selectedSkills?: Skill[];
};
```

### Profession Choices

Allow players to select professions from a list.

```typescript
export type ProfessionChoiceConfig = {
    type: "profession";
    count: number;
    availableProfessions: string[];
    selectedProfessions?: string[];
    defaultProfessions?: string[];
};
```

### Language Choices

Allow players to select languages to learn, optionally from a restricted list.

```typescript
export type LanguageChoiceConfig = {
    type: "language";
    count: number;
    selectedLanguages?: string[];
    availableLanguages?: string[];
    canReadExisting: boolean;
    canLearnNew: boolean;
    writingPreferences?: { [language: string]: boolean };
};
```

### Spell Choices

Complex choices related to magic and spells (see [spell.ts](../src/types/spell.ts)).

## How Choices are Stored

Choices are stored in a `Map` inside the Character class called `choicesByLocation`. The key is a string that contains:

1. The source of the choice (ancestry, novicePath, etc.)
2. The level at which the choice is available
3. The type of choice
4. An index (to support multiple choices of the same type)

For example: `"ancestry-4-language-1"` would identify the second language choice from ancestry at level 4.

### Key Methods

- `setChoice(location, selection, index)` - Set a choice with player's selection
- `getChoice(location, type, index)` - Get the current selection for a choice
- `getAvailableChoices()` - Get all choices available to a character
- `clearChoices(source)` - Remove choices, optionally filtered by source

## How Choices are Applied

Choices are applied dynamically when calculating character attributes. The `attributes` getter in the Character class:

1. Starts with base attributes from ancestry
2. Applies ancestry and path modifiers
3. Processes choices and applies their effects
4. Ensures uniqueness for collections like languages and professions

Important methods:

- `getEffectiveAttributeChoice(location)` - Gets selected or default attributes
- `getEffectiveLanguageChoice(location)` - Gets selected languages
- `getEffectiveProfessionChoice(location)` - Gets selected professions

These methods all retrieve the appropriate choices and resolve them to concrete values that can be applied to character attributes.

## Creating Custom Choices

To create a new choice in an ancestry or path:

1. Define the choice configuration in the appropriate file
2. Pass it to the AttributeModifier constructor
3. Implement any special processing in the Character class if needed

### Example: Adding Choices to an Ancestry

```typescript
const myAncestry = new Ancestry(
    // Base attributes
    { strength: 10, agility: 10, intellect: 10, will: 10 },
    // Secondary attribute rules
    { /* ... */ },
    // Level 4 modifier with choices
    new AttributeModifier(
        {
            health: 5,
            skills: [/* ... */]
        },
        [
            // Language choice
            {
                type: "language",
                count: 1,
                canReadExisting: true,
                canLearnNew: true,
                availableLanguages: ["Elvish", "Dwarvish"]
            },
            // Profession choice
            {
                type: "profession",
                count: 1,
                availableProfessions: ["Merchant", "Diplomat"]
            }
        ]
    )
);
```

### Example: Setting Choices in a Factory

When creating characters programmatically, you can set choices using the `