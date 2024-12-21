import { AttributeModifier, Novice } from "../../../attributes";

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
						"Area: A sphere with a 5-yard radius centered on a point within your space. You know if there are any ongoing magical effects in the area and from what points they originate.",
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
				availableProfessions: ["Academic Knowledge"],
				defaultProfessions: ["Academic Knowledge"],
			},
			{
				type: "spell",
				count: 4,
				choices: [
					{ type: "discoverTradition" }, // First choice must be discovering a tradition
					{ type: "flexibleChoice" }, // Three flexible choices
					{ type: "flexibleChoice" },
					{ type: "flexibleChoice" },
				],
				specificSpells: ["senseMagic"],
			},
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
			choices: [
				{ type: "flexibleChoice" }, // Can either discover a tradition or learn a spell
			],
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
