/**
 * DetailView - The Inspection Panel
 *
 * Displays detailed information about selected tasks, including
 * generated code with syntax highlighting.
 */

import React from "react";
import type { SystemEvent } from "../../preload";
import { CodeDisplay } from "./CodeDisplay";
import "./DetailView.css";

interface DetailViewProps {
  selectedEvent: SystemEvent | null;
}

export const DetailView: React.FC<DetailViewProps> = ({ selectedEvent }) => {
  // Extract code from receipt if available
  const extractCode = (event: SystemEvent | null): string | null => {
    if (!event || event.type !== "RECEIPT_PROCESSED") return null;

    try {
      const details = event.details;
      if (!details?.results || !Array.isArray(details.results)) return null;

      const firstResult = details.results[0];
      if (!firstResult) return null;

      // Try to parse output as JSON to extract code
      if (typeof firstResult.output === "string") {
        // Clean ANSI escape codes and other control characters
        const cleanOutput = firstResult.output.replace(
          // eslint-disable-next-line no-control-regex
          /[\u0000-\u001F\u007F-\u009F]/g,
          ""
        );

        // Try to extract JSON from the output
        const jsonMatch = cleanOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.code) return parsed.code;
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to extract code from event:", error);
      return null;
    }
  };

  const code = extractCode(selectedEvent);

  return (
    <div className="detail-view">
      <h2 className="panel-header">🔍 Detail View</h2>

      {!selectedEvent ? (
        <div className="detail-placeholder">
          <div className="placeholder-icon">🔮</div>
          <h3>Select a Task</h3>
          <p>Click on a completed task (✅ Receipt Processed) to view details</p>
        </div>
      ) : code ? (
        <CodeDisplay
          code={code}
          language="javascript"
          title="Generated Code"
        />
      ) : (
        <div className="detail-content">
          <div className="event-detail-header">
            <span className="event-detail-icon">
              {getEventIcon(selectedEvent.type)}
            </span>
            <h3>{formatEventType(selectedEvent.type)}</h3>
          </div>
          <div className="event-detail-body">
            <p className="event-detail-message">{selectedEvent.message}</p>
            {selectedEvent.details && (
              <div className="event-detail-json">
                <h4>Details:</h4>
                <pre>{JSON.stringify(selectedEvent.details, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Get icon for event type
 */
function getEventIcon(type: SystemEvent["type"]): string {
  const icons: Record<SystemEvent["type"], string> = {
    TASK_RECEIVED: "📥",
    PLAN_CREATED: "📋",
    AGENT_DISPATCHED: "🚀",
    RECEIPT_PROCESSED: "✅",
  };
  return icons[type] || "📌";
}

/**
 * Format event type for display
 */
function formatEventType(type: SystemEvent["type"]): string {
  return type.replace(/_/g, " ");
}

