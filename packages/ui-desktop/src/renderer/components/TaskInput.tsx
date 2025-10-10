/**
 * TaskInput - Command Interface
 *
 * The primary input mechanism for sending tasks to the Nexus Core.
 * Users can type natural language requests and dispatch them to the orchestration engine.
 */

import React, { useState, useRef, KeyboardEvent } from "react";
import "./TaskInput.css";

interface TaskInputProps {
  onTaskSubmit: (_task: string) => void;
  isProcessing?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onTaskSubmit,
  isProcessing = false,
}) => {
  const [taskText, setTaskText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmedTask = taskText.trim();
    if (!trimmedTask || isProcessing) return;

    // Add to history
    setHistory((prev) => [...prev, trimmedTask]);
    setHistoryIndex(-1);

    // Submit task
    onTaskSubmit(trimmedTask);

    // Clear input
    setTaskText("");

    // Refocus input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    // Navigate history with Up/Down arrows
    if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      const newIndex =
        historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setTaskText(history[history.length - 1 - newIndex]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTaskText(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTaskText("");
      }
      return;
    }
  };

  return (
    <div className="task-input-container">
      <div className="input-header">
        <span className="input-label">⚡ Command Interface</span>
        <span className="input-hint">
          Enter: Submit • Shift+Enter: New Line • ↑↓: History
        </span>
      </div>

      <div className="input-wrapper">
        <textarea
          ref={inputRef}
          className="task-textarea"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your task or query... (e.g., 'Create a user authentication system with JWT tokens')"
          disabled={isProcessing}
          rows={3}
        />

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!taskText.trim() || isProcessing}
          title="Submit Task (Enter)"
        >
          {isProcessing ? (
            <>
              <span className="spinner-small" />
              Processing...
            </>
          ) : (
            <>
              <span>🚀</span>
              Dispatch
            </>
          )}
        </button>
      </div>

      {history.length > 0 && (
        <div className="history-info">
          <span className="history-count">
            {history.length} task{history.length !== 1 ? "s" : ""} in history
          </span>
        </div>
      )}
    </div>
  );
};
