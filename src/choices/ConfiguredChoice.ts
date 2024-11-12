import { ChoiceOption } from './types';

export interface ChoiceConfig {
    id: string;
    name: string;
    description: string;
    options: ChoiceOption[];
    maxSelections: number;
    minSelections: number;
    behavior: 'FirstAvailable' | 'Manual';
}

export class ConfiguredChoiceBuilder {
    private id: string = '';
    private name: string = '';
    private description: string = '';
    private options: ChoiceOption[] = [];
    private maxSelections: number = 1;
    private minSelections: number = 1;
    private behavior: 'FirstAvailable' | 'Manual' = 'Manual';

    withId(id: string) {
        this.id = id;
        return this;
    }

    withName(name: string) {
        this.name = name;
        return this;
    }

    withDescription(description: string) {
        this.description = description;
        return this;
    }

    withOptions(options: ChoiceOption[]) {
        this.options = options;
        return this;
    }

    withSelections(max: number, min: number = 1) {
        this.maxSelections = max;
        this.minSelections = min;
        return this;
    }

    withBehavior(behavior: 'FirstAvailable' | 'Manual') {
        this.behavior = behavior;
        return this;
    }

    build(): ChoiceConfig {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            options: this.options,
            maxSelections: this.maxSelections,
            minSelections: this.minSelections,
            behavior: this.behavior
        };
    }
} 