import { Choice, ChoiceBehavior, Selectable, WeightedConfig } from './Choice';

export class ChoiceManager<T extends Selectable> {
    private choice: Choice<T>;

    constructor(
        id: string,
        available: T[],
        maxSelections: number,
        minSelections: number = 0,
        behavior: ChoiceBehavior = 'FirstAvailable',
        weightConfig?: WeightedConfig<T>
    ) {
        this.choice = {
            id,
            available,
            maxSelections,
            minSelections,
            behavior,
            weightConfig,
            selected: []
        };
    }

    private selectRandom(): T[] {
        const shuffled = [...this.choice.available]
            .sort(() => Math.random() - 0.5);
        return shuffled.slice(0, this.choice.maxSelections);
    }

    private selectFirstAvailable(): T[] {
        return this.choice.available
            .slice(0, this.choice.maxSelections);
    }

    private selectWeighted(): T[] {
        if (!this.choice.weightConfig) {
            throw new Error('Weight configuration required for weighted selection');
        }

        const selected: T[] = [];
        const available = [...this.choice.available];

        while (selected.length < this.choice.maxSelections && available.length > 0) {
            let totalWeight = 0;
            const weights = available.map(item => {
                const weight = this.choice.weightConfig!.weights[item.id] ?? 
                    this.choice.weightConfig!.defaultWeight ?? 1;
                totalWeight += weight;
                return weight;
            });

            let random = Math.random() * totalWeight;
            let index = 0;

            while (random > 0 && index < weights.length) {
                random -= weights[index];
                index++;
            }

            selected.push(available[index - 1]);
            available.splice(index - 1, 1);
        }

        return selected;
    }

    public autoSelect(): void {
        switch (this.choice.behavior) {
            case 'Random':
                this.choice.selected = this.selectRandom();
                break;
            case 'FirstAvailable':
                this.choice.selected = this.selectFirstAvailable();
                break;
            case 'Weighted':
                this.choice.selected = this.selectWeighted();
                break;
        }
    }

    public manualSelect(items: T[]): void {
        if (items.length > this.choice.maxSelections) {
            throw new Error(`Cannot select more than ${this.choice.maxSelections} items`);
        }
        if (items.length < this.choice.minSelections) {
            throw new Error(`Must select at least ${this.choice.minSelections} items`);
        }
        if (!items.every(item => this.choice.available.some(a => a.id === item.id))) {
            throw new Error('One or more selections are not available');
        }
        this.choice.selected = items;
    }

    public getSelected(): T[] {
        return [...this.choice.selected];
    }

    public getAvailable(): T[] {
        return [...this.choice.available];
    }
} 