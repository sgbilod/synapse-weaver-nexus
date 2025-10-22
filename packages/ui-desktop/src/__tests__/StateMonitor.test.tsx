/// <reference types="jest" />
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StateMonitor } from "../renderer/components/StateMonitor";

describe("StateMonitor", () => {
  test("shows personal enclave values and fallback when no preferred libraries", () => {
    const props = {
      personalEnclave: {
        indentation: 2,
        quoteStyle: "double",
        preferredLibraries: [],
      },
      agentCredibilityLedger: {},
    } as any;

    render(<StateMonitor {...props} />);

    expect(screen.getByText(/indentation/i)).toBeInTheDocument();
    expect(screen.getByText(/quote style/i)).toBeInTheDocument();
    // when no preferred libraries -> show 'None learned yet' fallback
    expect(screen.getByText(/None learned yet/i)).toBeInTheDocument();
  });

  test("renders agent ledger entries with percentage and bar width", () => {
    const props = {
      personalEnclave: {
        indentation: 2,
        quoteStyle: "single",
        preferredLibraries: ["lib-a"],
      },
      agentCredibilityLedger: {
        "agent-one": 0.75,
        "agent-two": 0.3,
      },
    } as any;

    render(<StateMonitor {...props} />);

    // agent ids appear
    expect(screen.getByText(/agent-one/)).toBeInTheDocument();
    expect(screen.getByText(/agent-two/)).toBeInTheDocument();

    // percentage text appears
    expect(screen.getByText(/75%/)).toBeInTheDocument();
    expect(screen.getByText(/30%/)).toBeInTheDocument();

    // credibility fill width should reflect percentage (class-based)
    const agentOneNode = screen.getByText(/agent-one/);
    const agentOneItem = agentOneNode.closest(
      ".agent-item"
    ) as HTMLElement | null;
    expect(agentOneItem).not.toBeNull();
    if (agentOneItem) {
      const fill = agentOneItem.querySelector(
        ".credibility-fill"
      ) as HTMLElement | null;
      expect(fill).not.toBeNull();
      expect(fill!.className).toEqual(expect.stringContaining("w-75"));
    }
  });
});
