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
  // Details may be any JSON-serializable payload; use unknown here and narrow at use sites.
  details?: unknown;
}

// Expose the protected API to the renderer process
contextBridge.exposeInMainWorld("nexusApi", {
  getInitialState: () => ipcRenderer.invoke("nexus:get-initial-state"),

  /**
   * Submit a sanitized task to the Nexus Core.
   * Preload performs minimal validation/sanitization to reduce the risk of
   * accidental or malicious payloads reaching the main process.
   */
  submitTask: (task: string) => {
    const sanitized = sanitizeForIpc(task);
    return ipcRenderer.invoke("nexus:submit-task", sanitized);
  },

  onStateUpdate: (callback: (state: NexusState) => void) => {
    ipcRenderer.on("nexus:state-updated", (_event, state) => callback(state));
  },

  removeStateUpdateListener: () => {
    ipcRenderer.removeAllListeners("nexus:state-updated");
  },
} as NexusApi);

/**
 * Sanitize text before sending over IPC. Basic operations:
 * - Ensure string type
 * - Trim and cap length
 * - Remove control characters and <script> tags
 */
import { removeControlChars } from "./renderer/utils/textUtils";

function sanitizeForIpc(input: unknown): string {
  if (typeof input !== "string") return "";
  let s = input.trim();
  s = removeControlChars(s);
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  const MAX_LENGTH = 4000;
  if (s.length > MAX_LENGTH) s = s.slice(0, MAX_LENGTH);
  return s;
}

// Type augmentation for window object
declare global {
  interface Window {
    nexusApi: NexusApi;
  }
}
