import { AttributeModifierSchema } from "./serializationSchema";

/**
 * Base schema for all path types
 */
export interface BasePathSchema {
	name: string;
	type: PathType;
	description?: string;
}

/**
 * Type of path (Novice, Expert, Master)
 */
export type PathType = "novice" | "expert" | "master";

/**
 * Schema for novice paths
 */
export interface NovicePathSchema extends BasePathSchema {
	type: "novice";
	level1: AttributeModifierSchema;
	level2: AttributeModifierSchema;
	level5: AttributeModifierSchema;
	level8: AttributeModifierSchema;
}

/**
 * Schema for expert paths
 */
export interface ExpertPathSchema extends BasePathSchema {
	type: "expert";
	level3: AttributeModifierSchema;
	level6: AttributeModifierSchema;
	level9: AttributeModifierSchema;
}

/**
 * Schema for master paths
 */
export interface MasterPathSchema extends BasePathSchema {
	type: "master";
	level7: AttributeModifierSchema;
	level10: AttributeModifierSchema;
}

/**
 * Combined union type for all path schemas
 */
export type PathSchema = NovicePathSchema | ExpertPathSchema | MasterPathSchema;
