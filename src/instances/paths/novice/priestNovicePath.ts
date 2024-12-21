import { AttributeModifier, Novice } from "../../../attributes";

export type ReligiousTraditions = {
	[key: string]: string[];
};

export const RELIGIOUS_TRADITIONS: ReligiousTraditions = {
	"Cult of the New God": ["celestial", "life", "theurgy"],
	"Dwarfen Ancestors": ["battle", "earth", "life"],
	"Old Faith": ["life", "nature", "primal"],
	Witchcraft: ["curse", "enchantment", "life"],
};

const priestNovicePath = new Novice(
	// Level 1
	new AttributeModifier(
		{
			power: 1,
			health: 4,
			skills: [
				{
					name: "Shared Recovery",
					description:
						"You can use an action to heal damage equal to your healing rate. Then, choose one creature other than you that is within short range. The target also heals damage equal to its healing rate. Once you use this talent, you cannot use it again until after you complete a rest.",
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
				availableProfessions: ["Religious Knowledge"],
				defaultProfessions: ["Religious Knowledge"],
			},
			{
				// Language choice: either read existing or learn new
				type: "language",
				count: 1,
				canReadExisting: true,
				canLearnNew: true,
			},
			{
				// Initial tradition discovery (mandatory)
				type: "spell",
				count: 1,
				choices: [{ type: "discoverTradition" }],
				// restrictToTraditions will be set based on chosen religion
			},
			{
				// Two additional choices
				type: "spell",
				count: 2,
				choices: [{ type: "learnSpell" }, { type: "learnSpell" }],
			},
		]
	),
	// Level 2
	new AttributeModifier(
		{
			health: 4,
			skills: [
				{
					name: "Prayer",
					description:
						"When a creature within short range of you makes an attack roll or challenge roll, you can use a triggered action to grant 1 boon on the triggering roll.",
				},
			],
		},
		{
			type: "spell",
			count: 2,
			choices: [{ type: "learnSpell" }, { type: "learnSpell" }],
			// restrictToTraditions will be set based on chosen religion
		}
	),
	// Level 5
	new AttributeModifier(
		{
			power: 1,
			health: 4,
			skills: [
				{
					name: "Divine Strike",
					description:
						"When you use Prayer to grant a creature 1 boon on an attack roll, the creature's attacks with weapons deal 1d6 extra damage.",
				},
			],
		},
		{
			type: "spell",
			count: 1,
			choices: [{ type: "learnSpell" }],
		}
	),
	// Level 8
	new AttributeModifier(
		{
			health: 4,
			skills: [
				{
					name: "Inspiring Prayer",
					description:
						"When you use Prayer on a creature other than yourself, you make attack rolls and challenge rolls with 1 boon for 1 round.",
				},
				{
					name: "Improved Shared Recovery",
					description: "You can use Shared Recovery twice.",
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

export default priestNovicePath;
