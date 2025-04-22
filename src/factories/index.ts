/**
 * Factories index
 * This file exports all factory functions from the factories directory
 */

// Export path factory functions
export { createPathFromData } from "./pathFactory";

// Export ancestry factory functions
export { createAncestryFromData } from "./ancestryFactory";

// Export attribute calculation factory functions
export {
	createAttributeCalculationFunction,
	type AttributeCalculationFunction,
} from "./attributeCalculationFactory";

// Export attribute modifier factory functions
export { createAttributeModifierFromSchema } from "./attributeModifierFactory";

// Export choice config factory functions
export { createChoiceConfigFromSchema } from "./choiceConfigFactory";

// Export factory registry
export { factoryRegistry, createFromData } from "./factoryRegistry";
