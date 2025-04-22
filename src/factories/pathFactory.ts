import { Expert, Master, Novice } from "../attributes";
import { Path } from "../attributes/Path";
import {
	ExpertPathSchema,
	MasterPathSchema,
	NovicePathSchema,
	PathSchema,
} from "../serialization/pathSchema";
import { createAttributeModifierFromSchema } from "./attributeModifierFactory";

/**
 * Factory function to create path objects from schema data
 * This is the main entry point for path creation
 */
export function createPathFromData(data: PathSchema): Path {
	switch (data.type) {
		case "novice":
			return createNovicePathFromData(data);
		case "expert":
			return createExpertPathFromData(data);
		case "master":
			return createMasterPathFromData(data);
		default:
			throw new Error(`Unknown path type: ${(data as any).type}`);
	}
}

/**
 * Creates a novice path from schema data
 */
function createNovicePathFromData(data: NovicePathSchema): Novice {
	// Convert attribute modifier schemas to attribute modifiers
	const level1Mod = createAttributeModifierFromSchema(data.level1);
	const level2Mod = createAttributeModifierFromSchema(data.level2);
	const level5Mod = createAttributeModifierFromSchema(data.level5);
	const level8Mod = createAttributeModifierFromSchema(data.level8);

	// Create and return a new novice path
	return new Novice(level1Mod, level2Mod, level5Mod, level8Mod);
}

/**
 * Creates an expert path from schema data
 */
function createExpertPathFromData(data: ExpertPathSchema): Expert {
	// Convert attribute modifier schemas to attribute modifiers
	const level3Mod = createAttributeModifierFromSchema(data.level3);
	const level6Mod = createAttributeModifierFromSchema(data.level6);
	const level9Mod = createAttributeModifierFromSchema(data.level9);

	// Create and return a new expert path
	return new Expert(level3Mod, level6Mod, level9Mod);
}

/**
 * Creates a master path from schema data
 */
function createMasterPathFromData(data: MasterPathSchema): Master {
	// Convert attribute modifier schemas to attribute modifiers
	const level7Mod = createAttributeModifierFromSchema(data.level7);
	const level10Mod = createAttributeModifierFromSchema(data.level10);

	// Create and return a new master path
	return new Master(level7Mod, level10Mod);
}
