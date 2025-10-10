/**
 * TaskFeed - The Activity Stream
 *
 * Displays a real-time log of system events: tasks received, plans created,
 * agents dispatched, receipts processed.
 */

import React, { useEffect, useRef } from "react";
import type { SystemEvent } from "../../preload.cjs";
import "./TaskFeed.css";

interface TaskFeedProps {
  events: SystemEvent[];
  onEventSelect?: (_event: SystemEvent) => void;
  selectedEvent?: SystemEvent | null;
}

export const TaskFeed: React.FC<TaskFeedProps> = ({
  events,
  onEventSelect,
  selectedEvent,
}) => {
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <div className="task-feed">
      <h2 className="panel-header">📡 Task Feed</h2>

      <div className="feed-container">
        {events.length === 0 ? (
          <div className="empty-feed">
            <p>Waiting for activity...</p>
            <span className="pulse-dot" />
          </div>
        ) : (
          <div className="event-list">
            {events.map((event, index) => {
              const isSelected =
                selectedEvent?.timestamp === event.timestamp &&
                selectedEvent?.type === event.type;
              const isClickable =
                event.type === "RECEIPT_PROCESSED" && onEventSelect;

              return (
                <div
                  key={`${event.timestamp}-${index}`}
                  className={`event-item event-${event.type.toLowerCase()} ${
                    isSelected ? "selected" : ""
                  } ${isClickable ? "clickable" : ""}`}
                  onClick={() => isClickable && onEventSelect(event)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                >
                  <div className="event-header">
                    <span className="event-icon">
                      {getEventIcon(event.type)}
                    </span>
                    <span className="event-type">
                      {formatEventType(event.type)}
                    </span>
                    <span className="event-timestamp">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  <div className="event-message">{event.message}</div>
                  {event.details && (
                    <div className="event-details">
                      <pre>{JSON.stringify(event.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={feedEndRef} />
          </div>
        )}
      </div>
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

/**
 * Format timestamp to readable time
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
