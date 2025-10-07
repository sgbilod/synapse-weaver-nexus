// packages/nexus-core/src/nexus-core.ts
import {
  TaskVector,
  ExecutionPlan,
  ExecutionReceipt,
  AgentCredibility,
} from "./cognitive.types";

/**
 * The central orchestrator for the Synapse Weaver system.
 * This engine is responsible for interpreting tasks, optimizing resources,
 * deploying agent swarms, and learning from outcomes.
 */
export interface IOrchestrationEngine {
  /**
   * Receives a task from the Synapse Bridge and begins processing.
   * This is the primary entry point for all developer requests.
   * @param vector - The task vector containing developer intent and context
   * @param projectRootPath - Absolute path to the project root for agent execution
   */
  receiveTask(
    vector: TaskVector,
    projectRootPath: string
  ): Promise<ExecutionReceipt>;

  /**
   * Analyzes a TaskVector using the Economic Genesis Engine to produce
   * the most efficient execution plan. This considers cost, time, and quality.
   */
  createExecutionPlan(vector: TaskVector): ExecutionPlan;

  /**
   * Deploys and manages an agent swarm based on a given plan.
   * This function handles the containerization and communication.
   * @param plan - The execution plan to execute
   * @param projectRootPath - Absolute path to the project root for Docker volume mounting
   */
  dispatchSwarm(
    plan: ExecutionPlan,
    projectRootPath: string
  ): Promise<ExecutionReceipt>;

  /**
   * Updates the Agent Credibility Engine based on the results of an execution.
   * This is a critical part of the system's self-governing security model.
   */
  processReceipt(receipt: ExecutionReceipt): AgentCredibility;
}
