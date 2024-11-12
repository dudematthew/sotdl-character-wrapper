# Shadow of the Demon Lord Character Generator

A TypeScript-based character generator for the Shadow of the Demon Lord tabletop RPG system.

## Features

- Character creation and leveling system
- Support for different character paths:
  - Novice paths (e.g., Warrior, Magician)
  - Expert paths (e.g., Assassin)
  - Master paths (e.g., Acrobat)
- Ancestry system (e.g., Human)
- Magic system with:
  - Traditions (e.g., Fire magic)
  - Spells
  - Spell slots management
- Attribute calculation system
- Choice-based character progression
- Skill and profession management

## Project Structure 
```
src/
├── attributes/ # Attribute calculation and modification system
├── characters/ # Core character logic
├── choices/ # Choice system for character progression
├── instances/ # Concrete implementations
│ ├── ancestries/ # Ancestry definitions
│ ├── paths/ # Path definitions (novice, expert, master)
│ └── factories/ # Character factory patterns
├── magic/ # Magic system implementation
└── types/ # TypeScript type definitions
```


## Key Components

### Character System
- Base character class with support for leveling and attribute management
- Dynamic attribute calculation based on ancestry and paths
- Support for multiple paths (Novice, Expert, Master)

### Path System
- Three-tiered path system (Novice, Expert, Master)
- Level-based modifier application
- Support for choices at different levels

### Attribute System
- Main and secondary attributes
- Modifier system for attribute adjustments
- Support for numeric and array-based attributes

### Choice System
- Configurable choices at different levels
- Support for different types of choices (professions, spells, traditions)
- Flexible selection system

## Development

### Prerequisites
- Node.js
- npm/yarn

### Installation

```
bash
npm install
```

### Running Tests

```
bash
npm test
```

## Testing
The project includes comprehensive test coverage for:
- Character attribute calculations
- Path modifier applications
- Choice system functionality
- Magic system operations

## License
This project is licensed under the MIT License. See the LICENSE file for details.
