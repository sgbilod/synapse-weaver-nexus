/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import { describe, test } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { DetailView } from "../renderer/components/DetailView";
import type { SystemEvent } from "../preload.cjs";

describe("DetailView", () => {
  test("shows placeholder when no selected event", () => {
    render(<DetailView selectedEvent={null} />);
    expect(screen.getByText(/Select a Task/i)).toBeInTheDocument();
  });

  test("extracts and displays code from RECEIPT_PROCESSED details", () => {
    const code = 'console.log("hi")';
    const ev: SystemEvent = {
      timestamp: Date.now(),
      type: "RECEIPT_PROCESSED",
      message: "Completed",
      details: {
        results: [
          {
            // Use JSON.stringify so the embedded JSON is a valid string value
            output: JSON.stringify({ code }),
          },
        ],
      },
    } as unknown as SystemEvent;

    render(<DetailView selectedEvent={ev} />);

    // The CodeDisplay (and underlying syntax highlighter mock) should render the code
    expect(screen.getByTestId("syntax")).toHaveTextContent(code);
  });

  test("falls back to showing message when receipt has no code", () => {
    const ev: SystemEvent = {
      timestamp: Date.now(),
      type: "RECEIPT_PROCESSED",
      message: "No code here",
      details: { results: [{ output: "no-json-here" }] },
    } as unknown as SystemEvent;

    render(<DetailView selectedEvent={ev} />);
    expect(screen.getByText(/No code here/)).toBeInTheDocument();
  });
});
