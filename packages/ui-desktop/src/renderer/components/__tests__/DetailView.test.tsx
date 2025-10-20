import React from "react";
import { render, screen } from "@testing-library/react";
import { DetailView } from "../DetailView";
import type { SystemEvent } from "../../../preload.cjs";

// Mock react-syntax-highlighter to keep tests fast and deterministic
jest.mock("react-syntax-highlighter", () => ({
  Prism: ({ children }: any) => <pre data-testid="syntax">{children}</pre>,
}));

describe("DetailView component", () => {
  test("renders placeholder when no event selected", () => {
    render(<DetailView selectedEvent={null} />);
    expect(screen.getByText(/Select a Task/i)).toBeInTheDocument();
  });

  test("renders simple event details", () => {
    const event: SystemEvent = {
      timestamp: Date.now(),
      type: "PLAN_CREATED",
      message: "Plan",
      details: { planId: "p1" },
    };

    render(<DetailView selectedEvent={event} />);
    expect(screen.getByText(/Plan/)).toBeInTheDocument();
    expect(screen.getByText(/planId/)).toBeInTheDocument();
  });

  test("extracts code from RECEIPT_PROCESSED event and shows CodeDisplay", () => {
    const code = 'console.log("hi")';
    const details = {
      results: [{ output: JSON.stringify({ code }) }],
    };

    const event: SystemEvent = {
      timestamp: Date.now(),
      type: "RECEIPT_PROCESSED",
      message: "Done",
      details,
    };

    render(<DetailView selectedEvent={event} />);
    expect(screen.getByTestId("syntax")).toHaveTextContent(code);
  });
});
