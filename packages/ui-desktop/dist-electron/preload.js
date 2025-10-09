"use strict";
/**
 * Preload Script - The Bridge Between Worlds
 *
 * This script runs in a secure context with access to both Node.js and the renderer.
 * It uses Electron's contextBridge to safely expose specific APIs to the frontend.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose the protected API to the renderer process
electron_1.contextBridge.exposeInMainWorld("nexusApi", {
    getInitialState: () => electron_1.ipcRenderer.invoke("nexus:get-initial-state"),
    submitTask: (task) => electron_1.ipcRenderer.invoke("nexus:submit-task", task),
    onStateUpdate: (callback) => {
        electron_1.ipcRenderer.on("nexus:state-updated", (_event, state) => callback(state));
    },
    removeStateUpdateListener: () => {
        electron_1.ipcRenderer.removeAllListeners("nexus:state-updated");
    },
});
//# sourceMappingURL=preload.js.map