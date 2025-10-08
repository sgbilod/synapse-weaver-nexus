import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("nexusApi", {
  getInitialState: () => ipcRenderer.invoke("nexus:get-initial-state"),
  submitTask: (task) => ipcRenderer.invoke("nexus:submit-task", task),
  onStateUpdate: (callback) => {
    ipcRenderer.on("nexus:state-updated", (_event, state) => callback(state));
  },
  removeStateUpdateListener: () => {
    ipcRenderer.removeAllListeners("nexus:state-updated");
  }
});
