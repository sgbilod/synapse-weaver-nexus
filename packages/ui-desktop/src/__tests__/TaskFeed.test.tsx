/// <reference types="jest" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskFeed } from "../renderer/components/TaskFeed";
import type { SystemEvent } from "../preload.cjs";

describe("TaskFeed component", () => {
  test("renders empty placeholder when no events", () => {
    render(<TaskFeed events={[]} />);
    expect(screen.getByText(/Waiting for activity/i)).toBeInTheDocument();
  });

  test("renders receipt event as clickable button and shows details", () => {
    const onSelect = jest.fn();

    const events: SystemEvent[] = [
      {
        timestamp: 1,
        type: "RECEIPT_PROCESSED",
        message: "Completed",
        details: { results: [{ output: '{"code": "console.log(1)"}' }] },
      },
    ];

    render(
      <TaskFeed events={events} onEventSelect={onSelect} selectedEvent={null} />
    );

    // message renders
    expect(screen.getByText(/Completed/)).toBeInTheDocument();

    // rendered as button (clickable)
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledWith(events[0]);

    // details JSON rendered
    expect(screen.getByText(/code/)).toBeInTheDocument();
  });

  test("renders non-receipt events as non-clickable items", () => {
    const events: SystemEvent[] = [
      {
        timestamp: 2,
        type: "TASK_RECEIVED",
        message: "Received",
        details: null,
      },
    ];

    render(<TaskFeed events={events} />);
    expect(screen.getByText(/Received/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
