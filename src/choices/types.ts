import { Spell, TraditionChoice } from "../magic/types";

export interface ChoiceOption {
    id: string;
    name: string;
    type: 'tradition' | 'spell' | 'profession';
    data: {
        description?: string;
        tradition?: string;
        level?: number;
        spellSlots?: number;
        level0Spells?: Spell[];
    };
}

export interface ProfessionChoice {
    id: string;
    name: string;
    type: 'profession';
    data: {
        description: string;
    };
}

export type CharacterChoice = TraditionChoice | Spell | ProfessionChoice;