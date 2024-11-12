export type ChoiceBehavior = 'Random' | 'FirstAvailable' | 'Weighted';

// The base interface for any selectable item
export interface Selectable {
    id: string;
    name: string;
}

// Configuration for weighted choices
export interface WeightedConfig<T extends Selectable> {
    weights: Record<string, number>; // id -> weight mapping
    defaultWeight?: number;
}

// The core Choice interface
export interface Choice<T extends Selectable> {
    id: string;
    available: T[];          // What can be chosen from
    maxSelections: number;   // How many items can be selected
    minSelections: number;   // Minimum required selections
    behavior: ChoiceBehavior;
    weightConfig?: WeightedConfig<T>;
    selected: T[];           // What was actually chosen
} 