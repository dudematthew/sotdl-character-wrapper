import { Spell, TraditionChoice } from "./types";

export class SpellChoiceManager {
    private traditions: Map<string, TraditionChoice> = new Map();
    private spellsByTradition: Map<string, Set<Spell>> = new Map();

    getTraditions(): TraditionChoice[] {
        return Array.from(this.traditions.values());
    }

    getSpellsByTradition(traditionId: string): Spell[] {
        return Array.from(this.spellsByTradition.get(traditionId) || []);
    }

    addTradition(tradition: TraditionChoice) {
        this.traditions.set(tradition.id, tradition);
        this.spellsByTradition.set(tradition.id, new Set());
        // Add level 0 spells automatically
        tradition.data.level0Spells?.forEach(spell => {
            this.addSpell(tradition.id, spell);
        });
    }

    addSpell(traditionId: string, spell: Spell) {
        const spells = this.spellsByTradition.get(traditionId);
        if (!spells) {
            throw new Error(`Tradition ${traditionId} not found`);
        }
        spells.add(spell);
    }
} 