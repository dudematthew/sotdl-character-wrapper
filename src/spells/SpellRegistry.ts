import { Spell, SpellTradition } from "../types/spell";

export class SpellRegistry {
	private static instance: SpellRegistry;
	private spells: Map<string, Spell> = new Map();
	private traditions: Map<string, SpellTradition> = new Map();

	private constructor() {}

	static getInstance(): SpellRegistry {
		if (!SpellRegistry.instance) {
			SpellRegistry.instance = new SpellRegistry();
		}
		return SpellRegistry.instance;
	}

	registerSpell(spell: Spell): void {
		this.spells.set(spell.id, spell);
	}

	registerTradition(tradition: SpellTradition): void {
		this.traditions.set(tradition.id, tradition);
	}

	getSpell(id: string): Spell | undefined {
		return this.spells.get(id);
	}

	getTradition(id: string): SpellTradition | undefined {
		return this.traditions.get(id);
	}

	getSpellsByTradition(traditionId: string): Spell[] {
		return Array.from(this.spells.values()).filter(
			(spell) => spell.tradition === traditionId
		);
	}

	getSpellsByMaxRank(maxRank: number): Spell[] {
		return Array.from(this.spells.values()).filter(
			(spell) => spell.rank <= maxRank
		);
	}

	getSpellsByTraditionAndRank(traditionId: string, maxRank: number): Spell[] {
		return this.getSpellsByTradition(traditionId).filter(
			(spell) => spell.rank <= maxRank
		);
	}

	getAllTraditions(): SpellTradition[] {
		return Array.from(this.traditions.values());
	}

	clear(): void {
		this.spells.clear();
		this.traditions.clear();
	}
}
