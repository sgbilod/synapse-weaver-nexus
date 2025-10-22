import React from "react";
import { render, screen } from "@testing-library/react";
import { StateMonitor } from "../StateMonitor";

describe("StateMonitor component", () => {
  test("renders unknown enclave values and no agents", () => {
    const personalEnclave = {
      indentation: "unknown" as const,
      quoteStyle: "unknown" as const,
      preferredLibraries: [] as string[],
    };

    const agentCredibilityLedger = {} as Record<string, number>;

    render(
      <StateMonitor
        personalEnclave={personalEnclave}
        agentCredibilityLedger={agentCredibilityLedger}
      />
    );

    expect(screen.getByText(/Personal En-gram/i)).toBeInTheDocument();
    const unknowns = screen.getAllByText(/unknown/i);
    // Indentation and Quote Style should both report 'unknown'
    expect(unknowns.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/No agents tracked yet/i)).toBeInTheDocument();
  });

  test("renders agent entries with credibility percentages", () => {
    const personalEnclave = {
      indentation: "spaces" as const,
      quoteStyle: "single" as const,
      preferredLibraries: ["react"],
    };

    const agentCredibilityLedger = { agentA: 0.72, agentB: 0.95 } as Record<
      string,
      number
    >;

    render(
      <StateMonitor
        personalEnclave={personalEnclave}
        agentCredibilityLedger={agentCredibilityLedger}
      />
    );

    expect(screen.getByText(/agentA/i)).toBeInTheDocument();
    expect(screen.getByText(/72%/)).toBeInTheDocument();
    expect(screen.getByText(/95%/)).toBeInTheDocument();
  });
});
