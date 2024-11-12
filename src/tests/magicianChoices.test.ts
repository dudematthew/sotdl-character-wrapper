import { Character } from "../characters";
import magicianCharacterFactory from "../instances/charactersFactories/aldrichCharacterFactory";
import magicianNovicePath from "../instances/paths/novice/magicianNovicePath";
import { fireTradition } from "../magic/traditions";
import { Spell, TraditionChoice } from "../magic/types";
import { ProfessionChoice } from "../choices";

describe("Magician Path Choices", () => {
    let character: Character;

    beforeEach(() => {
        character = magicianCharacterFactory();
        character.levelUp();
    });

    describe("Level 1", () => {
        describe("Skills and Attributes", () => {
            test("Has correct attribute modifications", () => {
                const attrs = character.attributes;
                expect(attrs.health).toBe(12); // Base 10 + 2 from level 1
                expect(attrs.power).toBe(1);
            });

            test("Has Sense Magic skill", () => {
                const attrs = character.attributes;
                const senseMagic = attrs.skills.find(s => s.name === "Sense Magic");
                expect(senseMagic).toBeDefined();
                expect(senseMagic?.description).toContain("5-yard radius");
            });
        });

        describe("Academic Knowledge", () => {
            test("Has academic knowledge choice", () => {
                const choices = magicianNovicePath.getChoicesForLevel(1);
                const academicChoice = choices.find(c => c.id === 'level1-academic-knowledge');
                
                expect(academicChoice).toBeDefined();
                expect(academicChoice?.options).toBeDefined();
                expect(academicChoice?.options.length).toBe(2); // History and Alchemy
                expect(academicChoice?.maxSelections).toBe(1);
                expect(academicChoice?.minSelections).toBe(1);
            });

            test("Can select academic knowledge", () => {
                const choices = magicianNovicePath.getChoicesForLevel(1);
                const academicChoice = choices.find(c => c.id === 'level1-academic-knowledge');
                
                if (!academicChoice?.options[0]) throw new Error('Academic choice not found');
                
                const professionChoice: ProfessionChoice = {
                    id: 'history',
                    name: 'History', // Match exactly what we expect in the test
                    type: 'profession',
                    data: {
                        description: academicChoice.options[0].data.description || ''
                    }
                };
                
                character.applyChoice(academicChoice.id, [professionChoice]);
                expect(character.attributes.professions).toContain('History');
            });
        });

        describe("Magic Choices", () => {
            test("Has four magic choices", () => {
                const choices = magicianNovicePath.getChoicesForLevel(1);
                const magicChoices = choices.filter(c => c.id.startsWith('level1-magic-choice'));
                
                expect(magicChoices).toHaveLength(4);
                magicChoices.forEach(choice => {
                    expect(choice.options).toBeDefined();
                    expect(choice.options.length).toBeGreaterThan(0);
                    expect(choice.maxSelections).toBe(1);
                });
            });

            test("Can select a tradition", () => {
                const choices = magicianNovicePath.getChoicesForLevel(1);
                const firstMagicChoice = choices.find(c => c.id === 'level1-magic-choice-1');
                const option = firstMagicChoice?.options.find(o => o.id === fireTradition.id);
                
                if (!option || option.type !== 'tradition') throw new Error('Tradition option not found');
                
                // Convert to TraditionChoice with required properties
                const traditionChoice: TraditionChoice = {
                    id: option.id,
                    name: option.name,
                    type: 'tradition',
                    data: {
                        spellSlots: option.data.spellSlots || 1, // Provide default if undefined
                        level0Spells: option.data.level0Spells || []
                    }
                };
                
                character.applyChoice(firstMagicChoice!.id, [traditionChoice]);
                
                // Should get level 0 spells automatically
                const spells = character.getSpells();
                expect(spells).toContainEqual(expect.objectContaining({
                    name: 'Control Flame',
                    level: 0
                }));
                expect(spells).toContainEqual(expect.objectContaining({
                    name: 'Flame Missile',
                    level: 0
                }));
            });

            test("Can select a spell after tradition", () => {
                const choices = magicianNovicePath.getChoicesForLevel(1);
                const firstChoice = choices.find(c => c.id === 'level1-magic-choice-1');
                const option = firstChoice?.options.find(o => o.id === fireTradition.id);
                
                if (!option || option.type !== 'tradition') throw new Error('Tradition option not found');
                
                const traditionChoice: TraditionChoice = {
                    id: option.id,
                    name: option.name,
                    type: 'tradition',
                    data: {
                        spellSlots: option.data.spellSlots ?? 1,
                        level0Spells: option.data.level0Spells ?? []
                    }
                };
                
                character.applyChoice(firstChoice!.id, [traditionChoice]);

                const spell: Spell = {
                    id: 'fireball',
                    name: 'Fireball',
                    tradition: fireTradition.id,
                    level: 1,
                    type: 'attack',
                    description: 'Throws a ball of fire',
                    source: 'tradition'
                };
                
                const secondChoice = choices.find(c => c.id === 'level1-magic-choice-2');
                character.applyChoice(secondChoice!.id, [spell]);
            });

            test("Cannot select spell without tradition", () => {
                const choices = magicianNovicePath.getChoicesForLevel(1);
                const firstChoice = choices.find(c => c.id === 'level1-magic-choice-1');
                const spellOption = firstChoice?.options.find(o => 
                    o.type === 'spell' && 
                    o.data.tradition === 'fire'
                );
                
                if (!spellOption || spellOption.type !== 'spell') throw new Error('Spell option not found');
                
                const spell: Spell = {
                    id: spellOption.id,
                    name: spellOption.name,
                    tradition: spellOption.data.tradition!,
                    level: spellOption.data.level!,
                    type: 'attack', // Specify the SpellType directly
                    description: spellOption.data.description || '',
                    source: 'tradition'
                };
                
                expect(() => {
                    character.applyChoice(firstChoice!.id, [spell]);
                }).toThrow();
            });
        });
    });

    describe("Level 2", () => {
        beforeEach(() => {
            character = magicianCharacterFactory();
            character.levelUp(); // Level 1 - applies +2 health
            character.levelUp(); // Level 2 - applies +2 health
        });

        test("Has correct attribute modifications", () => {
            const attrs = character.attributes;
            expect(attrs.health).toBe(14); // Base 10 + 2 from level 1 + 2 from level 2
            
            const spellRecovery = attrs.skills.find(s => s.name === "Spell Recovery");
            expect(spellRecovery).toBeDefined();
            expect(spellRecovery?.description).toContain("heal damage equal to your healing rate");
        });

        test("Has two magic choices", () => {
            const choices = magicianNovicePath.getChoicesForLevel(2);
            const magicChoices = choices.filter(c => c.id.startsWith('level2-magic-choice'));
            
            expect(magicChoices).toHaveLength(2);
            magicChoices.forEach(choice => {
                expect(choice.options).toBeDefined();
                expect(choice.options.length).toBeGreaterThan(0);
                expect(choice.maxSelections).toBe(1);
            });
        });

        test("Shows complete Level 2 Magician state", () => {
            // Setup Level 1 choices first
            const level1Choices = magicianNovicePath.getChoicesForLevel(1);
            
            // Select Fire tradition
            const traditionChoice = level1Choices.find(c => c.id === 'level1-magic-choice-1');
            const fireTraditionOption = traditionChoice?.options.find(o => o.id === fireTradition.id);
            
            if (fireTraditionOption && fireTraditionOption.type === 'tradition') {
                const choice: TraditionChoice = {
                    id: fireTraditionOption.id,
                    name: fireTraditionOption.name,
                    type: 'tradition',
                    data: {
                        spellSlots: fireTraditionOption.data.spellSlots || 1,
                        level0Spells: fireTraditionOption.data.level0Spells || []
                    }
                };
                character.applyChoice(traditionChoice!.id, [choice]);
            }

            // Select Academic Knowledge
            const academicChoice = level1Choices.find(c => c.id === 'level1-academic-knowledge');
            const historyOption = academicChoice?.options[0];
            if (historyOption) {
                const professionChoice: ProfessionChoice = {
                    id: 'history',
                    name: 'History',
                    type: 'profession',
                    data: {
                        description: historyOption.data.description || ''
                    }
                };
                character.applyChoice(academicChoice!.id, [professionChoice]);
            }

            // Log complete character state
            console.log('\n=== Level 2 Magician State ===');
            console.log('\nAttributes:', {
                health: character.attributes.health,
                power: character.attributes.power,
                defense: character.attributes.defense,
                // Temporarily remove spellSlots until implemented
            });
            
            console.log('\nSkills:', character.attributes.skills.map(s => ({
                name: s.name,
                description: s.description
            })));
            
            console.log('\nProfessions:', character.attributes.professions);
            
            console.log('\nSpells:', character.getSpells().map(s => ({
                name: s.name,
                tradition: s.tradition,
                level: s.level
            })));
            
            console.log('\nAvailable Level 2 Choices:');
            const level2Choices = magicianNovicePath.getChoicesForLevel(2);
            level2Choices.forEach(choice => {
                console.log(`\n${choice.name}:`, 
                    choice.options.map(o => ({
                        name: o.name,
                        type: o.type,
                        tradition: o.data.tradition,
                        level: o.data.level
                    }))
                );
            });
        });
    });
}); 