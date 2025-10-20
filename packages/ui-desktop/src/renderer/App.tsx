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
import type { NexusState, SystemEvent } from "../preload.cjs";
import "./App.css";

export const App: React.FC = () => {
  const [nexusState, setNexusState] = useState<NexusState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessingTask, setIsProcessingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);

  // Fetch initial state on mount
  useEffect(() => {
    const initializeState = async () => {
      try {
        console.log(
          "[COMMAND DECK] Requesting initial state from Nexus Core..."
        );

        // Check if nexusApi is available
        if (!window.nexusApi) {
          throw new Error("nexusApi is not available on window object");
        }

        const initialState = await window.nexusApi.getInitialState();
        setNexusState(initialState);
        setIsConnected(true);
        console.log("[COMMAND DECK] Initial state received:", initialState);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          "[COMMAND DECK] Failed to get initial state:",
          errorMessage
        );
        setError(errorMessage);
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

    // Only attempt to register if the preload API is available and implements
    // the subscription API. This makes the renderer safe to mount in test
    // environments or when the preload bridge isn't present.
    if (
      window?.nexusApi &&
      typeof window.nexusApi.onStateUpdate === "function"
    ) {
      window.nexusApi.onStateUpdate(handleStateUpdate);

      // Cleanup listener on unmount
      return () => {
        if (typeof window.nexusApi.removeStateUpdateListener === "function") {
          window.nexusApi.removeStateUpdateListener();
        }
      };
    }

    console.warn(
      "[COMMAND DECK] nexusApi not available; skipping state update subscription"
    );
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

  // Error state
  if (error) {
    return (
      <div className="app-loading" style={{ background: "#1a0a0a" }}>
        <div
          style={{
            padding: "2rem",
            background: "#ff000020",
            border: "2px solid #ff0000",
            borderRadius: "8px",
            maxWidth: "600px",
          }}
        >
          <h2 style={{ color: "#ff4444", marginBottom: "1rem" }}>
            ⚠️ Error Loading Command Deck
          </h2>
          <p style={{ color: "#ffaaaa", marginBottom: "1rem" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              background: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  // Loading state
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
            <TaskFeed
              events={nexusState.systemEvents}
              onEventSelect={setSelectedEvent}
              selectedEvent={selectedEvent}
            />
          </section>

          <section className="panel panel-right">
            <DetailView selectedEvent={selectedEvent} />
          </section>
        </div>
      </main>
    </div>
  );
};
