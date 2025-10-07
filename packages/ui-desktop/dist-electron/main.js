"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const path = require("path");
const nexusCore = require("@synapse/nexus-core");
exports.nexusEngine = void 0;
let mainWindow = null;
let systemEvents = [];
function createWindow() {
  mainWindow = new electron.BrowserWindow({
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
    show: false
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    logSystemEvent("TASK_RECEIVED", "Command Deck initialized and ready");
  });
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
function initializeNexusCore() {
  console.log("[COMMAND DECK] Initializing Nexus Core...");
  exports.nexusEngine = new nexusCore.OrchestrationEngine();
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
  if (!exports.nexusEngine) {
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
  const engineAny = exports.nexusEngine;
  const personalEnclave = engineAny.personalEnclave || {
    indentation: "unknown",
    quoteStyle: "unknown",
    preferredLibraries: /* @__PURE__ */ new Set()
  };
  const agentCredibilityLedger = engineAny.agentCredibilityLedger || /* @__PURE__ */ new Map();
  return {
    personalEnclave: {
      indentation: personalEnclave.indentation,
      quoteStyle: personalEnclave.quoteStyle,
      preferredLibraries: Array.from(personalEnclave.preferredLibraries)
    },
    agentCredibilityLedger: Object.fromEntries(agentCredibilityLedger),
    systemEvents
  };
}
function broadcastStateUpdate() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const state = getNexusState();
    mainWindow.webContents.send("nexus:state-updated", state);
  }
}
electron.ipcMain.handle("nexus:get-initial-state", async () => {
  console.log("[COMMAND DECK] Initial state requested");
  return getNexusState();
});
electron.app.whenReady().then(() => {
  initializeNexusCore();
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
exports.getNexusState = getNexusState;
exports.logSystemEvent = logSystemEvent;
