import { AttributeModifier, Novice } from "../../../attributes";
import { SpellChoice } from "../../../types/spell";

const magicianNovicePath = new Novice(
	// Level 1
	new AttributeModifier(
		{
			power: 1,
			health: 2,
			skills: [
				{
					name: "Sense Magic",
					description:
						"You can use an action to extend your awareness to detect the presence of magic. Until the end of the round, you see an aura around any creature or object within short range that bears magic. The aura's color indicates the tradition: blue for arcane magic, gold for celestial magic, green for primal magic, purple for rune magic, red for curse magic, white for song magic, and black for shadow magic. You also know if a creature or object within range is a source of magic, such as a demon, celestial, faerie, or enchanted sword.",
				},
				{
					name: "Cantrip",
					description:
						"Whenever you discover a tradition, you learn an extra rank 0 spell from that tradition.",
				},
				{
					name: "Academic Knowledge",
					description:
						"You read all the languages you know how to speak. In addition, you add one academic area of knowledge of your choice.",
				},
			],
		},
		[
			{
				type: "attribute",
				count: 2,
				increaseBy: 1,
				defaultAttributes: ["intellect", "will"],
			},
			{
				type: "profession",
				count: 1,
				availableProfessions: ["Arcana"],
				defaultProfessions: ["Arcana"],
			},
			{
				type: "language",
				count: 1,
				canReadExisting: true,
				canLearnNew: true,
			},
			{
				type: "spell",
				count: 4,
				choices: [
					{
						type: "discoverTradition",
						description:
							"Choose your primary magical tradition. Common choices include Arcane Magic (air, earth, fire, water), Celestial Magic (air, celestial, fire), or others that suit your character's background.",
						defaultChoice: "arcana",
					},
					{
						type: "flexibleChoice",
						description:
							"Choose to either discover a new tradition or learn a spell from a tradition you know. Consider what would best expand your magical capabilities.",
					},
					{
						type: "flexibleChoice",
						description:
							"Choose to either discover a new tradition or learn a spell from a tradition you know. Consider what would best expand your magical capabilities.",
					},
					{
						type: "flexibleChoice",
						description:
							"Choose to either discover a new tradition or learn a spell from a tradition you know. Consider what would best expand your magical capabilities.",
					},
				],
				specificSpells: ["senseMagic"],
			} as SpellChoice,
		]
	),
	// Level 2
	new AttributeModifier(
		{
			health: 2,
			skills: [
				{
					name: "Spell Recovery",
					description:
						"You can use an action to heal damage equal to your healing rate and regain one casting you expended of a spell you learned. Once you use this talent, you cannot use it again until after you complete a rest.",
				},
			],
		},
		{
			type: "spell",
			count: 2,
			choices: [{ type: "learnSpell" }, { type: "learnSpell" }],
		}
	),
	// Level 5
	new AttributeModifier(
		{
			power: 1,
			health: 2,
			skills: [
				{
					name: "Counterspell",
					description:
						"When a creature you can see attacks you with a spell, you can use a triggered action to counter it. The triggering creature makes the attack roll with 1 bane and you make the challenge roll to resist it with 1 boon.",
				},
			],
		},
		{
			type: "spell",
			count: 1,
			choices: [{ type: "flexibleChoice" }],
		}
	),
	// Level 8
	new AttributeModifier(
		{
			health: 2,
			skills: [
				{
					name: "Improved Spell Recovery",
					description:
						"When you use Spell Recovery, you regain two castings instead of one.",
				},
			],
		},
		{
			type: "spell",
			count: 1,
			choices: [{ type: "learnSpell" }],
		}
	)
);

export default magicianNovicePath;
