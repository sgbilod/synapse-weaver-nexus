// packages/nexus-core/src/OrchestrationEngine.ts
import { v4 as uuidv4 } from "uuid";
import Docker from "dockerode";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IOrchestrationEngine } from "./nexus-core.js";
import {
  TaskVector,
  ExecutionPlan,
  ExecutionReceipt,
  AgentCredibility,
  PersonalEnclave,
} from "./cognitive.types.js";
import { AGENT_PROFILES } from "./mock.agents.js";

// Simple intent parser for sub-task classification
function parseIntentLocal(
  intent: string
): "CREATE" | "TEST" | "REFACTOR" | "DEBUG" | "DOCUMENT" | "RESEARCH" {
  const lower = intent.toLowerCase();
  if (
    lower.includes("test") ||
    lower.includes("validate") ||
    lower.includes("verify")
  ) {
    return "TEST";
  } else if (
    lower.includes("refactor") ||
    lower.includes("clean") ||
    lower.includes("improve") ||
    lower.includes("optimize")
  ) {
    return "REFACTOR";
  } else if (
    lower.includes("research") ||
    lower.includes("find") ||
    lower.includes("look up") ||
    lower.includes("is there a better")
  ) {
    return "RESEARCH";
  } else if (
    lower.includes("debug") ||
    lower.includes("fix") ||
    lower.includes("solve") ||
    lower.includes("error")
  ) {
    return "DEBUG";
  } else if (
    lower.includes("document") ||
    lower.includes("comment") ||
    lower.includes("explain")
  ) {
    return "DOCUMENT";
  }
  return "CREATE";
}

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

  /**
   * Task Decomposer - The Strategic Mind
   *
   * Uses Gemini LLM to decompose a high-level user intent into a sequence of smaller,
   * actionable sub-tasks. This enables multi-stage execution plans.
   *
   * @param userIntent - The natural language description of what the user wants
   * @returns Array of sub-task strings. Returns empty array on failure or single-element array for simple tasks.
   */
  protected async decomposeTask(userIntent: string): Promise<string[]> {
    try {
      // Check for API key
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === "") {
        console.warn(
          "[NEXUS-CORE] ⚠️  GEMINI_API_KEY not set. Task decomposition disabled. Falling back to simple plan."
        );
        return [userIntent]; // Fallback to treating entire intent as single task
      }

      console.log(
        `[NEXUS-CORE] Decomposing task with strategic AI: "${userIntent.substring(0, 50)}..."`
      );

      // Initialize Gemini AI client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      // Craft the meta-prompt for task decomposition
      const metaPrompt = `You are an expert software architect. Decompose the following user request into a sequence of smaller, specific, single-action developer tasks. Return ONLY a numbered list. DO NOT add any commentary or introduction. Request: '${userIntent}'`;

      // Call Gemini API
      const result = await model.generateContent(metaPrompt);
      const response = await result.response;
      const decompositionText = response.text();

      console.log(`[NEXUS-CORE] Decomposition response:\n${decompositionText}`);

      // Parse the numbered list response
      const lines = decompositionText.split("\n");
      const subTasks: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        // Match numbered list patterns: "1.", "1)", "1 -", etc.
        const match = trimmed.match(/^\d+[\.\)\-\:]\s*(.+)$/);
        if (match && match[1]) {
          subTasks.push(match[1].trim());
        }
      }

      // Validate results
      if (subTasks.length === 0) {
        console.warn(
          "[NEXUS-CORE] ⚠️  Could not parse sub-tasks from decomposition. Using original intent."
        );
        return [userIntent];
      }

      console.log(
        `[NEXUS-CORE] Successfully decomposed into ${subTasks.length} sub-task(s).`
      );
      return subTasks;
    } catch (error) {
      console.error(
        `[NEXUS-CORE] Task decomposition failed: ${error instanceof Error ? error.message : String(error)}`
      );
      return [userIntent]; // Fallback to simple execution
    }
  }

  public async receiveTask(
    vector: TaskVector,
    projectRootPath: string
  ): Promise<ExecutionReceipt> {
    console.log(
      `[NEXUS-CORE] Task ${vector.id} received. Creating execution plan...`
    );
    const plan = await this.createExecutionPlan(vector);
    console.log(
      `[NEXUS-CORE] Plan ${plan.planId} created (${plan.planType}). Dispatching swarm...`
    );

    const receipt = await this.dispatchSwarm(plan, projectRootPath);
    console.log(
      `[NEXUS-CORE] Swarm finished. Processing receipt ${receipt.receiptId}...`
    );

    this.processReceipt(receipt);

    return receipt;
  }

  /**
   * Strategic Genesis Engine - Now with Multi-Stage Intelligence
   *
   * Analyzes the task vector and generates an execution plan.
   * Uses the Task Decomposer to break down complex requests into sequential stages.
   */
  public async createExecutionPlan(vector: TaskVector): Promise<ExecutionPlan> {
    const planId = uuidv4();

    // Step 1: Decompose the task into sub-tasks using AI
    const subTasks = await this.decomposeTask(vector.naturalLanguageIntent);

    // Step 2: Determine plan type based on decomposition results
    const planType: "simple" | "sequential" =
      subTasks.length <= 1 ? "simple" : "sequential";

    console.log(
      `[NEXUS-CORE] Plan type: ${planType} (${subTasks.length} sub-task(s))`
    );

    // Step 3: Build stages
    const stages: ExecutionPlan["stages"] = [];
    let totalEstimatedBudget = 0;
    let totalEstimatedTime = 0;

    if (planType === "simple") {
      // Simple plan: single stage with one agent
      let selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;

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
          selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
          break;
        default:
          selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
          break;
      }

      const styleAwareIntent = this.applyStyleGuidance(
        vector.naturalLanguageIntent
      );

      stages.push([
        {
          agentProfile: selectedAgentProfile,
          taskChunk: styleAwareIntent,
        },
      ]);

      totalEstimatedBudget = selectedAgentProfile.costPerSecond * 30;
      totalEstimatedTime = 30;
    } else {
      // Sequential plan: multiple stages, one per sub-task
      for (const subTask of subTasks) {
        const subTaskAction = parseIntentLocal(subTask);
        let selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;

        // Select appropriate agent for each sub-task
        switch (subTaskAction) {
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
            selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
            break;
          default:
            selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
            break;
        }

        const styleAwareSubTask = this.applyStyleGuidance(subTask);

        stages.push([
          {
            agentProfile: selectedAgentProfile,
            taskChunk: styleAwareSubTask,
          },
        ]);

        totalEstimatedBudget += selectedAgentProfile.costPerSecond * 30;
        totalEstimatedTime += 30;
      }
    }

    const plan: ExecutionPlan = {
      planId,
      taskId: vector.id,
      taskVector: vector,
      stages,
      planType,
      estimatedBudget: totalEstimatedBudget,
      estimatedTimeSeconds: totalEstimatedTime,
    };

    return plan;
  }

  /**
   * Sequential Swarm Dispatcher - Multi-Stage Execution Engine
   *
   * Executes each stage of the plan in sequence, accumulating results.
   * Only proceeds to next stage if current stage succeeds.
   */
  public async dispatchSwarm(
    plan: ExecutionPlan,
    projectRootPath: string
  ): Promise<ExecutionReceipt> {
    console.log(
      `[NEXUS-CORE] Dispatching ${plan.planType} swarm for plan ${plan.planId} (${plan.stages.length} stage(s))...`
    );

    const overallStartTime = Date.now();
    const allResults: ExecutionReceipt["results"] = [];
    let totalCost = 0;
    let currentStageIndex = 0;

    try {
      // Execute each stage sequentially
      for (const stage of plan.stages) {
        currentStageIndex++;
        console.log(
          `[NEXUS-CORE] Executing stage ${currentStageIndex}/${plan.stages.length}...`
        );

        // For now, each stage contains only one agent (parallel execution is future work)
        const agent = stage[0];
        const stageResult = await this.executeAgent(
          agent,
          plan.taskVector,
          projectRootPath
        );

        allResults.push(stageResult);
        totalCost += stageResult.cost || 0;

        // Check if stage failed - stop execution if so
        if (!stageResult.wasAccepted) {
          console.error(
            `[NEXUS-CORE] Stage ${currentStageIndex} failed. Aborting remaining stages.`
          );

          const finalTimeSeconds = (Date.now() - overallStartTime) / 1000;

          return {
            receiptId: uuidv4(),
            planId: plan.planId,
            taskId: plan.taskId,
            outcome: "FAILED",
            finalCost: totalCost,
            finalTimeSeconds,
            results: allResults,
            failureAnalysis: {
              failedAgentId: stageResult.agentId,
              reason: `Stage ${currentStageIndex} failed`,
              logs: stageResult.output,
            },
          };
        }

        console.log(
          `[NEXUS-CORE] Stage ${currentStageIndex} completed successfully.`
        );
      }

      // All stages completed successfully
      const finalTimeSeconds = (Date.now() - overallStartTime) / 1000;

      const receipt: ExecutionReceipt = {
        receiptId: uuidv4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: "COMPLETED",
        finalCost: totalCost,
        finalTimeSeconds,
        results: allResults,
      };

      console.log(
        `[NEXUS-CORE] All ${plan.stages.length} stage(s) completed. Receipt ${receipt.receiptId} generated.`
      );
      return receipt;
    } catch (error) {
      console.error(`[NEXUS-CORE] Swarm dispatch failed:`, error);

      const finalTimeSeconds = (Date.now() - overallStartTime) / 1000;

      return {
        receiptId: uuidv4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: "FAILED",
        finalCost: totalCost,
        finalTimeSeconds,
        results: allResults,
        failureAnalysis: {
          failedAgentId:
            allResults[allResults.length - 1]?.agentId || "unknown",
          reason: `Swarm execution error: ${error instanceof Error ? error.message : String(error)}`,
          logs: error instanceof Error ? error.stack || "" : String(error),
        },
      };
    }
  }

  /**
   * Execute Single Agent - The Worker Bee
   *
   * Builds, runs, and collects output from a single containerized agent.
   */
  private async executeAgent(
    agent: { agentProfile: any; taskChunk: string },
    taskVector: TaskVector,
    projectRootPath: string
  ): Promise<{
    agentId: string;
    output: string;
    wasAccepted: boolean;
    cost?: number;
  }> {
    const agentProfile = agent.agentProfile;
    const taskChunk = agent.taskChunk;

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

    console.log(
      `[NEXUS-CORE] Agent: ${agentProfile.id}, Docker context: ${dockerfilePath}`
    );

    const startTime = Date.now();

    try {
      // Step 1: Build the Docker image
      console.log(`[NEXUS-CORE] Building Docker image: ${imageName}...`);

      try {
        const buildStream = await this.docker.buildImage(
          {
            context: dockerfilePath,
            src: ["Dockerfile", "agent.ts", "package.json"],
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
      if (
        !geminiApiKey &&
        (agentName === "generic-llm-agent-v1" ||
          agentName === "generic-gemini-v1")
      ) {
        console.warn(
          `[NEXUS-CORE] ⚠️  WARNING: GEMINI_API_KEY not found in environment. Agent ${agentName} will fail.`
        );
      }

      const container = await this.docker.createContainer({
        Image: imageName,
        Cmd: [], // Agent entrypoint handles execution
        Env: [
          `TASK_DESCRIPTION=${taskChunk}`, // Use the specific task chunk for this agent
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
      console.log(`[NEXUS-CORE] Agent output:\n${logOutput}`);

      // Step 5: Clean up container
      await container.remove();
      console.log(`[NEXUS-CORE] Container removed.`);

      // Step 6: Calculate execution time and cost
      const finalTimeSeconds = (Date.now() - startTime) / 1000;
      const cost = agentProfile.costPerSecond * finalTimeSeconds;

      return {
        agentId: agentProfile.id,
        output: logOutput,
        wasAccepted: result.StatusCode === 0,
        cost,
      };
    } catch (error) {
      console.error(`[NEXUS-CORE] Agent execution failed:`, error);

      const finalTimeSeconds = (Date.now() - startTime) / 1000;
      const cost = agentProfile.costPerSecond * finalTimeSeconds;

      return {
        agentId: agentProfile.id,
        output: `Error: ${error instanceof Error ? error.message : String(error)}`,
        wasAccepted: false,
        cost,
      };
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
