// Manual mock for vscode module
const mockDisposable = { dispose: jest.fn() };

module.exports = {
  commands: {
    registerCommand: jest.fn(() => mockDisposable),
  },
  window: {
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showInputBox: jest.fn(),
    activeTextEditor: undefined,
    withProgress: jest.fn((options, task) => {
      // Simulate progress API by calling the task with a mock progress reporter
      const mockProgress = {
        report: jest.fn(),
      };
      return task(mockProgress);
    }),
  },
  ProgressLocation: {
    Notification: 15, // VS Code's actual enum value
    Window: 10,
    SourceControl: 1,
  },
  workspace: {
    name: "test-workspace",
    workspaceFolders: [
      {
        uri: {
          fsPath: "/test/workspace",
        },
        name: "test-workspace",
        index: 0,
      },
    ],
  },
};
