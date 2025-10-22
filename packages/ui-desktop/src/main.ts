/**
 * Electron Main Process - The Nexus Backend
 *
 * This is the heart of the Command Deck. It instantiates the OrchestrationEngine
 * and manages the bridge between the Nexus Core and the UI.
 */

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { OrchestrationEngine } from "@synapse/nexus-core";
import type { NexusState, SystemEvent } from "./preload.cjs";
import { logger } from "./logger";
import type { PersonalEnclave, AgentCredibility } from "@synapse/nexus-core";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate workspace root from dist-electron location
// __dirname = /workspace/packages/ui-desktop/dist-electron
// workspace root = /workspace (go up 3 levels)
const WORKSPACE_ROOT = path.resolve(__dirname, "../../..");

logger.info("Workspace root:", WORKSPACE_ROOT);
logger.info("Current directory:", process.cwd());
logger.info("__dirname:", __dirname);

// The living instance of the Nexus Core
let nexusEngine: OrchestrationEngine;
let mainWindow: BrowserWindow | null = null;
let systemEvents: SystemEvent[] = [];

/**
 * Create the main application window - The Command Deck's viewport.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#0a0e27",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    title: "Synapse Weaver Nexus - Command Deck",
    icon: path.join(__dirname, "../assets/icon.png"),
    show: true, // Show immediately for debugging
  });

  // Log when ready to show
  mainWindow.once("ready-to-show", () => {
    logger.info("Window ready-to-show event fired");
    logSystemEvent("TASK_RECEIVED", "Command Deck initialized and ready");
  });

  // Log renderer process crashes
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    logger.error("Renderer process gone!", details);
  });

  // Log when renderer becomes unresponsive
  mainWindow.on("unresponsive", () => {
    logger.error("Window became unresponsive!");
  });

  // Log console messages from renderer
  mainWindow.webContents.on(
    "console-message",
    (_event, level, message, line, sourceId) => {
      const prefix =
        level === 0
          ? "[RENDERER LOG]"
          : level === 1
            ? "[RENDERER WARN]"
            : level === 2
              ? "[RENDERER ERROR]"
              : "[RENDERER DEBUG]";
      logger.info(`${prefix} ${message} (${sourceId}:${line})`);
    }
  );

  // Load the renderer
  if (process.env.VITE_DEV_SERVER_URL) {
    logger.info("Loading URL:", process.env.VITE_DEV_SERVER_URL);
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const htmlPath = path.join(__dirname, "../dist/index.html");
    logger.info("Loading file:", htmlPath);
    mainWindow.loadFile(htmlPath);
  }

  // Log when page finishes loading
  mainWindow.webContents.on("did-finish-load", () => {
    logger.info("Page finished loading");
  });

  // Log navigation errors
  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription) => {
      logger.error("Failed to load:", errorCode, errorDescription);
    }
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 * Initialize the Nexus Core - Birth the intelligence.
 */
function initializeNexusCore() {
  logger.info("Initializing Nexus Core...");
  nexusEngine = new OrchestrationEngine();
  logSystemEvent("TASK_RECEIVED", "Nexus Core instantiated successfully");
  logger.info("Nexus Core online. Personal En-gram active.");
}

/**
 * Log system events that will appear in the Task Feed.
 */
function logSystemEvent(
  type: SystemEvent["type"],
  message: string,
  details?: unknown
) {
  const event: SystemEvent = {
    timestamp: Date.now(),
    type,
    message,
    details,
  };

  systemEvents.push(event);

  // Keep only last 100 events
  if (systemEvents.length > 100) {
    systemEvents = systemEvents.slice(-100);
  }

  // Broadcast to renderer
  broadcastStateUpdate();
}

/**
 * Serialize the current Nexus state for transmission to the renderer.
 */
function getNexusState(): NexusState {
  if (!nexusEngine) {
    return {
      personalEnclave: {
        indentation: "unknown",
        quoteStyle: "unknown",
        preferredLibraries: [],
      },
      agentCredibilityLedger: {},
      systemEvents: systemEvents,
    };
  }

  // Access the engine's internal state
  // Note: We're accessing private properties here. In production, these should be exposed via public getters.
  // Safely access enforced engine internals via a narrow unknown cast
  const engineInternal = nexusEngine as unknown as {
    personalEnclave?: PersonalEnclave;
    agentCredibilityLedger?: Map<string, AgentCredibility>;
  };

  const personalEnclave = engineInternal.personalEnclave || {
    indentation: "unknown",
    quoteStyle: "unknown",
    preferredLibraries: new Set<string>(),
  };

  const agentCredibilityLedger =
    engineInternal.agentCredibilityLedger ||
    new Map<string, AgentCredibility>();

  // Convert Map<string, AgentCredibility> to Record<string, number>
  // Extract just the score from each credibility object
  const credibilityScores: Record<string, number> = {};
  for (const [agentId, credibility] of agentCredibilityLedger.entries()) {
    credibilityScores[agentId] = credibility.score;
  }

  return {
    personalEnclave: {
      indentation: personalEnclave.indentation,
      quoteStyle: personalEnclave.quoteStyle,
      preferredLibraries: Array.from(personalEnclave.preferredLibraries),
    },
    agentCredibilityLedger: credibilityScores,
    systemEvents: systemEvents,
  };
}

/**
 * Broadcast state update to the renderer process.
 */
function broadcastStateUpdate() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const state = getNexusState();
    mainWindow.webContents.send("nexus:state-updated", state);
  }
}

/**
 * IPC Handler: Get Initial State
 */
ipcMain.handle("nexus:get-initial-state", async () => {
  logger.info("Initial state requested");
  return getNexusState();
});

/**
 * IPC Handler: Submit Task
 */
ipcMain.handle("nexus:submit-task", async (_event, task: string) => {
  logger.info(`Task received: "${task}"`);

  logSystemEvent("TASK_RECEIVED", `Task submitted: ${task}`, { task });

  try {
    // Create a TaskVector from the natural language input
    const taskVector = {
      id: `task-${Date.now()}`,
      timestamp: Date.now(),
      sourceCode: "", // No source code context from Command Deck
      naturalLanguageIntent: task,
      parsedIntent: {
        primaryAction: "CREATE" as const,
        subject: task,
        context: [],
      },
      projectContext: {
        projectId: "command-deck",
        filePath: "",
        projectStyleGuide: {},
      },
      constraints: {
        maxBudget: 1000,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5,
      },
    };

    // Use workspace root for Docker builds
    const projectRoot = WORKSPACE_ROOT;

    logger.info("Using project root for Docker:", projectRoot);

    logSystemEvent("PLAN_CREATED", `Creating execution plan for task...`, {
      taskId: taskVector.id,
    });

    // Send task to the Nexus Core for processing
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

    logger.info("Task successfully processed");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error("Task processing failed:", errorMessage);
    if (errorStack) {
      logger.error("Error stack:", errorStack);
    }

    logSystemEvent(
      "RECEIPT_PROCESSED",
      `Task processing failed: ${errorMessage}`,
      { task, error }
    );
    throw error;
  }
});

/**
 * App Lifecycle: Ready
 */
app.whenReady().then(() => {
  initializeNexusCore();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * App Lifecycle: All Windows Closed
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * Export for testing purposes
 */
export { nexusEngine, logSystemEvent, getNexusState };
