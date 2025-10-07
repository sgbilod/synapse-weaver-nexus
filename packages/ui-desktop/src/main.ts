/**
 * Electron Main Process - The Nexus Backend
 *
 * This is the heart of the Command Deck. It instantiates the OrchestrationEngine
 * and manages the bridge between the Nexus Core and the UI.
 */

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { OrchestrationEngine } from "@synapse/nexus-core";
import type { NexusState, SystemEvent } from "./preload";

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
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    title: "Synapse Weaver Nexus - Command Deck",
    icon: path.join(__dirname, "../assets/icon.png"),
    show: false,
  });

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    logSystemEvent("TASK_RECEIVED", "Command Deck initialized and ready");
  });

  // Load the renderer
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 * Initialize the Nexus Core - Birth the intelligence.
 */
function initializeNexusCore() {
  console.log("[COMMAND DECK] Initializing Nexus Core...");
  nexusEngine = new OrchestrationEngine();
  logSystemEvent("TASK_RECEIVED", "Nexus Core instantiated successfully");
  console.log("[COMMAND DECK] Nexus Core online. Personal En-gram active.");
}

/**
 * Log system events that will appear in the Task Feed.
 */
function logSystemEvent(
  type: SystemEvent["type"],
  message: string,
  details?: any
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
  const engineAny = nexusEngine as any;

  const personalEnclave = engineAny.personalEnclave || {
    indentation: "unknown",
    quoteStyle: "unknown",
    preferredLibraries: new Set(),
  };

  const agentCredibilityLedger = engineAny.agentCredibilityLedger || new Map();

  return {
    personalEnclave: {
      indentation: personalEnclave.indentation,
      quoteStyle: personalEnclave.quoteStyle,
      preferredLibraries: Array.from(personalEnclave.preferredLibraries),
    },
    agentCredibilityLedger: Object.fromEntries(agentCredibilityLedger),
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
  console.log("[COMMAND DECK] Initial state requested");
  return getNexusState();
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
