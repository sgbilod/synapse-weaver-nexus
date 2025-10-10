// packages/synapse-bridge/src/extension.integration.test.ts
import * as vscode from "vscode";

// Mock vscode module (loaded from __mocks__/vscode.js)
jest.mock("vscode");

// Mock axios for HTTP communication with Nexus Server
const mockAxiosPost = jest.fn().mockImplementation((url: string, data: any) =>
  Promise.resolve({
    data: {
      receiptId: "test-receipt-123",
      planId: "test-plan-123",
      taskId: data.taskVector.id,
      outcome: "COMPLETED",
      finalCost: 1.5,
      finalTimeSeconds: 30,
      results: [
        {
          agentId: "sentinel-jest-ts-v1",
          output: "Test execution successful",
          wasAccepted: true,
        },
      ],
    },
  })
);

jest.mock("axios", () => {
  return {
    __esModule: true,
    default: {
      post: mockAxiosPost,
    },
  };
});

// NOW import the extension after mocks are set up
import { activate } from "./extension";

describe("Extension Integration Tests - Isolation Protocol", () => {
  let mockContext: vscode.ExtensionContext;
  let mockEditor: any;

  beforeEach(() => {
    // Reset all mocks but preserve mock implementations
    jest.clearAllMocks();
    mockAxiosPost.mockClear();

    (vscode.window.showErrorMessage as jest.Mock).mockClear();
    (vscode.window.showInformationMessage as jest.Mock).mockClear();

    // Create mock context
    mockContext = {
      subscriptions: [],
    } as any;

    // Create mock editor
    mockEditor = {
      selection: {
        isEmpty: false,
      },
      document: {
        getText: jest.fn().mockReturnValue("function testCode() {}"),
        uri: {
          fsPath: "/test/path/file.ts",
        },
      },
    };
  });

  describe("activate function", () => {
    it("should register the synapse-weaver.activate command", () => {
      activate(mockContext);

      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        "synapse-weaver.activate",
        expect.any(Function)
      );
    });

    it("should add command disposable to subscriptions", () => {
      activate(mockContext);

      expect(mockContext.subscriptions.length).toBe(1);
    });

    it("should NOT make any HTTP calls on activation", () => {
      activate(mockContext);

      // No HTTP calls should be made during activation
      expect(mockAxiosPost).not.toHaveBeenCalled();
    });
  });

  describe("synapse-weaver.activate command execution", () => {
    let commandHandler: Function;

    beforeEach(() => {
      // Fresh activation for each test
      mockContext = {
        subscriptions: [],
      } as any;

      activate(mockContext);

      // Extract the command handler function
      const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
      commandHandler =
        registerCommandMock.mock.calls[
          registerCommandMock.mock.calls.length - 1
        ][1];
    });

    it("should handle server errors gracefully and display detailed error message", async () => {
      // Make HTTP call fail
      mockAxiosPost.mockRejectedValueOnce(
        new Error("Server not running on port 3002")
      );

      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this code"
      );

      await commandHandler();

      // Should show comprehensive error message with all parts
      const errorCalls = (vscode.window.showErrorMessage as jest.Mock).mock
        .calls;
      expect(errorCalls.length).toBeGreaterThan(0);

      const errorMessage = errorCalls[0][0];
      expect(errorMessage).toContain(
        "Synapse Weaver encountered a critical error"
      );
      expect(errorMessage).toContain("Server not running");
    });

    it("should make HTTP POST request to task endpoint", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this code"
      );

      // Execute command
      await commandHandler();

      // Verify HTTP call was made
      expect(mockAxiosPost).toHaveBeenCalledTimes(1);
      expect(mockAxiosPost).toHaveBeenCalledWith(
        "http://localhost:3002/task",
        expect.objectContaining({
          taskVector: expect.any(Object),
          projectRootPath: expect.any(String),
        })
      );
    });

    it("should show error if no active editor", async () => {
      (vscode.window as any).activeTextEditor = undefined;

      await commandHandler();

      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining("No active editor")
      );
    });

    it("should show info message if no text selected", async () => {
      const emptySelectionEditor = {
        ...mockEditor,
        selection: { isEmpty: true },
        document: {
          ...mockEditor.document,
          getText: jest.fn().mockReturnValue(""),
        },
      };
      (vscode.window as any).activeTextEditor = emptySelectionEditor;

      await commandHandler();

      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
        expect.stringContaining("Please select a block of code")
      );
    });

    it("should exit gracefully if user cancels input", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(undefined);

      await commandHandler();

      // HTTP call should not be made
      expect(mockAxiosPost).not.toHaveBeenCalled();
    });

    it("should send properly structured TaskVector to server", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this function"
      );

      await commandHandler();

      expect(mockAxiosPost).toHaveBeenCalledTimes(1);

      // Check request payload structure
      const requestPayload = mockAxiosPost.mock.calls[0][1];
      const taskVector = requestPayload.taskVector;

      expect(taskVector).toMatchObject({
        id: expect.any(String),
        timestamp: expect.any(Number),
        sourceCode: "function testCode() {}",
        naturalLanguageIntent: "test this function",
        parsedIntent: {
          primaryAction: "TEST",
          subject: expect.any(String),
          context: expect.any(Array),
        },
        projectContext: {
          projectId: "test-workspace",
          filePath: "/test/path/file.ts",
          projectStyleGuide: {},
        },
        constraints: {
          maxBudget: expect.any(Number),
          maxTimeSeconds: expect.any(Number),
          requiredCredibility: expect.any(Number),
        },
      });

      // Check projectRootPath
      const projectRootPath = requestPayload.projectRootPath;
      expect(typeof projectRootPath).toBe("string");
      expect(projectRootPath).toBe("/test/workspace");
    });

    it("should display success message after task completion", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "refactor this code"
      );

      await commandHandler();

      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
        expect.stringContaining("Task completed successfully")
      );
      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
        expect.stringContaining("test-receipt-123")
      );
    });

    it("should handle task execution errors gracefully", async () => {
      mockAxiosPost.mockRejectedValueOnce(
        new Error("Task execution failed - insufficient resources")
      );

      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue("test this");

      await commandHandler();

      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining("Synapse Weaver encountered a critical error")
      );
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining("insufficient resources")
      );
    });
  });
});
