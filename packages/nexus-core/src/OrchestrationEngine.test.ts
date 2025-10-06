// packages/nexus-core/src/OrchestrationEngine.test.ts
import { OrchestrationEngine } from './OrchestrationEngine';
import { TaskVector } from './cognitive.types';

describe('OrchestrationEngine v1', () => {
  let engine: OrchestrationEngine;

  beforeEach(() => {
    engine = new OrchestrationEngine();
  });

  const createMockVector = (
    action: TaskVector['parsedIntent']['primaryAction']
  ): TaskVector => ({
    id: 'mock-task-id',
    timestamp: Date.now(),
    sourceCode: 'const x = 1;',
    naturalLanguageIntent: 'do the thing',
    parsedIntent: {
      primaryAction: action,
      subject: 'the thing',
      context: [],
    },
    projectContext: {
      projectId: 'mock-project',
      filePath: '/mock/file.ts',
      projectStyleGuide: {},
    },
    constraints: {
      maxBudget: 1,
      maxTimeSeconds: 60,
      requiredCredibility: 0.5,
    },
  });

  test('should select a Sentinel agent for a TEST action', () => {
    const vector = createMockVector('TEST');
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe('Sentinel');
  });

  test('should select an Alchemist agent for a REFACTOR action', () => {
    const vector = createMockVector('REFACTOR');
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe('Alchemist');
  });

  test('should select a Scout agent for a RESEARCH action', () => {
    const vector = createMockVector('RESEARCH');
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe('Scout');
  });

  test('should select a Drone agent for any other action', () => {
    const vector = createMockVector('DOCUMENT');
    const plan = engine.createExecutionPlan(vector);
    expect(plan.swarm[0].agentProfile.archetype).toBe('Drone');
  });
});
