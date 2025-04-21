# Test Organization

This directory contains the reorganized test files for the Shadow of the Demon Lord character system. The tests have been restructured to improve clarity, avoid redundancy, and follow consistent naming conventions.

## Test Files

The test files are organized by feature rather than by character or implementation details:

- **character-attributes.test.ts**: Tests related to base character attributes, attribute calculations, and health.
- **choice-system.test.ts**: Tests related to the character choice system, focusing on how choices are defined, stored, and applied.
- **language-system.test.ts**: Tests focusing on character languages, language choices, and language validation.
- **path-abilities.test.ts**: Tests for character path abilities, including tests for Magician and Priest paths.
- **spell-registry.test.ts**: Tests focused on the spell registry functionality, spell choice validation, and available spell filtering.

## Running Tests

To run all the reorganized tests, use the npm script:

```bash
npm run test:new
```

To run a specific test file, use one of these commands:

```bash
# Run specific test categories
npm run test:attributes  # Character attributes tests
npm run test:choice      # Choice system tests
npm run test:language    # Language system tests
npm run test:path        # Path abilities tests
npm run test:spell       # Spell registry tests

# Or use Jest directly
npx jest src/tests-new/character-attributes.test.ts
```

## Test Structure

Each test file follows a consistent structure:

1. **Imports**: Required modules and factories
2. **Main describe block**: Top-level grouping by feature
3. **Nested describe blocks**: Logical subfeatures or test categories
4. **Individual test cases**: Focused on specific behaviors and expectations

## Naming Conventions

- **describe blocks**: Noun phrases describing the feature or component being tested
- **test names**: Should express what the code does, not implementation details
- **variable names**: Clear and descriptive, avoiding abbreviations

## Example

```typescript
describe("Language System", () => {
  describe("Default Languages", () => {
    test("Characters have ancestry-specific default languages", () => {
      // Test code...
    });
  });
});
```

This organization makes it easier to:
1. Find tests related to specific features
2. Understand what functionality is being tested
3. Add new tests in a consistent manner
4. Avoid test duplication 