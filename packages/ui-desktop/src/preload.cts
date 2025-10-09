/**
 * Preload Script - The Bridge Between Worlds
 *
 * This script runs in a secure context with access to both Node.js and the renderer.
 * It uses Electron's contextBridge to safely expose specific APIs to the frontend.
 */

import { contextBridge, ipcRenderer } from "electron";

/**
 * The NexusApi - A secure portal for the Command Deck to communicate with the Nexus Core.
 */
export interface NexusApi {
  /**
   * Retrieve the initial state of the Nexus Core.
   * Returns the PersonalEnclave and Agent Credibility Ledger.
   */
  getInitialState: () => Promise<NexusState>;

  /**
   * Submit a task to the Nexus Core for processing.
   */
  submitTask: (task: string) => Promise<void>;

  /**
   * Register a callback to receive real-time state updates from the Nexus.
   */
  onStateUpdate: (callback: (state: NexusState) => void) => void;

  /**
   * Remove the state update listener.
   */
  removeStateUpdateListener: () => void;
}

export interface NexusState {
  personalEnclave: {
    indentation: "spaces" | "tabs" | "unknown";
    quoteStyle: "single" | "double" | "unknown";
    preferredLibraries: string[];
  };
  agentCredibilityLedger: Record<string, number>;
  systemEvents: SystemEvent[];
}

export interface SystemEvent {
  timestamp: number;
  type:
    | "TASK_RECEIVED"
    | "PLAN_CREATED"
    | "AGENT_DISPATCHED"
    | "RECEIPT_PROCESSED";
  message: string;
  details?: any;
}

// Expose the protected API to the renderer process
contextBridge.exposeInMainWorld("nexusApi", {
  getInitialState: () => ipcRenderer.invoke("nexus:get-initial-state"),

  submitTask: (task: string) => ipcRenderer.invoke("nexus:submit-task", task),

  onStateUpdate: (callback: (state: NexusState) => void) => {
    ipcRenderer.on("nexus:state-updated", (_event, state) => callback(state));
  },

  removeStateUpdateListener: () => {
    ipcRenderer.removeAllListeners("nexus:state-updated");
  },
} as NexusApi);

// Type augmentation for window object
declare global {
  interface Window {
    nexusApi: NexusApi;
  }
}
