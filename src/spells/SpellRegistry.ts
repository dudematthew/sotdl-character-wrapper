import {
	Spell,
	SpellTradition,
	SpellChoice,
	SpellChoiceOption,
} from "../types/spell";

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

	getAvailableSpellsForChoice(
		choice: SpellChoice,
		maxPowerLevel: number,
		choiceIndex?: number
	): Spell[] {
		let spells = Array.from(this.spells.values());

		// If we have a specific choice index, validate against the choice type
		if (choiceIndex !== undefined && choice.choices[choiceIndex]) {
			const choiceType = choice.choices[choiceIndex].type;
			if (choiceType === "learnSpell") {
				// Only return spells, no traditions allowed
				if (choice.choices[choiceIndex].restrictToTraditions?.length) {
					spells = spells.filter((spell) =>
						choice.choices[
							choiceIndex
						].restrictToTraditions?.includes(spell.tradition)
					);
				}
			} else if (choiceType === "discoverTradition") {
				// Only return spells from undiscovered traditions
				// This would require tracking discovered traditions in Character class
				return [];
			} else if (choiceType === "flexibleChoice") {
				// Both spells and traditions are allowed
				if (choice.choices[choiceIndex].restrictToTraditions?.length) {
					spells = spells.filter((spell) =>
						choice.choices[
							choiceIndex
						].restrictToTraditions?.includes(spell.tradition)
					);
				}
			}
		}

		// Filter by specific spells if specified
		if (choice.specificSpells?.length) {
			spells = spells.filter((spell) =>
				choice.specificSpells?.includes(spell.id)
			);
		}

		// Filter by power level
		spells = spells.filter((spell) => spell.rank <= maxPowerLevel);

		return spells;
	}

	validateSpellChoice(
		choice: SpellChoice,
		selectedChoices: SpellChoiceOption[]
	): boolean {
		// Validate number of choices
		if (selectedChoices.length > choice.count) {
			return false;
		}

		// Validate each choice matches its type constraint
		return selectedChoices.every((selected, index) => {
			if (index >= choice.choices.length) return false;

			const choiceType = choice.choices[index].type;
			if (choiceType === "learnSpell") {
				return selected.type === "learnSpell";
			} else if (choiceType === "discoverTradition") {
				return selected.type === "discoverTradition";
			} else if (choiceType === "flexibleChoice") {
				return (
					selected.type === "learnSpell" ||
					selected.type === "discoverTradition"
				);
			}
			return false;
		});
	}

	getAvailableTraditionsForChoice(
		choice: SpellChoice,
		choiceIndex: number,
		discoveredTraditions: string[]
	): SpellTradition[] {
		const choiceType = choice.choices[choiceIndex]?.type;
		if (choiceType === "learnSpell") {
			return []; // Can't discover traditions with this choice type
		}

		let traditions = Array.from(this.traditions.values());

		// Filter out already discovered traditions
		traditions = traditions.filter(
			(tradition) => !discoveredTraditions.includes(tradition.id)
		);

		// Filter by restricted traditions if specified
		if (choice.choices[choiceIndex].restrictToTraditions?.length) {
			traditions = traditions.filter((tradition) =>
				choice.choices[choiceIndex].restrictToTraditions?.includes(
					tradition.id
				)
			);
		}

		return traditions;
	}

	getAllTraditions(): SpellTradition[] {
		return Array.from(this.traditions.values());
	}

	clear(): void {
		this.spells.clear();
		this.traditions.clear();
	}
}
