// packages/synapse-bridge/src/extension.ts
import * as vscode from "vscode";
import { v4 as uuidv4 } from "uuid";
import { parseIntent } from "./intentParser";

// TaskVector type definition (copied from nexus-core for v1)
interface TaskVector {
  id: string;
  timestamp: number;
  sourceCode: string;
  naturalLanguageIntent: string;
  parsedIntent: {
    primaryAction:
      | "CREATE"
      | "TEST"
      | "REFACTOR"
      | "DEBUG"
      | "DOCUMENT"
      | "RESEARCH";
    subject: string;
    context: string[];
  };
  projectContext: {
    projectId: string;
    filePath: string;
    projectStyleGuide: Record<string, any>;
  };
  constraints: {
    maxBudget: number;
    maxTimeSeconds: number;
    requiredCredibility: number;
  };
}

/**
 * Activates the Synapse Bridge extension.
 * Registers the synapse-weaver.activate command.
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("[SYNAPSE-BRIDGE] Extension activated");

  const disposable = vscode.commands.registerCommand(
    "synapse-weaver.activate",
    async () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(
          "Synapse Weaver: No active editor found. Please open a file first."
        );
        return;
      }

      // Get the user's current text selection
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText || selectedText.trim().length === 0) {
        vscode.window.showInformationMessage(
          "Synapse Weaver: Please select a block of code to analyze."
        );
        return;
      }

      // Display input box for user directive
      const userIntent = await vscode.window.showInputBox({
        prompt:
          "Weaver is listening... What is your directive for the selected code?",
        placeHolder:
          'e.g., "refactor this function" or "create tests for this code"',
      });

      // Exit gracefully if user cancels
      if (!userIntent) {
        return;
      }

      // Parse the intent
      const parsedIntent = parseIntent(userIntent);

      // Construct the TaskVector
      const taskVector: TaskVector = {
        id: uuidv4(),
        timestamp: Date.now(),
        sourceCode: selectedText,
        naturalLanguageIntent: userIntent,
        parsedIntent: {
          primaryAction: parsedIntent.primaryAction,
          subject: parsedIntent.subject,
          context: parsedIntent.context,
        },
        projectContext: {
          projectId: vscode.workspace.name || "unknown-project",
          filePath: editor.document.uri.fsPath,
          projectStyleGuide: {}, // Placeholder for future Personal En-gram
        },
        constraints: {
          maxBudget: 10.0, // Placeholder: $10 max computational cost
          maxTimeSeconds: 300, // Placeholder: 5 minutes max
          requiredCredibility: 0.7, // Placeholder: require 70% credibility
        },
      };

      // Log the TaskVector to the VS Code Debug Console
      console.log("--- Synapse Bridge: Task Vector Created ---");
      console.log(JSON.stringify(taskVector, null, 2));

      // Show confirmation to user
      vscode.window.showInformationMessage(
        `Synapse Weaver: Task received (${parsedIntent.primaryAction}). Check Debug Console for details.`
      );
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Deactivates the Synapse Bridge extension.
 */
export function deactivate() {
  console.log("[SYNAPSE-BRIDGE] Extension deactivated");
}
