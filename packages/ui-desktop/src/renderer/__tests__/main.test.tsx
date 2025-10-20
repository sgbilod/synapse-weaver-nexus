/**
 * Ensure the renderer entrypoint initializes React correctly.
 * We mock `react-dom/client` to avoid actually creating a real root
 * and verify that the app attempts to render.
 */
import React from "react";

describe("renderer entry (main.tsx)", () => {
  test("creates root and renders App", () => {
    const mockRender = jest.fn();

    // Prepare DOM
    document.body.innerHTML = '<div id="root"></div>';

    // Mock react-dom/client before importing the module
    jest.doMock("react-dom/client", () => ({
      createRoot: (_el: any) => ({ render: mockRender }),
    }));

    // Import the module in an isolated module context so our mock is used
    jest.isolateModules(() => {
      require("../main");
    });

    expect(mockRender).toHaveBeenCalled();
  });
});
