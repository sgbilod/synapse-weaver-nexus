import { ipcMain, app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { OrchestrationEngine } from "@synapse/nexus-core";
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
      preload: path.join(__dirname, "preload.cjs"),
      // Use .cjs for CommonJS
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
