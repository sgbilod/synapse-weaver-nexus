/**
 * TaskInput - Command Interface
 *
 * The primary input mechanism for sending tasks to the Nexus Core.
 * Users can type natural language requests and dispatch them to the orchestration engine.
 */

import React, { useState, useRef, KeyboardEvent } from "react";
import "./TaskInput.css";
import { removeControlChars } from "../utils/textUtils";

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
  const lastSubmitAtRef = useRef<number | null>(null);
  const RATE_LIMIT_MS =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "test"
      ? 0
      : 500; // default 500ms rate limit in production

  /**
   * Sanitize a user-supplied task string before submitting it to the Core.
   * - Trims whitespace
   * - Removes control characters
   * - Removes any script tags
   * - Truncates to a safe maximum length
   */
  const sanitizeTask = (raw: string): string => {
    if (!raw) return "";

    // Trim first
    let s = raw.trim();

    // Remove invisible/control characters using the shared helper
    s = removeControlChars(s);

    // Remove script tags and their contents
    s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    // Simple truncation to avoid excessively large payloads
    const MAX_LENGTH = 2000; // 2k characters
    if (s.length > MAX_LENGTH) s = s.slice(0, MAX_LENGTH);

    return s;
  };

  const handleSubmit = () => {
    // Basic rate-limiting: avoid double submits within 500ms
    const now = Date.now();
    if (
      lastSubmitAtRef.current &&
      now - lastSubmitAtRef.current < RATE_LIMIT_MS
    )
      return;

    const sanitized = sanitizeTask(taskText);
    if (!sanitized || isProcessing) return;

    // Add to history
    setHistory((prev) => [...prev, sanitized]);
    setHistoryIndex(-1);

    // Submit task (already sanitized)
    onTaskSubmit(sanitized);

    // Record submit time
    lastSubmitAtRef.current = now;

    // Clear input and refocus
    setTaskText("");
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
