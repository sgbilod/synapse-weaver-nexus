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
