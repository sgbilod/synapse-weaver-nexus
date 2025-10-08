// packages/nexus-core/src/OrchestrationEngine.ts
import { v4 as uuidv4 } from "uuid";
import Docker from "dockerode";
import { IOrchestrationEngine } from "./nexus-core.js";
import {
  TaskVector,
  ExecutionPlan,
  ExecutionReceipt,
  AgentCredibility,
  PersonalEnclave,
} from "./cognitive.types.js";
import { AGENT_PROFILES } from "./mock.agents.js";

export class OrchestrationEngine implements IOrchestrationEngine {
  private docker: Docker;
  private agentCredibilityLedger: Map<string, AgentCredibility>;
  private personalEnclave: PersonalEnclave;

  constructor() {
    this.docker = new Docker();
    this.agentCredibilityLedger = new Map<string, AgentCredibility>();
    this.personalEnclave = {
      indentation: "unknown",
      quoteStyle: "unknown",
      preferredLibraries: new Set<string>(),
    };
  }
  public async receiveTask(
    vector: TaskVector,
    projectRootPath: string
  ): Promise<ExecutionReceipt> {
    console.log(
      `[NEXUS-CORE] Task ${vector.id} received. Creating execution plan...`
    );
    const plan = this.createExecutionPlan(vector);
    console.log(
      `[NEXUS-CORE] Plan ${plan.planId} created. Dispatching swarm...`
    );

    const receipt = await this.dispatchSwarm(plan, projectRootPath);
    console.log(
      `[NEXUS-CORE] Swarm finished. Processing receipt ${receipt.receiptId}...`
    );

    this.processReceipt(receipt);

    return receipt;
  }

  public createExecutionPlan(vector: TaskVector): ExecutionPlan {
    const planId = uuidv4();
    let selectedAgentProfile = AGENT_PROFILES.GENERIC_LLM_V1; // Default to LLM agent

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
      case "CREATE":
      case "DEBUG":
      case "DOCUMENT":
        selectedAgentProfile = AGENT_PROFILES.GENERIC_LLM_V1; // Use LLM for creative tasks
        break;
      default:
        selectedAgentProfile = AGENT_PROFILES.GENERIC_LLM_V1; // Default to LLM agent
        break;
    }

    // Apply learned style guidance to the task
    const styleAwareIntent = this.applyStyleGuidance(
      vector.naturalLanguageIntent
    );

