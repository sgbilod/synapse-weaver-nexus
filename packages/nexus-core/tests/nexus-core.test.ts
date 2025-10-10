// packages/nexus-core/tests/nexus-core.test.ts
import type { TaskVector, AgentProfile, IOrchestrationEngine } from "../src";

describe("Cognitive Architecture Blueprint", () => {
  test("TaskVector interface should have a defined structure", () => {
    // This test passes if the types compile, effectively testing the interface shape.
    const vector: Partial<TaskVector> = {
      id: "test-id",
      naturalLanguageIntent: "test intent",
      constraints: {
        maxBudget: 100,
        maxTimeSeconds: 30,
        requiredCredibility: 0.5,
      },
    };
    expect(vector.id).toBe("test-id");
    expect(typeof vector.constraints).toBe("object");
  });

  test("AgentProfile interface should support different archetypes", () => {
    const sentinelProfile: Partial<AgentProfile> = { archetype: "Sentinel" };
    const scoutProfile: Partial<AgentProfile> = { archetype: "Scout" };
    expect(sentinelProfile.archetype).toBe("Sentinel");
    expect(scoutProfile.archetype).toBe("Scout");
  });

  test("IOrchestrationEngine interface should define the core methods", () => {
    // We can't test an interface directly, but we can create a mock implementation
    // to ensure its methods are part of our conceptual landscape.
    class MockEngine implements IOrchestrationEngine {
      receiveTask = jest.fn();
      createExecutionPlan = jest.fn();
      dispatchSwarm = jest.fn();
      processReceipt = jest.fn();
    }
    const engine = new MockEngine();
    expect(typeof engine.receiveTask).toBe("function");
    expect(typeof engine.createExecutionPlan).toBe("function");
    expect(typeof engine.dispatchSwarm).toBe("function");
    expect(typeof engine.processReceipt).toBe("function");
  });
});
