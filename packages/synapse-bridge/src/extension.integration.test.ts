// packages/synapse-bridge/src/extension.integration.test.ts
import * as vscode from "vscode";
import { activate } from "./extension";

// Mock vscode module (loaded from __mocks__/vscode.js)
jest.mock("vscode");

// Mock the OrchestrationEngine
jest.mock("../../nexus-core/src/OrchestrationEngine", () => {
  return {
    OrchestrationEngine: jest.fn().mockImplementation(() => ({
      receiveTask: jest.fn().mockResolvedValue({
        planId: "test-plan-123",
        swarm: [
          {
            agentProfile: {
              archetype: "Sentinel",
              specializations: ["jest", "typescript"],
              costPerToken: 0.0001,
              costPerSecond: 0.05,
            },
          },
        ],
        estimatedBudget: 1.5,
        estimatedTimeSeconds: 60,
      }),
    })),
  };
});

describe("Extension Integration Tests", () => {
  let mockContext: vscode.ExtensionContext;
  let mockEditor: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

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

    it("should create OrchestrationEngine instance on activation", () => {
      const OrchestrationEngineMock = require("../../nexus-core/src/OrchestrationEngine").OrchestrationEngine;
      
      activate(mockContext);

      expect(OrchestrationEngineMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("synapse-weaver.activate command execution", () => {
    let commandHandler: Function;

    beforeEach(() => {
      activate(mockContext);
      
      // Extract the command handler function
      const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
      commandHandler = registerCommandMock.mock.calls[0][1];
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

    it("should prompt user for directive with input box", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue("test this code");

      await commandHandler();

      expect(vscode.window.showInputBox).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: expect.stringContaining("What is your directive"),
        })
      );
    });

    it("should exit gracefully if user cancels input", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(undefined);

      await commandHandler();

      // Should not show any messages after cancellation
      expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
    });

    it("should call receiveTask with properly structured TaskVector", async () => {
      const OrchestrationEngineMock = require("../../nexus-core/src/OrchestrationEngine").OrchestrationEngine;
      const mockReceiveTask = jest.fn().mockResolvedValue({
        planId: "test-plan-123",
        swarm: [
          {
            agentProfile: {
              archetype: "Sentinel",
            },
          },
        ],
      });

      // Reset and recreate with new mock
      jest.clearAllMocks();
      OrchestrationEngineMock.mockImplementation(() => ({
        receiveTask: mockReceiveTask,
      }));

      activate(mockContext);
      const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
      const newCommandHandler = registerCommandMock.mock.calls[0][1];

      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue("test this function");

      await newCommandHandler();

      expect(mockReceiveTask).toHaveBeenCalledTimes(1);
      
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
    });

    it("should display ExecutionPlan to user after successful processing", async () => {
      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue("refactor this code");

      await commandHandler();

      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
        expect.stringContaining('Plan "test-plan-123" created')
      );
      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
        expect.stringContaining("Sentinel agent")
      );
    });

    it("should handle errors gracefully and display error message", async () => {
      const OrchestrationEngineMock = require("../../nexus-core/src/OrchestrationEngine").OrchestrationEngine;
      const mockReceiveTaskError = jest.fn().mockRejectedValue(
        new Error("Nexus Core communication failure")
      );

      // Reset and recreate with error mock
      jest.clearAllMocks();
      OrchestrationEngineMock.mockImplementation(() => ({
        receiveTask: mockReceiveTaskError,
      }));

      activate(mockContext);
      const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
      const newCommandHandler = registerCommandMock.mock.calls[0][1];

      (vscode.window as any).activeTextEditor = mockEditor;
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue("test this");

      await newCommandHandler();

      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining("Failed to process directive")
      );
    });
  });
});
