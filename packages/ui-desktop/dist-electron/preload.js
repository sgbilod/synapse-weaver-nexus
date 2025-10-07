"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("nexusApi", {
  getInitialState: () => electron.ipcRenderer.invoke("nexus:get-initial-state"),
  onStateUpdate: (callback) => {
    electron.ipcRenderer.on("nexus:state-updated", (_event, state) => callback(state));
  },
  removeStateUpdateListener: () => {
    electron.ipcRenderer.removeAllListeners("nexus:state-updated");
  }
});
