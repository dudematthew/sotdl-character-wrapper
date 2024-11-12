import { Character } from "../characters";
import { ChoiceManager } from "../choices/ChoiceManager";
import humanAncestry from "../instances/ancestries/HumanAncestry";

interface SpellChoice {
    id: string;
    name: string;
    tradition: string;
    level: number;
}

describe("Choice System", () => {
    let character: Character;
    let spellChoiceManager: ChoiceManager<SpellChoice>;

    beforeEach(() => {
        character = new Character({ name: "Mage" }, humanAncestry);
        
        // Define some test spells
        const availableSpells: SpellChoice[] = [
            { id: "fireball", name: "Fireball", tradition: "Fire", level: 1 },
            { id: "icebolt", name: "Ice Bolt", tradition: "Ice", level: 1 },
            { id: "lightning", name: "Lightning Bolt", tradition: "Storm", level: 1 },
            { id: "heal", name: "Healing Touch", tradition: "Life", level: 1 }
        ];

        spellChoiceManager = new ChoiceManager(
            "level1-spells",
            availableSpells,
            2, // maxSelections
            1, // minSelections
            'FirstAvailable'
        );
    });

    test("First Available Selection", () => {
        spellChoiceManager.autoSelect();
        const selected = spellChoiceManager.getSelected();
        
        expect(selected.length).toBe(2);
        expect(selected[0].id).toBe("fireball");
        expect(selected[1].id).toBe("icebolt");
    });

    test("Manual Selection", () => {
        const availableSpells = spellChoiceManager.getAvailable();
        const selection = [
            availableSpells[2], // lightning
            availableSpells[3]  // heal
        ];

        spellChoiceManager.manualSelect(selection);
        const selected = spellChoiceManager.getSelected();
        
        expect(selected.length).toBe(2);
        expect(selected[0].id).toBe("lightning");
        expect(selected[1].id).toBe("heal");
    });

    test("Weighted Selection", () => {
        const weightedChoiceManager = new ChoiceManager<SpellChoice>(
            "weighted-spells",
            spellChoiceManager.getAvailable(),
            1,
            1,
            'Weighted',
            {
                weights: {
                    fireball: 10,    // High chance
                    icebolt: 1,      // Low chance
                    lightning: 1,     // Low chance
                    heal: 1          // Low chance
                }
            }
        );

        // Run multiple selections to verify weight bias
        const selections: Record<string, number> = {};
        const iterations = 100;

        for (let i = 0; i < iterations; i++) {
            weightedChoiceManager.autoSelect();
            const selected = weightedChoiceManager.getSelected();
            selections[selected[0].id] = (selections[selected[0].id] || 0) + 1;
        }

        // Fireball should be selected more often due to higher weight
        expect(selections['fireball']).toBeGreaterThan(iterations / 3);
    });

    test("Invalid Selection Count", () => {
        const availableSpells = spellChoiceManager.getAvailable();
        
        // Try to select more than maximum
        expect(() => {
            spellChoiceManager.manualSelect([
                availableSpells[0],
                availableSpells[1],
                availableSpells[2]
            ]);
        }).toThrow();

        // Try to select less than minimum
        expect(() => {
            spellChoiceManager.manualSelect([]);
        }).toThrow();
    });
}); 