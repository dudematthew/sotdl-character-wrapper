import { AttributeModifier, Master } from "../../../attributes";

/**
 * Defines the Acrobat master path
 * Focuses on agility and mobility
 */
const acrobatMasterPath = new Master(
	// Level 7
	new AttributeModifier(
		{
			health: 3,
			skills: [
				{
					name: "Acrobatic Defense",
					description:
						"When you use an action to move, you gain +2 to your Defense until the start of your next turn.",
				},
				{
					name: "Tumble",
					description:
						"When a creature attacks you and gets a 0 on the attack roll, you can use a triggered action to move up to your Speed.",
				},
			],
		},
		{
			type: "attribute",
			count: 2,
			increaseBy: 1,
			defaultAttributes: ["agility", "strength", "intellect"],
		}
	),
	// Level 10
	new AttributeModifier({
		health: 3,
		skills: [
			{
				name: "Graceful Recovery",
				description:
					"When you use Catch Your Breath, you can move up to half your Speed without using an action.",
			},
			{
				name: "Improved Acrobatic Defense",
				description:
					"When you use an action to move, you gain +3 to your Defense until the start of your next turn.",
			},
		],
	})
);

export default acrobatMasterPath;
