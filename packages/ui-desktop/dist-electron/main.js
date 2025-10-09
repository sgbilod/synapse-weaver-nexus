import { ipcMain, app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Docker from "dockerode";
import { randomFillSync, randomUUID } from "node:crypto";
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const native = { randomUUID };
function _v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  return _v4(options);
}
const AGENT_PROFILES = {
  SENTINEL_JEST_TS: {
    id: "sentinel-jest-ts-v1",
    archetype: "Sentinel",
    specializations: ["Jest", "TypeScript", "Unit Testing"],
    costPerToken: 1e-4,
    costPerSecond: 0.05
  },
  ALCHEMIST_TS_REFACTOR: {
    id: "alchemist-ts-refactor-v1",
    archetype: "Alchemist",
    specializations: ["TypeScript", "Code Refactoring", "Best Practices"],
    costPerToken: 15e-5,
    costPerSecond: 0.07
  },
  SCOUT_NPM_VULNERABILITY: {
    id: "scout-npm-vuln-v1",
    archetype: "Scout",
    specializations: ["NPM", "Dependency Analysis", "Security"],
    costPerToken: 8e-5,
    costPerSecond: 0.04
  },
  GENERIC_LLM_V1: {
    id: "generic-llm-agent-v1",
    archetype: "Alchemist",
    specializations: [
      "AI Code Generation",
      "LLM Integration",
      "Natural Language Processing",
      "Google Gemini"
    ],
    costPerToken: 2e-4,
    costPerSecond: 0.1
  }
};
class OrchestrationEngine {
  docker;
  agentCredibilityLedger;
  personalEnclave;
  constructor() {
    this.docker = new Docker();
    this.agentCredibilityLedger = /* @__PURE__ */ new Map();
    this.personalEnclave = {
      indentation: "unknown",
      quoteStyle: "unknown",
      preferredLibraries: /* @__PURE__ */ new Set()
    };
  }
  async receiveTask(vector, projectRootPath) {
    console.log(`[NEXUS-CORE] Task ${vector.id} received. Creating execution plan...`);
    const plan = this.createExecutionPlan(vector);
    console.log(`[NEXUS-CORE] Plan ${plan.planId} created. Dispatching swarm...`);
    const receipt = await this.dispatchSwarm(plan, projectRootPath);
    console.log(`[NEXUS-CORE] Swarm finished. Processing receipt ${receipt.receiptId}...`);
    this.processReceipt(receipt);
    return receipt;
  }
  createExecutionPlan(vector) {
    const planId = v4();
    let selectedAgentProfile = AGENT_PROFILES.GENERIC_LLM_V1;
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
        selectedAgentProfile = AGENT_PROFILES.GENERIC_LLM_V1;
        break;
      default:
        selectedAgentProfile = AGENT_PROFILES.GENERIC_LLM_V1;
        break;
    }
    const styleAwareIntent = this.applyStyleGuidance(vector.naturalLanguageIntent);
    const plan = {
      planId,
      taskId: vector.id,
      taskVector: vector,
      // Include the original task for agent context
      swarm: [
        {
          agentProfile: selectedAgentProfile,
          taskChunk: styleAwareIntent
          // Use the style-aware intent here
        }
      ],
      estimatedBudget: selectedAgentProfile.costPerSecond * 30,
      // Placeholder budget
      estimatedTimeSeconds: 30
      // Placeholder time
    };
    return plan;
  }
  async dispatchSwarm(plan, projectRootPath) {
    console.log(`[NEXUS-CORE] Dispatching swarm for plan ${plan.planId}...`);
    const agent = plan.swarm[0];
    const agentProfile = agent.agentProfile;
    const taskVector = plan.taskVector;
    const requiredCredibility = taskVector.constraints.requiredCredibility;
    const agentCredibility = this.agentCredibilityLedger.get(agentProfile.id)?.score ?? 0.5;
    if (agentCredibility < requiredCredibility) {
      throw new Error(`Agent ${agentProfile.id} has insufficient credibility (${agentCredibility.toFixed(2)}) to perform task requiring (${requiredCredibility}).`);
    }
    const agentName = agentProfile.id.toLowerCase().replace(/\s+/g, "-");
    const imageName = `synapse-agent-${agentName}:latest`;
    const path2 = await import("path");
    const dockerfilePath = path2.join(projectRootPath, "packages", "agent-foundry", "src", agentName);
    console.log(`[NEXUS-CORE] Docker context path: ${dockerfilePath}`);
    const startTime = Date.now();
    try {
      console.log(`[NEXUS-CORE] Building Docker image: ${imageName}...`);
      try {
        const buildStream = await this.docker.buildImage({
          context: dockerfilePath,
          src: ["Dockerfile", "agent.ts"]
        }, { t: imageName });
        await new Promise((resolve, reject) => {
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
        throw new Error(`Docker build failed: ${buildError instanceof Error ? buildError.message : String(buildError)}`);
      }
      console.log(`[NEXUS-CORE] Creating container for ${agentName}...`);
      const geminiApiKey = process.env.GEMINI_API_KEY || "";
      if (!geminiApiKey && agentName === "generic-llm-agent-v1") {
        console.warn("[NEXUS-CORE] ⚠️  WARNING: GEMINI_API_KEY not found in environment. LLM agent will fail.");
      }
      const container = await this.docker.createContainer({
        Image: imageName,
        Cmd: [],
        // Agent entrypoint handles execution
        Env: [
          `TASK_DESCRIPTION=${taskVector.naturalLanguageIntent}`,
          `TASK_ID=${taskVector.id}`,
          `GEMINI_API_KEY=${geminiApiKey}`
          // Securely pass API key to container
        ],
        HostConfig: {
          Binds: [`${projectRootPath}:/project:ro`],
          // Mount project as read-only
          AutoRemove: false
        }
      });
      console.log(`[NEXUS-CORE] Starting container...`);
      await container.start();
      const result = await container.wait();
      console.log(`[NEXUS-CORE] Container exited with status: ${result.StatusCode}`);
      const logs = await container.logs({
        stdout: true,
        stderr: true
      });
      const logOutput = logs.toString("utf-8");
      console.log(`[NEXUS-CORE] Agent logs:
${logOutput}`);
      await container.remove();
      console.log(`[NEXUS-CORE] Container removed.`);
      const finalTimeSeconds = (Date.now() - startTime) / 1e3;
      const receipt = {
        receiptId: v4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: result.StatusCode === 0 ? "COMPLETED" : "FAILED",
        finalCost: agentProfile.costPerSecond * finalTimeSeconds,
        finalTimeSeconds,
        results: [
          {
            agentId: agentProfile.id,
            output: logOutput,
            wasAccepted: result.StatusCode === 0
          }
        ],
        ...result.StatusCode !== 0 && {
          failureAnalysis: {
            failedAgentId: agentProfile.id,
            reason: `Container exited with status ${result.StatusCode}`,
            logs: logOutput
          }
        }
      };
      console.log(`[NEXUS-CORE] Receipt ${receipt.receiptId} generated.`);
      return receipt;
    } catch (error) {
      console.error(`[NEXUS-CORE] Swarm dispatch failed:`, error);
      const finalTimeSeconds = (Date.now() - startTime) / 1e3;
      const receipt = {
        receiptId: v4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: "FAILED",
        finalCost: agentProfile.costPerSecond * finalTimeSeconds,
        finalTimeSeconds,
        results: [
          {
            agentId: agentProfile.id,
            output: `Error: ${error.message}`,
            wasAccepted: false
          }
        ],
        failureAnalysis: {
          failedAgentId: agentProfile.id,
          reason: `Docker execution failed: ${error.message}`,
          logs: error.stack || ""
        }
      };
      return receipt;
    }
  }
  processReceipt(receipt) {
    const agentId = receipt.results[0].agentId;
    let credibility = this.agentCredibilityLedger.get(agentId) ?? {
      agentId,
      score: 0.5,
      // Default starting score
      history: []
    };
    let credibilityChange = 0;
    let historyOutcome;
    if (receipt.outcome === "COMPLETED" && receipt.results[0].wasAccepted) {
      credibilityChange = 0.05;
      historyOutcome = "SUCCESS";
      this.observeAndLearn(receipt.results[0].output);
    } else if (receipt.outcome === "COMPLETED" && !receipt.results[0].wasAccepted) {
      credibilityChange = -0.1;
      historyOutcome = "REJECTED";
    } else {
      credibilityChange = -0.1;
      historyOutcome = "FAILURE";
    }
    credibility.score = Math.max(0, Math.min(1, credibility.score + credibilityChange));
    credibility.history.push({
      taskId: receipt.taskId,
      outcome: historyOutcome,
      credibilityChange,
      timestamp: Date.now()
    });
    this.agentCredibilityLedger.set(agentId, credibility);
    console.log(`[NEXUS-CORE] Credibility for agent ${agentId} updated to ${credibility.score.toFixed(2)}`);
    return credibility;
  }
  observeAndLearn(acceptedCode) {
    const spaceIndentations = (acceptedCode.match(/^ +/gm) || []).length;
    const tabIndentations = (acceptedCode.match(/^\t+/gm) || []).length;
    if (spaceIndentations > tabIndentations) {
      this.personalEnclave.indentation = "spaces";
    } else if (tabIndentations > spaceIndentations) {
      this.personalEnclave.indentation = "tabs";
    }
    const singleQuotes = (acceptedCode.match(/'/g) || []).length;
    const doubleQuotes = (acceptedCode.match(/"/g) || []).length;
    if (singleQuotes > doubleQuotes) {
      this.personalEnclave.quoteStyle = "single";
    } else if (doubleQuotes > singleQuotes) {
      this.personalEnclave.quoteStyle = "double";
    }
    console.log("[NEXUS-CORE] Personal En-gram updated:", this.personalEnclave);
  }
  applyStyleGuidance(baseIntent) {
    let guidance = "Follow this style guidance: ";
    const guidanceParts = [];
    if (this.personalEnclave.indentation !== "unknown") {
      guidanceParts.push(`Use ${this.personalEnclave.indentation} for indentation.`);
    }
    if (this.personalEnclave.quoteStyle !== "unknown") {
      guidanceParts.push(`Use ${this.personalEnclave.quoteStyle} quotes for strings.`);
    }
    if (guidanceParts.length === 0) {
      return baseIntent;
    }
    return `${baseIntent}. ${guidance}${guidanceParts.join(" ")}`;
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, "../../..");
console.log("[COMMAND DECK] Workspace root:", WORKSPACE_ROOT);
console.log("[COMMAND DECK] Current directory:", process.cwd());
console.log("[COMMAND DECK] __dirname:", __dirname);
let nexusEngine;
let mainWindow = null;
let systemEvents = [];
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#0a0e27",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    title: "Synapse Weaver Nexus - Command Deck",
    icon: path.join(__dirname, "../assets/icon.png"),
    show: true
    // Show immediately for debugging
  });
  mainWindow.once("ready-to-show", () => {
    console.log("[COMMAND DECK] Window ready-to-show event fired");
    logSystemEvent("TASK_RECEIVED", "Command Deck initialized and ready");
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("[COMMAND DECK] Renderer process gone!", details);
  });
  mainWindow.on("unresponsive", () => {
    console.error("[COMMAND DECK] Window became unresponsive!");
  });
  mainWindow.webContents.on(
    "console-message",
    (_event, level, message, line, sourceId) => {
      const prefix = level === 0 ? "[RENDERER LOG]" : level === 1 ? "[RENDERER WARN]" : level === 2 ? "[RENDERER ERROR]" : "[RENDERER DEBUG]";
      console.log(`${prefix} ${message} (${sourceId}:${line})`);
    }
  );
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log("[COMMAND DECK] Loading URL:", process.env.VITE_DEV_SERVER_URL);
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const htmlPath = path.join(__dirname, "../dist/index.html");
    console.log("[COMMAND DECK] Loading file:", htmlPath);
    mainWindow.loadFile(htmlPath);
  }
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("[COMMAND DECK] Page finished loading");
  });
  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription) => {
      console.error(
        "[COMMAND DECK] Failed to load:",
        errorCode,
        errorDescription
      );
    }
  );
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
function initializeNexusCore() {
  console.log("[COMMAND DECK] Initializing Nexus Core...");
  nexusEngine = new OrchestrationEngine();
  logSystemEvent("TASK_RECEIVED", "Nexus Core instantiated successfully");
  console.log("[COMMAND DECK] Nexus Core online. Personal En-gram active.");
}
function logSystemEvent(type, message, details) {
  const event = {
    timestamp: Date.now(),
    type,
    message,
    details
  };
  systemEvents.push(event);
  if (systemEvents.length > 100) {
    systemEvents = systemEvents.slice(-100);
  }
  broadcastStateUpdate();
}
function getNexusState() {
  if (!nexusEngine) {
    return {
      personalEnclave: {
        indentation: "unknown",
        quoteStyle: "unknown",
        preferredLibraries: []
      },
      agentCredibilityLedger: {},
      systemEvents
    };
  }
  const engineAny = nexusEngine;
  const personalEnclave = engineAny.personalEnclave || {
    indentation: "unknown",
    quoteStyle: "unknown",
    preferredLibraries: /* @__PURE__ */ new Set()
  };
  const agentCredibilityLedger = engineAny.agentCredibilityLedger || /* @__PURE__ */ new Map();
  const credibilityScores = {};
  for (const [agentId, credibility] of agentCredibilityLedger.entries()) {
    credibilityScores[agentId] = credibility.score;
  }
  return {
    personalEnclave: {
      indentation: personalEnclave.indentation,
      quoteStyle: personalEnclave.quoteStyle,
      preferredLibraries: Array.from(personalEnclave.preferredLibraries)
    },
    agentCredibilityLedger: credibilityScores,
    systemEvents
  };
}
function broadcastStateUpdate() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const state = getNexusState();
    mainWindow.webContents.send("nexus:state-updated", state);
  }
}
ipcMain.handle("nexus:get-initial-state", async () => {
  console.log("[COMMAND DECK] Initial state requested");
  return getNexusState();
});
ipcMain.handle("nexus:submit-task", async (_event, task) => {
  console.log(`[COMMAND DECK] Task received: "${task}"`);
  logSystemEvent("TASK_RECEIVED", `Task submitted: ${task}`, { task });
  try {
    const taskVector = {
      id: `task-${Date.now()}`,
      timestamp: Date.now(),
      sourceCode: "",
      // No source code context from Command Deck
      naturalLanguageIntent: task,
      parsedIntent: {
        primaryAction: "CREATE",
        subject: task,
        context: []
      },
      projectContext: {
        projectId: "command-deck",
        filePath: "",
        projectStyleGuide: {}
      },
      constraints: {
        maxBudget: 1e3,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5
      }
    };
    const projectRoot = WORKSPACE_ROOT;
    console.log("[COMMAND DECK] Using project root for Docker:", projectRoot);
    logSystemEvent("PLAN_CREATED", `Creating execution plan for task...`, {
      taskId: taskVector.id
    });
    const receipt = await nexusEngine.receiveTask(taskVector, projectRoot);
    logSystemEvent(
      "AGENT_DISPATCHED",
      `Execution plan ${receipt.planId} dispatched`,
      { planId: receipt.planId, outcome: receipt.outcome }
    );
    logSystemEvent(
      "RECEIPT_PROCESSED",
      `Task ${receipt.outcome.toLowerCase()}: Cost ${receipt.finalCost}, Time ${receipt.finalTimeSeconds}s`,
      { receiptId: receipt.receiptId, results: receipt.results }
    );
    console.log("[COMMAND DECK] Task successfully processed");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : void 0;
    console.error("[COMMAND DECK] Task processing failed:", errorMessage);
    if (errorStack) {
      console.error("[COMMAND DECK] Error stack:", errorStack);
    }
    logSystemEvent(
      "RECEIPT_PROCESSED",
      `Task processing failed: ${errorMessage}`,
      { task, error }
    );
    throw error;
  }
});
app.whenReady().then(() => {
  initializeNexusCore();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
export {
  getNexusState,
  logSystemEvent,
  nexusEngine
};
