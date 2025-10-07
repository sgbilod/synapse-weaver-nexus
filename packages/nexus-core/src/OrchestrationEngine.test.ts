// packages/nexus-core/src/OrchestrationEngine.test.ts
import { OrchestrationEngine } from "./OrchestrationEngine";
import { TaskVector, ExecutionReceipt } from "./cognitive.types";

describe("OrchestrationEngine v1", () => {
  let engine: OrchestrationEngine;

  beforeEach(() => {
    engine = new OrchestrationEngine();
  });

  const createMockVector = (
    action: TaskVector["parsedIntent"]["primaryAction"]
  ): TaskVector => ({
    id: "mock-task-id",
    timestamp: Date.now(),
    sourceCode: "const x = 1;",
    naturalLanguageIntent: "do the thing",
    parsedIntent: {
      primaryAction: action,
      subject: "the thing",
      context: [],
    },
    projectContext: {
      projectId: "mock-project",
      filePath: "/mock/file.ts",
      projectStyleGuide: {},
    },
    constraints: {
      maxBudget: 1,
      maxTimeSeconds: 60,
      requiredCredibility: 0.5,
    },
  });

  test("should select a Sentinel agent for a TEST action", () => {
    const vector = createMockVector("TEST");
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe("Sentinel");
  });

  test("should select an Alchemist agent for a REFACTOR action", () => {
    const vector = createMockVector("REFACTOR");
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe("Alchemist");
  });

  test("should select a Scout agent for a RESEARCH action", () => {
    const vector = createMockVector("RESEARCH");
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe("Scout");
  });

  test("should select a Drone agent for any other action", () => {
    const vector = createMockVector("DOCUMENT");
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe("Drone");
  });
});

describe("Agent Credibility Engine", () => {
  let engine: OrchestrationEngine;

  beforeEach(() => {
    engine = new OrchestrationEngine();
  });

  const createMockReceipt = (
    outcome: ExecutionReceipt["outcome"],
    wasAccepted: boolean,
    agentId: string = "sentinel-jest-ts-v1"
  ): ExecutionReceipt => ({
    receiptId: "mock-receipt-id",
    planId: "mock-plan-id",
    taskId: "mock-task-id",
    outcome,
    finalCost: 1.5,
    finalTimeSeconds: 30,
    results: [
      {
        agentId,
        output: "Mock output",
        wasAccepted,
      },
    ],
  });

  test("should increase agent credibility on successful, accepted task", () => {
    const receipt = createMockReceipt("COMPLETED", true);

    const credibility = engine.processReceipt(receipt);

    expect(credibility.score).toBeGreaterThan(0.5); // Started at 0.5, should increase
    expect(credibility.score).toBe(0.55); // 0.5 + 0.05
    expect(credibility.history).toHaveLength(1);
    expect(credibility.history[0].outcome).toBe("SUCCESS");
    expect(credibility.history[0].credibilityChange).toBe(0.05);
  });

  test("should decrease agent credibility on failed task", () => {
    const receipt = createMockReceipt("FAILED", false);

    const credibility = engine.processReceipt(receipt);

    expect(credibility.score).toBeLessThan(0.5); // Started at 0.5, should decrease
    expect(credibility.score).toBe(0.4); // 0.5 - 0.10
    expect(credibility.history).toHaveLength(1);
    expect(credibility.history[0].outcome).toBe("FAILURE");
    expect(credibility.history[0].credibilityChange).toBe(-0.1);
  });

  test("should cap credibility scores at 0.0 and 1.0", () => {
    const agentId = "test-agent";

    // Test lower bound: simulate 10 failures
    for (let i = 0; i < 10; i++) {
      engine.processReceipt(createMockReceipt("FAILED", false, agentId));
    }
    let credibility = engine.processReceipt(
      createMockReceipt("FAILED", false, agentId)
    );
    expect(credibility.score).toBe(0.0);
    expect(credibility.score).toBeGreaterThanOrEqual(0.0);

    // Test upper bound: simulate 20 successes from fresh state
    const newEngine = new OrchestrationEngine();
    for (let i = 0; i < 20; i++) {
      newEngine.processReceipt(createMockReceipt("COMPLETED", true, agentId));
    }
    credibility = newEngine.processReceipt(
      createMockReceipt("COMPLETED", true, agentId)
    );
    expect(credibility.score).toBe(1.0);
    expect(credibility.score).toBeLessThanOrEqual(1.0);
  });

  test("should throw error when agent credibility is insufficient", async () => {
    const agentId = "sentinel-jest-ts-v1";

    // Lower the agent's credibility by causing failures
    for (let i = 0; i < 3; i++) {
      engine.processReceipt(createMockReceipt("FAILED", false, agentId));
    }

    // Create a task vector that requires high credibility
    const vector: TaskVector = {
      id: "high-trust-task",
      timestamp: Date.now(),
      sourceCode: "const x = 1;",
      naturalLanguageIntent: "critical task",
      parsedIntent: {
        primaryAction: "TEST",
        subject: "critical",
        context: [],
      },
      projectContext: {
        projectId: "mock-project",
        filePath: "/mock/file.ts",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 10,
        maxTimeSeconds: 300,
        requiredCredibility: 0.9, // Require very high credibility
      },
    };

    const plan = engine.createExecutionPlan(vector);

    // dispatchSwarm should throw due to insufficient credibility
    await expect(
      engine.dispatchSwarm(plan, "/mock/project/path")
    ).rejects.toThrow(/insufficient credibility/);
  });
});

