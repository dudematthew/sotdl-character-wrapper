import { AttributeModifier } from "../../attributes";
import { Ancestry } from "../../character";

/**
 * Defines the Languer ancestry
 * An intelligent people with aptitude for languages and knowledge
 */
const languerAncestry = new Ancestry(
	// Base attributes for Languers - high intellect
	{ strength: 9, agility: 9, intellect: 12, will: 10 },
	// Rules for calculating secondary attributes
	{
		perception: (mainAttrs) => mainAttrs.intellect + 2, // Better perception
		defense: (mainAttrs) => mainAttrs.agility,
		health: (mainAttrs) => mainAttrs.strength - 1, // Slightly less robust
		healingRate: (mainAttrs, level, secondaryAttrs) =>
			Math.floor(secondaryAttrs.health / 4),
		size: () => 1,
		speed: () => 10,
		power: () => 0,
		damage: () => 0,
		insanity: () => 0,
		corruption: () => 0,
		languages: () => ["Common", "High Archaic"], // Start with two fixed languages
		professions: () => ["Scholar"], // Start with one fixed profession
		skills: () => [
			{
				name: "Linguist",
				description:
					"You have a natural aptitude for language acquisition and translation.",
			},
		],
	},
	// Level 4 ancestry benefits
	new AttributeModifier(
		{
			health: 3,
			skills: [
				{
					name: "Knowledge Seeker",
					description:
						"When you make an Intellect challenge roll to recall information, you make the roll with 1 boon.",
				},
			],
		},
		[
			// Skill choice
			{
				type: "skill",
				count: 1,
				availableSkills: [
					{
						name: "Knowledge Seeker",
						description:
							"When you make an Intellect challenge roll to recall information, you make the roll with 1 boon.",
					},
					{
						name: "Polyglot",
						description:
							"You can communicate basic concepts even in languages you don't speak through gestures and linguistic patterns.",
					},
				],
			},
			// Language choice from available options
			{
				type: "language",
				count: 1,
				canReadExisting: true,
				canLearnNew: true,
				availableLanguages: [
					"Elvish",
					"Dwarfish",
					"Goblin",
					"Celestial",
				],
			},
			// Open language choice (any language)
			{
				type: "language",
				count: 1,
				canReadExisting: false,
				canLearnNew: true,
			},
			// Profession choice from available options
			{
				type: "profession",
				count: 1,
				availableProfessions: [
					"Diplomat",
					"Merchant",
					"Scribe",
					"Teacher",
				],
			},
			// Open profession choice (any profession)
			{
				type: "profession",
				count: 1,
				availableProfessions: [],
			},
		]
	)
);

export default languerAncestry;
