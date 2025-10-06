// packages/nexus-core/src/OrchestrationEngine.ts
import { v4 as uuidv4 } from "uuid";
import Docker from "dockerode";
import { IOrchestrationEngine } from "./nexus-core";
import { TaskVector, ExecutionPlan, ExecutionReceipt } from "./cognitive.types";
import { AGENT_PROFILES } from "./mock.agents";

export class OrchestrationEngine implements IOrchestrationEngine {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }
  public async receiveTask(
    vector: TaskVector,
    projectRootPath: string
  ): Promise<ExecutionPlan> {
    console.log(
      `[NEXUS-CORE] Task ${vector.id} received. Creating execution plan...`
    );
    const plan = this.createExecutionPlan(vector);
    console.log(
      `[NEXUS-CORE] Plan ${plan.planId} created. Ready for dispatch.`
    );
    return Promise.resolve(plan);
  }

  public createExecutionPlan(vector: TaskVector): ExecutionPlan {
    const planId = uuidv4();
    let selectedAgentProfile = AGENT_PROFILES.DRONE_GENERIC_TASK;

    switch (vector.parsedIntent.primaryAction) {
      case "TEST":
        selectedAgentProfile = AGENT_PROFILES.SENTINEL_JEST_TS;
        break;
      case "REFACTOR":
        selectedAgentProfile = AGENT_PROFILES.ALCHEMIST_TS_REFACTOR;
        break;
      case "RESEARCH":
        selectedAgentProfile = AGENT_PROFILES.SCOUT_NPM_VULNERABILITY;
        break;
      default:
        selectedAgentProfile = AGENT_PROFILES.DRONE_GENERIC_TASK;
        break;
    }

    const plan: ExecutionPlan = {
      planId,
      taskId: vector.id,
      taskVector: vector, // Include the original task for agent context
      swarm: [
        {
          agentProfile: selectedAgentProfile,
          taskChunk: vector.naturalLanguageIntent, // v1 sends the full intent to one agent
        },
      ],
      estimatedBudget: selectedAgentProfile.costPerSecond * 30, // Placeholder budget
      estimatedTimeSeconds: 30, // Placeholder time
    };

    return plan;
  }

  public async dispatchSwarm(
    plan: ExecutionPlan,
    projectRootPath: string
  ): Promise<ExecutionReceipt> {
    console.log(`[NEXUS-CORE] Dispatching swarm for plan ${plan.planId}...`);

    const agent = plan.swarm[0]; // v1: single agent execution
    const agentProfile = agent.agentProfile;
    const agentName = agentProfile.id.toLowerCase().replace(/\s+/g, "-");
    const imageName = `synapse-agent-${agentName}:latest`;
    const dockerfilePath = `./packages/agent-foundry/src/${agentName}`;

    const startTime = Date.now();

    try {
      // Step 1: Build the Docker image
      console.log(`[NEXUS-CORE] Building Docker image: ${imageName}...`);
      const buildStream = await this.docker.buildImage(
        {
          context: dockerfilePath,
          src: ["Dockerfile", "agent.ts"],
        },
        { t: imageName }
      );

      // Wait for build to complete
      await new Promise<void>((resolve, reject) => {
        this.docker.modem.followProgress(buildStream, (err, res) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(`[NEXUS-CORE] Docker image built successfully.`);

      // Step 2: Create and start the container
      console.log(`[NEXUS-CORE] Creating container for ${agentName}...`);
      const container = await this.docker.createContainer({
        Image: imageName,
        Cmd: [], // Jest entrypoint handles execution
        HostConfig: {
          Binds: [`${projectRootPath}:/project:ro`], // Mount project as read-only
          AutoRemove: false,
        },
      });

      console.log(`[NEXUS-CORE] Starting container...`);
      await container.start();

      // Step 3: Wait for container to complete
      const result = await container.wait();
      console.log(
        `[NEXUS-CORE] Container exited with status: ${result.StatusCode}`
      );

      // Step 4: Retrieve logs
      const logs = await container.logs({
        stdout: true,
        stderr: true,
      });
      const logOutput = logs.toString("utf-8");
      console.log(`[NEXUS-CORE] Agent logs:\n${logOutput}`);

      // Step 5: Clean up container
      await container.remove();
      console.log(`[NEXUS-CORE] Container removed.`);

      // Step 6: Calculate execution time
      const finalTimeSeconds = (Date.now() - startTime) / 1000;

      // Step 7: Generate execution receipt
      const receipt: ExecutionReceipt = {
        receiptId: uuidv4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: result.StatusCode === 0 ? "COMPLETED" : "FAILED",
        finalCost: agentProfile.costPerSecond * finalTimeSeconds,
        finalTimeSeconds: finalTimeSeconds,
        results: [
          {
            agentId: agentProfile.id,
            output: logOutput,
            wasAccepted: result.StatusCode === 0,
          },
        ],
        ...(result.StatusCode !== 0 && {
          failureAnalysis: {
            failedAgentId: agentProfile.id,
            reason: `Container exited with status ${result.StatusCode}`,
            logs: logOutput,
          },
        }),
      };

      console.log(`[NEXUS-CORE] Receipt ${receipt.receiptId} generated.`);
      return receipt;
    } catch (error) {
      console.error(`[NEXUS-CORE] Swarm dispatch failed:`, error);

      const finalTimeSeconds = (Date.now() - startTime) / 1000;

      // Generate failure receipt
      const receipt: ExecutionReceipt = {
        receiptId: uuidv4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: "FAILED",
        finalCost: agentProfile.costPerSecond * finalTimeSeconds,
        finalTimeSeconds: finalTimeSeconds,
        results: [
          {
            agentId: agentProfile.id,
            output: `Error: ${(error as Error).message}`,
            wasAccepted: false,
          },
        ],
        failureAnalysis: {
          failedAgentId: agentProfile.id,
          reason: `Docker execution failed: ${(error as Error).message}`,
          logs: (error as Error).stack || "",
        },
      };

      return receipt;
    }
  }

  public processReceipt(receipt: ExecutionReceipt): void {
    console.log(
      `[NEXUS-CORE] Processing receipt for plan ${receipt.planId}. This feature is not yet implemented.`
    );
    // In the future, this will update the Agent Credibility Engine.
  }
}
