import { AttributeModifier, Expert } from "../../../attributes";

const assassinExpertPath = new Expert(
	// Level 3
	new AttributeModifier({
		perception: 1,
		health: 3,
		languages: ["Dwarfish"],
		professions: ["Assassin"],
		skills: [
			{
				name: "Assassinate",
				description:
					"When a surprised creature or a creature from which you are hidden takes damage from your attack, it must make a Strength challenge roll. On a failure, it takes damage equal to its Health.",
			},
			{
				name: "Disguise Expertise",
				description:
					"If you have a disguise kit, you can use an action to expend a use from the kit to don a disguise.",
			},
			{
				name: "Quick Reflexes",
				description:
					"You can use a triggered action on your turn to hide or retreat.",
			},
		],
	}),
	// Level 6
	new AttributeModifier({
		health: 3,
		skills: [
			{
				name: "Manufacture Poison",
				description:
					"You can use an action and an alchemist’s kit to create a dose of poison. You must spend at least 1 minute concentrating, during which time you use the kit and special ingredients worth 5 cp. At the end of this time, you create one dose of poison (see Chapter 6). The poison retains potency until you complete a rest.",
			},
		],
	}),
	// Level 9
	new AttributeModifier({
		health: 3,
		skills: [
			{
				name: "Killer’s Eye",
				description:
					"You can use an action on your turn to choose one creature within long range from which you are hidden. Make a Perception challenge roll. On a success, you know where best to attack the target for 1 minute. Until the effect ends, when you attack the target, you make your attack roll with 1 boon and the attack deals 2d6 extra damage.",
			},
		],
	})
);

export default assassinExpertPath;
