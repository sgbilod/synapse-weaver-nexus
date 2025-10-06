// Export core cognitive types
export type {
  TaskVector,
  AgentProfile,
  AgentCredibility,
  ExecutionPlan,
  ExecutionReceipt,
} from "./cognitive.types";

// Export orchestration engine interface
export type { IOrchestrationEngine } from "./nexus-core";

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