describe("Personal En-gram System", () => {
  let engine: OrchestrationEngine;

  beforeEach(() => {
    engine = new OrchestrationEngine();
  });

  const createMockReceipt = (
    output: string,
    wasAccepted: boolean = true
  ): ExecutionReceipt => ({
    receiptId: "mock-receipt-id",
    planId: "mock-plan-id",
    taskId: "mock-task-id",
    outcome: "COMPLETED",
    finalCost: 1.5,
    finalTimeSeconds: 30,
    results: [
      {
        agentId: "sentinel-jest-ts-v1",
        output,
        wasAccepted,
      },
    ],
  });

  test("should detect and store spaces indentation style", () => {
    const spacesCode = `function test() {
  const x = 1;
  const y = 2;
  return x + y;
}`;

    const receipt = createMockReceipt(spacesCode);
    engine.processReceipt(receipt);

    // Create a plan to verify the learned style is applied
    const vector: TaskVector = {
      id: "test-task",
      timestamp: Date.now(),
      sourceCode: "test",
      naturalLanguageIntent: "create a function",
      parsedIntent: {
        primaryAction: "CREATE",
        subject: "function",
        context: [],
      },
      projectContext: {
        projectId: "test",
        filePath: "/test.ts",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 10,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5,
      },
    };

    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].taskChunk).toContain("Use spaces for indentation");
  });

  test("should detect and store tabs indentation style", () => {
    const tabsCode = `function test() {
\tconst x = 1;
\tconst y = 2;
\treturn x + y;
}`;

    const receipt = createMockReceipt(tabsCode);
    engine.processReceipt(receipt);

    const vector: TaskVector = {
      id: "test-task",
      timestamp: Date.now(),
      sourceCode: "test",
      naturalLanguageIntent: "create a function",
      parsedIntent: {
        primaryAction: "CREATE",
        subject: "function",
        context: [],
      },
      projectContext: {
        projectId: "test",
        filePath: "/test.ts",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 10,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5,
      },
    };

    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].taskChunk).toContain("Use tabs for indentation");
  });

  test("should detect and store single quote style", () => {
    const singleQuoteCode = `const message = 'hello';
const name = 'world';
const greeting = 'hello world';`;

    const receipt = createMockReceipt(singleQuoteCode);
    engine.processReceipt(receipt);

    const vector: TaskVector = {
      id: "test-task",
      timestamp: Date.now(),
      sourceCode: "test",
      naturalLanguageIntent: "create a variable",
      parsedIntent: {
        primaryAction: "CREATE",
        subject: "variable",
        context: [],
      },
      projectContext: {
        projectId: "test",
        filePath: "/test.ts",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 10,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5,
      },
    };

    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].taskChunk).toContain("Use single quotes for strings");
  });

  test("should detect and store double quote style", () => {
    const doubleQuoteCode = `const message = "hello";
const name = "world";
const greeting = "hello world";`;

    const receipt = createMockReceipt(doubleQuoteCode);
    engine.processReceipt(receipt);

    const vector: TaskVector = {
      id: "test-task",
      timestamp: Date.now(),
      sourceCode: "test",
      naturalLanguageIntent: "create a variable",
      parsedIntent: {
        primaryAction: "CREATE",
        subject: "variable",
        context: [],
      },
      projectContext: {
        projectId: "test",
        filePath: "/test.ts",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 10,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5,
      },
    };

    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].taskChunk).toContain("Use double quotes for strings");
  });

  test("should apply combined style guidance from learned patterns", () => {
    // First, learn from code with spaces and double quotes
    const learnedCode = `function example() {
  const message = "Hello World";
  const count = 42;
  return message;
}`;

    const receipt = createMockReceipt(learnedCode);
    engine.processReceipt(receipt);

    // Now create a plan and verify both styles are applied
    const vector: TaskVector = {
      id: "test-task",
      timestamp: Date.now(),
      sourceCode: "test",
      naturalLanguageIntent: "implement feature",
      parsedIntent: {
        primaryAction: "CREATE",
        subject: "feature",
        context: [],
      },
      projectContext: {
        projectId: "test",
        filePath: "/test.ts",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 10,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5,
      },
    };

    const plan = engine.createExecutionPlan(vector);

    // Should contain both guidance elements
    expect(plan.swarm[0].taskChunk).toContain("Use spaces for indentation");
    expect(plan.swarm[0].taskChunk).toContain("Use double quotes for strings");
    expect(plan.swarm[0].taskChunk).toContain("Follow this style guidance:");
  });

  test("should not apply guidance when no patterns learned", () => {
    // Don't learn anything, just create a plan
    const vector: TaskVector = {
      id: "test-task",
      timestamp: Date.now(),
      sourceCode: "test",
      naturalLanguageIntent: "create something",
      parsedIntent: {
        primaryAction: "CREATE",
        subject: "something",
        context: [],
      },
      projectContext: {
        projectId: "test",
        filePath: "/test.ts",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 10,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5,
      },
    };

    const plan = engine.createExecutionPlan(vector);

    // Should be unchanged
    expect(plan.swarm[0].taskChunk).toBe("create something");
    expect(plan.swarm[0].taskChunk).not.toContain("Follow this style guidance");
  });
});
