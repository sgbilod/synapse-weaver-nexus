import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskFeed } from "../TaskFeed";
import type { SystemEvent } from "../../../preload.cjs";

describe("TaskFeed component", () => {
  test("shows empty state message when no events", () => {
    render(<TaskFeed events={[]} />);
    expect(screen.getByText(/Waiting for activity/i)).toBeInTheDocument();
  });

  test("renders event items when events provided", () => {
    const events: SystemEvent[] = [
      { timestamp: Date.now(), type: "TASK_RECEIVED", message: "Hello" },
    ];

    render(<TaskFeed events={events} />);
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(
      screen.getByText(/TASK RECEIVED|TASK_RECEIVED|TASK RECEIVED/i)
    ).toBeTruthy();
  });

  test("clicking RECEIPT_PROCESSED event calls onEventSelect", () => {
    const onEventSelect = jest.fn();
    const events: SystemEvent[] = [
      {
        timestamp: Date.now(),
        type: "RECEIPT_PROCESSED",
        message: "Completed",
        details: { results: [] },
      },
    ];

    render(<TaskFeed events={events} onEventSelect={onEventSelect} />);

    const item = screen.getByText(/Completed/);
    fireEvent.click(item);
    expect(onEventSelect).toHaveBeenCalledTimes(1);
  });
});
