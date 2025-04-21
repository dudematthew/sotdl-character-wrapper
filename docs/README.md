# Shadow of the Demon Lord Character System Documentation

This documentation provides information about the design, implementation, and usage of the character system for the Shadow of the Demon Lord role-playing game.

## Available Documentation

- [Character Choices System](CHARACTER_CHOICES.md) - A comprehensive guide to how character choices work, including technical details about choice types, storage, and application.
- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Step-by-step instructions for adding new ancestries and paths with custom choices.

## System Overview

The character system is a TypeScript implementation of character creation and management for the Shadow of the Demon Lord role-playing game. It features:

- A flexible attribute system
- Ancestries with unique traits and abilities
- Path system (Novice, Expert, Master) for character progression
- Dynamic choice management for character customization
- Support for languages, professions, and skills

## Key Components

### Character Creation

Characters are created with:
- A basic configuration (name, etc.)
- An ancestry that defines their base attributes and traits
- Paths that provide additional abilities as they level up
- Choices that allow customization within ancestries and paths

### Core Classes

- `Character` - The main class representing a playable character
- `Ancestry` - Defines a character's ancestral traits and base attributes
- `Path` - Base class for Novice, Expert, and Master paths
- `AttributeModifier` - Represents modifications to character attributes

### Choice System

The choice system allows characters to make selections within their ancestry and paths, such as:
- Which attributes to increase
- Which skills to acquire
- Which languages to learn
- Which professions to gain

See the [Character Choices](CHARACTER_CHOICES.md) documentation for more details.

## Getting Started

For developers wanting to extend or modify the system:

1. Familiarize yourself with the choice system by reading [Character Choices](CHARACTER_CHOICES.md)
2. Follow the [Implementation Guide](IMPLEMENTATION_GUIDE.md) to create new ancestries or paths
3. Study existing ancestries and paths to understand how they're implemented
4. Review the test files to understand expected behavior

## Best Practices

- Always use the `setChoice` method with the appropriate index when setting multiple choices
- Remember that character attributes are calculated on-the-fly, not stored persistently
- Use factories for creating consistent character configurations
- Write tests for new ancestries, paths, or choice types 