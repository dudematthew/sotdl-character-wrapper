# Function Factory Concept Plan

## Core Problem

In the `sotdl-character-wrapper` library, game mechanics (ancestries, paths, etc.) are currently hardcoded as TypeScript classes and functions. This makes it difficult for users to create custom content without writing code. We need a way to represent these game mechanics in a data format (JSON) that can be:
1. Created without coding knowledge
2. Stored in files or databases
3. Converted back into functional code at runtime

## The Function Factory Pattern - Key Concepts

### 1. Functions as Data

Many game mechanics are essentially functions (e.g., calculating derived attributes, applying effects at level-up). Instead of hardcoding these functions, we can describe them as data:

```json
{
  "type": "attributeBased",
  "params": {
    "sourceAttribute": "will",
    "modifier": 0
  }
}
```

This data describes a function that returns the value of the will attribute (possibly with a modifier).

### 2. Function Factories

A function factory takes this declarative configuration and produces an actual function:

```typescript
// Conceptual example
const factory = {
  // Takes configuration, returns a function
  create: (params) => (character) => character.attributes[params.sourceAttribute] + (params.modifier || 0)
};

// Usage
const config = { type: "attributeBased", params: { sourceAttribute: "will" } };
const actualFunction = factory.create(config.params);
const result = actualFunction(characterInstance); // Returns the character's will attribute
```

The key insight: **We're representing behavior as data, then converting that data back to behavior when needed**.

### 3. Registry of Factory Types

We need a way to map the "type" in the config to the appropriate factory:

```typescript
// Simple concept of a registry
const factoryRegistry = {
  "fixed": fixedValueFactory,      // For constant values
  "attributeBased": attributeBasedFactory,  // For values derived from attributes
  // more factory types...
};
```

## What We Need to Build

### Essential Components

1. **Function Factories** - A set of factories that can create the various types of functions needed in the game:
   - Fixed values (e.g., constant bonuses)
   - Attribute-based calculations
   - Formulas combining multiple attributes
   - Conditional logic (if level > X then Y else Z)

2. **Serialization Format** - JSON schemas for representing:
   - Ancestries
   - Paths (Novice, Expert, Master)
   - Attribute modifiers
   - Any other game mechanics we want to make customizable

3. **Factory Functions** - Functions that can:
   - Convert JSON config → functional game objects
   - Convert existing game objects → JSON config (for exporting built-ins)

### Why These Components Matter

- **Function Factories**: Allow complex game calculations to be defined in data
- **Serialization Format**: Ensures consistent structure for saving/loading
- **Factory Functions**: Bridge between data and functional code

## Implementation Approach

Instead of prescribing exact file structures, here's a conceptual approach to building this system incrementally:

1. **Start with a clear example**: Pick one game mechanic (like a novice path) and create:
   - A JSON representation
   - A factory function to convert it to a working object

2. **Identify common patterns**: From that example, extract what types of function factories you need

3. **Build and test incrementally**: Get one thing working fully, then expand to others

## Example Workflow (Conceptual)

Here's how it might look to transform a Warrior Novice Path using this system:

```typescript
// Instead of importing a hardcoded class:
// import { WarriorNovicePath } from '../paths/novice/warrior';

// You would:
import { createNovicePathFromConfig } from '../factories/novicePath';
import warriorConfig from '../data/paths/novice/warrior.json';

const warriorPath = createNovicePathFromConfig(warriorConfig);
```

Behind the scenes, `createNovicePathFromConfig` would:
1. Read the configuration
2. Use appropriate function factories to create actual functions
3. Return a fully functional novice path object

## Priorities for Implementation

Focus on these key questions as you build:

1. What are the fundamental types of functions you need to represent? (fixed values, attribute-based, etc.)

2. What's the minimal JSON schema needed to describe your game objects?

3. How will factory functions convert between data and functional code?

Start by implementing just enough to make one example work end-to-end, then expand from there.

## Different Ways to Approach It

You could approach this from either direction:

### Top-down approach:
1. Create a JSON schema for a novice path
2. Write a factory to convert it to a working object
3. Implement the function factories as needed

### Bottom-up approach:
1. Create basic function factories
2. Build serialization formats
3. Combine them into higher-level factories

Choose the approach that makes the most sense for your workflow and understanding of the problem. 