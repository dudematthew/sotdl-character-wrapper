import { AttributeModifier, Master } from "../../../attributes";

const acrobatMasterPath = new Master(
	new AttributeModifier(
		{
			health: 3,
			speed: 2,
			languages: ["Elvish"],
			skills: [
				{
					name: "Acrobatics",
					description:
						"You can move through spaces occupied by other creatures.\n• You move at full Speed across all forms of difficult terrain, even when climbing or swimming.\n• Provided your Speed is greater than 0, you can stand up without using your move.\n• When you take damage from landing after a fall, you can use a triggered action to make an Agility challenge roll. On a success, you reduce the damage from the fall by the total of your roll. If you reduce the damage to 0, you land on your feet.",
				},
			],
		},
		{
			count: 3,
			increaseBy: 1,
			defaultAttributes: ["agility", "strength", "intellect"],
		}
	),
	new AttributeModifier({
		health: 3,
		skills: [
			{
				name: "Mobility",
				description:
					"When you take a fast turn, you can use an action and move. Your movement, on any turn, never triggers free attacks.",
			},
		],
	})
);

export default acrobatMasterPath;
