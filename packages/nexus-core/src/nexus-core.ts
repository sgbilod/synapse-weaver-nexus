// packages/nexus-core/src/nexus-core.ts
import {
  TaskVector,
  ExecutionPlan,
  ExecutionReceipt,
  AgentCredibility,
} from "./cognitive.types.js";

/**
 * The central orchestrator for the Synapse Weaver system.
 * This engine is responsible for interpreting tasks, optimizing resources,
 * deploying agent swarms, and learning from outcomes.
 */
export interface IOrchestrationEngine {
  /**
   * Receives a task from the Synapse Bridge and begins processing.
   * This is the primary entry point for all developer requests.
   * @param _vector - The task vector containing developer intent and context
   * @param _projectRootPath - Absolute path to the project root for agent execution
   */
  receiveTask(
    _vector: TaskVector,
    _projectRootPath: string
  ): Promise<ExecutionReceipt>;

  /**
   * Analyzes a TaskVector using the Economic Genesis Engine to produce
   * the most efficient execution plan. This considers cost, time, and quality.
   * Now async to support AI-powered task decomposition.
   */
  createExecutionPlan(_vector: TaskVector): Promise<ExecutionPlan>;

  /**
   * Deploys and manages an agent swarm based on a given plan.
   * This function handles the containerization and communication.
   * @param _plan - The execution plan to execute
   * @param _projectRootPath - Absolute path to the project root for Docker volume mounting
   */
  dispatchSwarm(
    _plan: ExecutionPlan,
    _projectRootPath: string
  ): Promise<ExecutionReceipt>;

  /**
   * Updates the Agent Credibility Engine based on the results of an execution.
   * This is a critical part of the system's self-governing security model.
   */
  processReceipt(_receipt: ExecutionReceipt): AgentCredibility;
}
