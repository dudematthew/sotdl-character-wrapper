export type SpellSource = 'tradition' | 'path' | 'ancestry';
export type SpellType = 'attack' | 'utility';

export interface Spell {
    id: string;
    name: string;
    tradition: string;
    level: number;
    type: SpellType;
    description: string;
    source: SpellSource;
}

export interface Tradition {
    id: string;
    name: string;
    description: string;
    level0Spells: Spell[];  // Cantrips that come with the tradition
}

export interface MagicSystem {
    traditions: Map<string, Tradition>;
    characterChoices: {
        traditions: Set<string>;
        spells: Map<string, Set<string>>; // tradition -> spell IDs
    };
    defaultChoices: {
        traditions: string[];
        spellsByTradition: Record<string, string[]>;
    };
}

export interface TraditionChoice {
    id: string;
    name: string;
    type: 'tradition';
    data: {
        spellSlots: number;
        level0Spells: Spell[];
    };
} 