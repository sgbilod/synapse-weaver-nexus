/**
 * App.tsx - The Command Deck's Main Interface
 *
 * This is the primary React component that orchestrates the three-panel layout
 * and manages the connection to the Nexus Core via IPC.
 */

import React, { useState, useEffect } from "react";
import { StateMonitor } from "./components/StateMonitor";
import { TaskFeed } from "./components/TaskFeed";
import { DetailView } from "./components/DetailView";
import { TaskInput } from "./components/TaskInput";
import type { NexusState } from "../preload";
import "./App.css";

export const App: React.FC = () => {
  const [nexusState, setNexusState] = useState<NexusState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessingTask, setIsProcessingTask] = useState(false);

  // Fetch initial state on mount
  useEffect(() => {
    const initializeState = async () => {
      try {
        console.log(
          "[COMMAND DECK] Requesting initial state from Nexus Core..."
        );
        const initialState = await window.nexusApi.getInitialState();
        setNexusState(initialState);
        setIsConnected(true);
        console.log("[COMMAND DECK] Initial state received:", initialState);
      } catch (error) {
        console.error("[COMMAND DECK] Failed to get initial state:", error);
        setIsConnected(false);
      }
    };

    initializeState();
  }, []);

  // Listen for real-time state updates
  useEffect(() => {
    const handleStateUpdate = (updatedState: NexusState) => {
      console.log("[COMMAND DECK] State update received:", updatedState);
      setNexusState(updatedState);
    };

    window.nexusApi.onStateUpdate(handleStateUpdate);

    // Cleanup listener on unmount
    return () => {
      window.nexusApi.removeStateUpdateListener();
    };
  }, []);

  // Handle task submission
  const handleTaskSubmit = async (task: string) => {
    setIsProcessingTask(true);
    try {
      await window.nexusApi.submitTask(task);
      console.log("[COMMAND DECK] Task submitted successfully");
    } catch (error) {
      console.error("[COMMAND DECK] Failed to submit task:", error);
    } finally {
      setIsProcessingTask(false);
    }
  };

  if (!isConnected || !nexusState) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <h2>Initializing Nexus Core...</h2>
        <p>Establishing connection to the orchestration engine</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-title">
          <h1>⚡ SYNAPSE WEAVER NEXUS</h1>
          <span className="header-subtitle">Command Deck v1.0</span>
        </div>
        <div className="connection-status">
          <span className="status-indicator connected" />
          <span>Nexus Core Online</span>
        </div>
      </header>

      <main className="app-main">
        <TaskInput
          onTaskSubmit={handleTaskSubmit}
          isProcessing={isProcessingTask}
        />

        <div className="panel-container">
          <section className="panel panel-left">
            <StateMonitor
              personalEnclave={nexusState.personalEnclave}
              agentCredibilityLedger={nexusState.agentCredibilityLedger}
            />
          </section>

          <section className="panel panel-center">
            <TaskFeed events={nexusState.systemEvents} />
          </section>

          <section className="panel panel-right">
            <DetailView />
          </section>
        </div>
      </main>
    </div>
  );
};