    const plan: ExecutionPlan = {
      planId,
      taskId: vector.id,
      taskVector: vector, // Include the original task for agent context
      swarm: [
        {
          agentProfile: selectedAgentProfile,
          taskChunk: styleAwareIntent, // Use the style-aware intent here
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
    const taskVector = plan.taskVector;

    // Credibility check before execution
    const requiredCredibility = taskVector.constraints.requiredCredibility;
    const agentCredibility =
      this.agentCredibilityLedger.get(agentProfile.id)?.score ?? 0.5;

    if (agentCredibility < requiredCredibility) {
      throw new Error(
        `Agent ${agentProfile.id} has insufficient credibility (${agentCredibility.toFixed(2)}) to perform task requiring (${requiredCredibility}).`
      );
    }

    const agentName = agentProfile.id.toLowerCase().replace(/\s+/g, "-");
    const imageName = `synapse-agent-${agentName}:latest`;

    // Use absolute path from project root
    const path = await import("path");
    const dockerfilePath = path.join(
      projectRootPath,
      "packages",
      "agent-foundry",
      "src",
      agentName
    );

    console.log(`[NEXUS-CORE] Docker context path: ${dockerfilePath}`);

    const startTime = Date.now();

    try {
      // Step 1: Build the Docker image
      console.log(`[NEXUS-CORE] Building Docker image: ${imageName}...`);

      try {
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
            if (err) {
              console.error(`[NEXUS-CORE] Docker build error:`, err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
        console.log(`[NEXUS-CORE] Docker image built successfully.`);
      } catch (buildError) {
        console.error(`[NEXUS-CORE] Failed to build Docker image:`, buildError);
        throw new Error(
          `Docker build failed: ${buildError instanceof Error ? buildError.message : String(buildError)}`
        );
      }
      // Step 2: Create and start the container
      console.log(`[NEXUS-CORE] Creating container for ${agentName}...`);

      // Securely pass API keys from host environment
      const geminiApiKey = process.env.GEMINI_API_KEY || "";
      if (!geminiApiKey && agentName === "generic-llm-agent-v1") {
        console.warn(
          "[NEXUS-CORE] ⚠️  WARNING: GEMINI_API_KEY not found in environment. LLM agent will fail."
        );
      }

      const container = await this.docker.createContainer({
        Image: imageName,
        Cmd: [], // Agent entrypoint handles execution
        Env: [
          `TASK_DESCRIPTION=${taskVector.naturalLanguageIntent}`,
          `TASK_ID=${taskVector.id}`,
          `GEMINI_API_KEY=${geminiApiKey}`, // Securely pass API key to container
        ],
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

  public processReceipt(receipt: ExecutionReceipt): AgentCredibility {
    const agentId = receipt.results[0].agentId;

    // Get the agent's current credibility or create a new record.
    let credibility = this.agentCredibilityLedger.get(agentId) ?? {
      agentId,
      score: 0.5, // Default starting score
      history: [],
    };

    let credibilityChange = 0;
    let historyOutcome: "SUCCESS" | "FAILURE" | "REJECTED";

    if (receipt.outcome === "COMPLETED" && receipt.results[0].wasAccepted) {
      // Successful, accepted tasks build trust.
      credibilityChange = 0.05;
      historyOutcome = "SUCCESS";

      // Learn from accepted code
      this.observeAndLearn(receipt.results[0].output);
    } else if (
      receipt.outcome === "COMPLETED" &&
      !receipt.results[0].wasAccepted
    ) {
      // Completed but rejected results
      credibilityChange = -0.1;
      historyOutcome = "REJECTED";
    } else {
      // Failures or cancellations erode trust significantly.
      credibilityChange = -0.1;
      historyOutcome = "FAILURE";
    }

    // Apply the change, capped between 0.0 and 1.0.
    credibility.score = Math.max(
      0.0,
      Math.min(1.0, credibility.score + credibilityChange)
    );

    // Add the event to the agent's history.
    credibility.history.push({
      taskId: receipt.taskId,
      outcome: historyOutcome,
      credibilityChange,
      timestamp: Date.now(),
    });

    // Update the ledger.
    this.agentCredibilityLedger.set(agentId, credibility);
    console.log(
      `[NEXUS-CORE] Credibility for agent ${agentId} updated to ${credibility.score.toFixed(2)}`
    );

    return credibility;
  }

  private observeAndLearn(acceptedCode: string): void {
    // Indentation analysis
    const spaceIndentations = (acceptedCode.match(/^ +/gm) || []).length;
    const tabIndentations = (acceptedCode.match(/^\t+/gm) || []).length;
    if (spaceIndentations > tabIndentations) {
      this.personalEnclave.indentation = "spaces";
    } else if (tabIndentations > spaceIndentations) {
      this.personalEnclave.indentation = "tabs";
    }

    // Quote style analysis
    const singleQuotes = (acceptedCode.match(/'/g) || []).length;
    const doubleQuotes = (acceptedCode.match(/"/g) || []).length;
    if (singleQuotes > doubleQuotes) {
      this.personalEnclave.quoteStyle = "single";
    } else if (doubleQuotes > singleQuotes) {
      this.personalEnclave.quoteStyle = "double";
    }

    console.log("[NEXUS-CORE] Personal En-gram updated:", this.personalEnclave);
  }

  private applyStyleGuidance(baseIntent: string): string {
    let guidance = "Follow this style guidance: ";
    const guidanceParts: string[] = [];

    if (this.personalEnclave.indentation !== "unknown") {
      guidanceParts.push(
        `Use ${this.personalEnclave.indentation} for indentation.`
      );
    }
    if (this.personalEnclave.quoteStyle !== "unknown") {
      guidanceParts.push(
        `Use ${this.personalEnclave.quoteStyle} quotes for strings.`
      );
    }

    if (guidanceParts.length === 0) {
      return baseIntent; // No guidance to apply yet
    }

    return `${baseIntent}. ${guidance}${guidanceParts.join(" ")}`;
  }
}
