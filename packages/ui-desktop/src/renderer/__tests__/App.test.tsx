import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// Silence logger output during tests
jest.mock("../../logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
import { App } from "../App";

describe("App (Command Deck) integration", () => {
  type MaybeNexusApi =
    | {
        getInitialState?: () => Promise<unknown>;
        submitTask?: (task: string) => Promise<void>;
        onStateUpdate?: (...args: unknown[]) => void;
        removeStateUpdateListener?: () => void;
      }
    | undefined;

  const originalNexusApi = (
    global as unknown as { window?: { nexusApi?: MaybeNexusApi } }
  ).window?.nexusApi;

  afterEach(() => {
    // Restore original API to avoid test leakage
    if (typeof window !== "undefined") {
      (global as unknown as { window?: { nexusApi?: MaybeNexusApi } }).window =
        {
          ...(global as unknown as { window?: { nexusApi?: MaybeNexusApi } })
            .window,
          nexusApi: originalNexusApi,
        };
    }
    jest.restoreAllMocks();
  });

  test("shows error state when nexusApi not available", async () => {
    // Ensure no nexusApi is present
    // @ts-ignore
    delete (window as any).nexusApi;

    render(<App />);

    expect(
      await screen.findByText(/Error Loading Command Deck/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Reload/)).toBeInTheDocument();
  });

  test("loads initial state and submits tasks through nexusApi", async () => {
    const mockState = {
      personalEnclave: {
        indentation: "unknown",
        quoteStyle: "unknown",
        preferredLibraries: [],
      },
      agentCredibilityLedger: {},
      systemEvents: [],
    };

    const submitTask = jest.fn().mockResolvedValue(undefined);
    const onStateUpdate = jest.fn();
    const removeStateUpdateListener = jest.fn();

    // @ts-ignore
    window.nexusApi = {
      getInitialState: jest.fn().mockResolvedValue(mockState),
      submitTask,
      onStateUpdate,
      removeStateUpdateListener,
    };

    const { unmount } = render(<App />);

    // Wait for UI to display connected state
    await screen.findByText(/Nexus Core Online/i);

    // Verify panels present
    expect(screen.getByText(/Personal En-gram/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Feed/i)).toBeInTheDocument();

    // Submit a task through UI
    const textarea = screen.getByPlaceholderText(/Enter your task or query/i);
    fireEvent.change(textarea, { target: { value: "Test task from UI" } });
    const button = screen.getByRole("button", { name: /Dispatch/i });
    fireEvent.click(button);

    await waitFor(() => expect(submitTask).toHaveBeenCalledTimes(1));
    expect(submitTask).toHaveBeenCalledWith("Test task from UI");

    // Verify onStateUpdate handler registered and cleanup called
    expect(onStateUpdate).toHaveBeenCalled();
    unmount();
    expect(removeStateUpdateListener).toHaveBeenCalled();
  });
});
