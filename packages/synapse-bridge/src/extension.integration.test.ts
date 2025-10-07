// packages/synapse-bridge/src/extension.integration.test.ts
import * as vscode from "vscode";
import { activate } from "./extension";

// Mock vscode module (loaded from __mocks__/vscode.js)
jest.mock("vscode");

// Mock the OrchestrationEngine
let mockOrchestrationEngineConstructor: jest.Mock;
let mockReceiveTask: jest.Mock;

beforeEach(() => {
  mockReceiveTask = jest.fn().mockImplementation((vector, projectRootPath) =>
    Promise.resolve({
      receiptId: "test-receipt-123",
      planId: "test-plan-123",
      taskId: vector.id,
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
    })
  );

  mockOrchestrationEngineConstructor = jest
    .fn()
    .mockImplementation(() => ({
      receiveTask: mockReceiveTask,
    }));

  jest.mock("../../nexus-core/src/OrchestrationEngine", () => ({
    OrchestrationEngine: mockOrchestrationEngineConstructor,
  }));
});

describe("Extension Integration Tests - Resilience Protocol", () => {
  let mockContext: vscode.ExtensionContext;
  let mockEditor: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Reset the module cache to ensure fresh state
    jest.resetModules();

    // Re-require the mock
    mockReceiveTask = jest
      .fn()
      .mockImplementation((vector, projectRootPath) =>
        Promise.resolve({
          receiptId: "test-receipt-123",
          planId: "test-plan-123",
          taskId: vector.id,
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
        })
      );

    mockOrchestrationEngineConstructor = jest
      .fn()
      .mockImplementation(() => ({
        receiveTask: mockReceiveTask,
      }));

    jest.doMock("../../nexus-core/src/OrchestrationEngine", () => ({
      OrchestrationEngine: mockOrchestrationEngineConstructor,
    }));

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

    it("should NOT create OrchestrationEngine instance on activation (lazy init)", () => {
      const OrchestrationEngineMock =
        require("../../nexus-core/src/OrchestrationEngine").OrchestrationEngine;

      activate(mockContext);

      // Engine should NOT be created during activation
      expect(OrchestrationEngineMock).not.toHaveBeenCalled();
    });
  });

  describe("synapse-weaver.activate command execution - Lazy Initialization", () => {
    let commandHandler: Function;

    beforeEach(() => {
      activate(mockContext);

      // Extract the command handler function
      const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
      commandHandler = registerCommandMock.mock.calls[0][1];
    });

    it("should create OrchestrationEngine on FIRST command execution", async () => {
      const OrchestrationEngineMock =
        require("../../nexus-core/src/OrchestrationEngine").OrchestrationEngine;

      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this code"
      );

      await commandHandler();

      // Engine should be created on first use
      expect(OrchestrationEngineMock).toHaveBeenCalledTimes(1);
    });

    it("should display progress notification during first-time initialization", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this code"
      );

      await commandHandler();

      expect(vscode.window.withProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          location: vscode.ProgressLocation.Notification,
          title: "Synapse Nexus Core is starting...",
          cancellable: false,
        }),
        expect.any(Function)
      );
    });

    it("should NOT create OrchestrationEngine on SECOND command execution (reuse)", async () => {
      const OrchestrationEngineMock =
        require("../../nexus-core/src/OrchestrationEngine").OrchestrationEngine;

      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this code"
      );

      // First execution
      await commandHandler();
      expect(OrchestrationEngineMock).toHaveBeenCalledTimes(1);

      // Second execution
      await commandHandler();
      // Should still be 1 - no new instance created
      expect(OrchestrationEngineMock).toHaveBeenCalledTimes(1);
    });

    it("should handle initialization errors gracefully and display detailed error message", async () => {
      const OrchestrationEngineMock =
        require("../../nexus-core/src/OrchestrationEngine").OrchestrationEngine;

      // Make constructor throw
      OrchestrationEngineMock.mockImplementation(() => {
        throw new Error("Docker daemon not running");
      });

      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this code"
      );

      await commandHandler();

      // Should show comprehensive error message
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining("Synapse Weaver encountered a critical error")
      );
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining("Docker daemon not running")
      );
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining("Toggle Developer Tools")
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

      // receiveTask should not be called
      expect(mockReceiveTask).not.toHaveBeenCalled();
    });

    it("should call receiveTask with properly structured TaskVector", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this function"
      );

      await commandHandler();

      expect(mockReceiveTask).toHaveBeenCalledTimes(1);

      // Check TaskVector structure
      const taskVector = mockReceiveTask.mock.calls[0][0];
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
      const projectRootPath = mockReceiveTask.mock.calls[0][1];
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
      mockReceiveTask.mockRejectedValue(
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
