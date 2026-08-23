import type { Domain, Generator } from "../types";
import { generateFluidReasoning } from "./fluidReasoning";
import { generateWorkingMemory } from "./workingMemory";
import { generateSpatialReasoning } from "./spatialReasoning";
import { generateProcessingSpeed } from "./processingSpeed";
import { generateQuantitativeReasoning } from "./quantitativeReasoning";

export const GENERATORS: Record<Domain, Generator> = {
  fluidReasoning: generateFluidReasoning,
  workingMemory: generateWorkingMemory,
  spatialReasoning: generateSpatialReasoning,
  processingSpeed: generateProcessingSpeed,
  quantitativeReasoning: generateQuantitativeReasoning,
};

export * from "./fluidReasoning";
export * from "./workingMemory";
export * from "./spatialReasoning";
export * from "./processingSpeed";
export * from "./quantitativeReasoning";
