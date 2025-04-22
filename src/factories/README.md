# Function Factory System

This directory contains the implementation of the function factory pattern described in `FUNCTION_FACTORY_IMPLEMENTATION_PLAN.md`. The factory system allows you to convert JSON data into functional game objects.

## Key Components

### Factory Functions

These functions create game objects from serialized data:

- `createPathFromData`: Creates Path objects (Novice, Expert, Master)
- `createAncestryFromData`: Creates Ancestry objects
- `createAttributeCalculationFunction`: Creates attribute calculation functions
- `createAttributeModifierFromSchema`: Creates attribute modifiers
- `createChoiceConfigFromSchema`: Creates choice configurations

### Factory Registry

The `factoryRegistry` provides a central point for creating objects:

```typescript
import { factoryRegistry } from 'sotdl-character-wrapper';

// Register a custom factory for a specific type
factoryRegistry.registerFactory('myCustomType', myCustomFactory);

// Create an object through the registry
const myObject = factoryRegistry.createFromData(jsonData);
```

For convenience, you can also use the simpler `createFromData` function:

```typescript
import { createFromData } from 'sotdl-character-wrapper';
import type { Ancestry } from 'sotdl-character-wrapper';

// Load JSON data...
const ancestryData = loadMyJSON();

// Create an Ancestry object
const ancestry = createFromData<Ancestry>(ancestryData);
```

## Creating Custom Content with JSON

### Ancestry Example

```json
{
  "baseAttributes": {
    "strength": 10,
    "agility": 10,
    "intellect": 10,
    "will": 10
  },
  "secondaryAttributes": {
    "perception": {
      "type": "attributeBased",
      "sourceAttribute": "intellect"
    },
    "defense": {
      "type": "attributeBased",
      "sourceAttribute": "agility"
    },
    "health": {
      "type": "formula",
      "formula": "$strength * 2"
    },
    "healingRate": {
      "type": "fixed",
      "value": 1
    },
    "size": {
      "type": "fixed",
      "value": 1
    },
    "speed": {
      "type": "fixed",
      "value": 10
    },
    "power": {
      "type": "fixed",
      "value": 0
    },
    "damage": {
      "type": "fixed",
      "value": 0
    },
    "insanity": {
      "type": "fixed",
      "value": 0
    },
    "corruption": {
      "type": "fixed",
      "value": 0
    },
    "languages": ["Common"],
    "professions": [],
    "skills": []
  },
  "levelBenefits": {
    "modifiers": {
      "health": 2
    }
  },
  "initialChoices": [
    {
      "type": "profession",
      "count": 1,
      "availableProfessions": ["Any"]
    }
  ]
}
```

### Novice Path Example

```json
{
  "type": "novice",
  "level1": {
    "modifiers": {
      "strength": 1
    }
  },
  "level2": {
    "modifiers": {
      "health": 2
    }
  },
  "level5": {
    "modifiers": {
      "defense": 1
    }
  },
  "level8": {
    "choices": [
      {
        "type": "attribute",
        "count": 1,
        "increaseBy": 1,
        "availableAttributes": ["strength", "agility", "intellect", "will"]
      }
    ]
  }
}
```

## Utilities for Working with JSON

The `utils` module provides helpers for working with JSON data:

```typescript
import { 
  detectSchemaType, 
  validateAncestrySchema,
  validatePathSchema,
  loadFromString,
  loadFromFile,
  saveToFile
} from 'sotdl-character-wrapper';

// Detect what type of data you're working with
const schemaType = detectSchemaType(jsonData);

// Load data from a file (Node.js only)
const { success, data, error } = await loadFromFile('path/to/file.json');

// Convert and save an object to JSON (Node.js only)
await saveToFile('path/to/file.json', myObject);
```

## Extending the System

To add support for new types, create new factory functions and register them:

1. Define a schema interface for your new type
2. Create a factory function that converts schema to objects
3. Register your factory with the registry:

```typescript
factoryRegistry.registerFactory('myNewType', myNewFactory);
``` 