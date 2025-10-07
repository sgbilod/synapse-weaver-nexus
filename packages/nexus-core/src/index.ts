// Export core cognitive types
export type {
  TaskVector,
  AgentProfile,
  AgentCredibility,
  ExecutionPlan,
  ExecutionReceipt,
  PersonalEnclave,
} from "./cognitive.types";

// Export orchestration engine interface and implementation
export type { IOrchestrationEngine } from "./nexus-core";
export { OrchestrationEngine } from "./OrchestrationEngine";

// Legacy placeholder exports (to be refactored)
export interface EconomicDirective {
  id: string;
  description: string;
  priority: number;
}

export const registerDirective = (
  directive: EconomicDirective
): EconomicDirective => {
  return { ...directive };
};
