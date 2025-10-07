// packages/synapse-bridge/src/extension.integration.test.ts
import * as vscode from "vscode";

// Mock vscode module (loaded from __mocks__/vscode.js)
jest.mock("vscode");

// Mock the OrchestrationEngine BEFORE importing extension
const mockReceiveTask = jest
  .fn()
  .mockImplementation((vector: any, projectRootPath: any) =>
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

const mockOrchestrationEngineConstructor = jest.fn().mockImplementation(() => ({
  receiveTask: mockReceiveTask,
}));

jest.mock("../../nexus-core/src/OrchestrationEngine", () => ({
  OrchestrationEngine: mockOrchestrationEngineConstructor,
}));

// NOW import the extension after mocks are set up
import { activate } from "./extension";

describe("Extension Integration Tests - Resilience Protocol", () => {
  let mockContext: vscode.ExtensionContext;
  let mockEditor: any;

  beforeEach(() => {
    // Reset all mocks but preserve mock implementations
    jest.clearAllMocks();
    mockReceiveTask.mockClear();
    mockOrchestrationEngineConstructor.mockClear();
    
    // CRITICAL: Clear the vscode.window mocks to reset withProgress call tracking
    (vscode.window.withProgress as jest.Mock).mockClear();
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

    it("should NOT create OrchestrationEngine instance on activation (lazy init)", () => {
      activate(mockContext);

      // Engine should NOT be created during activation
      expect(mockOrchestrationEngineConstructor).not.toHaveBeenCalled();
    });
  });

  describe("synapse-weaver.activate command execution - Lazy Initialization", () => {
    let commandHandler: Function;

    beforeEach(() => {
      // Fresh activation for each test
      mockContext = {
        subscriptions: [],
      } as any;
      
      activate(mockContext);

      // Extract the command handler function
      const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
      commandHandler = registerCommandMock.mock.calls[registerCommandMock.mock.calls.length - 1][1];
    });

    it("should handle initialization errors gracefully and display detailed error message", async () => {
      // Make constructor throw - this test MUST run first before engine is created
      mockOrchestrationEngineConstructor.mockImplementationOnce(() => {
        throw new Error("Docker daemon not running");
      });

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
      expect(errorMessage).toContain("Docker daemon not running");
    });

    it("should create OrchestrationEngine with progress UI on FIRST command, then reuse on SECOND", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(
        "test this code"
      );

      // FIRST execution - should create engine with progress UI
      await commandHandler();

      // Verify engine created
      expect(mockOrchestrationEngineConstructor).toHaveBeenCalled();
      const firstCallCount = mockOrchestrationEngineConstructor.mock.calls.length;
      
      // Verify progress UI was shown
      expect(vscode.window.withProgress).toHaveBeenCalled();

      // Clear mock history but keep the instance
      mockOrchestrationEngineConstructor.mockClear();
      (vscode.window.withProgress as jest.Mock).mockClear();

      // SECOND execution - should reuse engine (no new creation, no progress UI)
      await commandHandler();
      
      expect(mockOrchestrationEngineConstructor).not.toHaveBeenCalled();
      expect(vscode.window.withProgress).not.toHaveBeenCalled();
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
