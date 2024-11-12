import {
	characterConfig,
	mainAttributes,
	secondaryAttributes,
	attributes,
} from "../types";
import { Ancestry } from "./Ancestry";
import { Novice } from "../attributes/Novice";
import { Expert } from "../attributes/Expert";
import { Master } from "../attributes/Master";
import { Path } from "../attributes/Path";
import { Spell, TraditionChoice, SpellChoiceManager } from "../magic";
import { CharacterChoice } from "../choices/types";

export class Character {
	public name: string;
	public level: number = 0;
	public ancestry: Ancestry;
	public novicePath: Novice | null = null;
	public expertPath: Expert | null = null;
	public masterPath: Master | null = null;
	private spellManager: SpellChoiceManager;
	private _attributes: attributes;

	constructor(config: characterConfig, ancestry: Ancestry) {
		this.name = config.name;
		this.ancestry = ancestry;
		this.level = 0;
		this.spellManager = new SpellChoiceManager();
		this._attributes = {
			strength: 0,
			agility: 0,
			intellect: 0,
			will: 0,
			perception: 0,
			defense: 0,
			health: 0,
			healingRate: 0,
			size: 0,
			speed: 0,
			power: 0,
			damage: 0,
			insanity: 0,
			corruption: 0,
			languages: [],
			professions: [],
			skills: []
		};
	}

	get attributes(): attributes {
		let mainAttributes = { ...this.ancestry.mainAttributes };
		let secondaryAttributes = this.calculateSecondaryAttributes(mainAttributes);
		const chosenProfessions = [...this._attributes.professions];

		// Let paths apply their own modifiers
		if (this.novicePath) {
			this.novicePath.applyModifiers(this, mainAttributes, secondaryAttributes);
		}
		if (this.expertPath) {
			this.expertPath.applyModifiers(this, mainAttributes, secondaryAttributes);
		}
		if (this.masterPath) {
			this.masterPath.applyModifiers(this, mainAttributes, secondaryAttributes);
		}

		// Let ancestry apply its own modifiers
		this.ancestry.applyModifiers(this, mainAttributes, secondaryAttributes);

		// Calculate healing rate after all health modifiers
		secondaryAttributes.healingRate = Math.floor(secondaryAttributes.health / 4);

		// Merge professions
		secondaryAttributes.professions = [
			...chosenProfessions,
			...secondaryAttributes.professions
		];

		return { ...mainAttributes, ...secondaryAttributes };
	}

	private calculateSecondaryAttributes(mainAttrs: mainAttributes): secondaryAttributes {
		const rules = this.ancestry.secondaryAttributeRules;
		let secondaryAttrs: secondaryAttributes = {
			perception: 0,
			defense: 0,
			health: 0,
			healingRate: 0,
			size: 0,
			speed: 0,
			power: 0,
			damage: 0,
			insanity: 0,
			corruption: 0,
			languages: [],
			professions: [],
			skills: [],
		};

		// Apply all secondary attribute rules
		for (const key in rules) {
			const rule = rules[key as keyof secondaryAttributes];
			if (key === "languages" || key === "professions" || key === "skills") {
				(secondaryAttrs[key as keyof secondaryAttributes] as any[])
					.push(...(rule(mainAttrs, this.level, secondaryAttrs) as any[]));
			} else {
				(secondaryAttrs[key as keyof secondaryAttributes] as number) = 
					rule(mainAttrs, this.level, secondaryAttrs) as number;
			}
		}

		return secondaryAttrs;
	}

	setPath(path: Path) {
		if (path instanceof Novice) {
			this.novicePath = path;
		} else if (path instanceof Expert) {
			this.expertPath = path;
		} else if (path instanceof Master) {
			this.masterPath = path;
		}
	}

	private calculateMainAttributes(): mainAttributes {
		return { ...this.ancestry.mainAttributes };
	}

	levelUp() {
		this.level++;
		
		// Recalculate all attributes when leveling up
		const mainAttrs = this.calculateMainAttributes();
		const secondaryAttrs = this.calculateSecondaryAttributes(mainAttrs);
		
		// Apply path modifiers
		if (this.novicePath) {
			this.novicePath.applyModifiers(this, mainAttrs, secondaryAttrs);
		}
		if (this.expertPath) {
			this.expertPath.applyModifiers(this, mainAttrs, secondaryAttrs);
		}
		if (this.masterPath) {
			this.masterPath.applyModifiers(this, mainAttrs, secondaryAttrs);
		}
		
		// Update attributes
		this._attributes = { ...mainAttrs, ...secondaryAttrs };
	}

	getSpells(): Spell[] {
		const allSpells: Spell[] = [];
		this.spellManager.getTraditions().forEach(tradition => {
			allSpells.push(...this.spellManager.getSpellsByTradition(tradition.id));
		});
		return allSpells;
	}

	// Add method to handle choice results
	applyChoice(choiceId: string, selected: CharacterChoice[]) {
		selected.forEach(item => {
			if ('type' in item && item.type === 'tradition') {
				this.spellManager.addTradition(item as TraditionChoice);
			} else if ('tradition' in item) {
				this.spellManager.addSpell(item.tradition, item as Spell);
			} else if ('type' in item && item.type === 'profession') {
				// Add new profession to existing array
				this._attributes.professions = [...this._attributes.professions, item.name];
			}
		});
	}
}
