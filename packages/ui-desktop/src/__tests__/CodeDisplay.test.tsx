/// <reference types="jest" />
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CodeDisplay } from "../renderer/components/CodeDisplay";

// react-syntax-highlighter is mocked in __mocks__ to render a <pre data-testid="syntax"> for children

describe("CodeDisplay", () => {
  test("renders title and code content", () => {
    const code = "const x = 1;";
    render(
      <CodeDisplay code={code} language="javascript" title="Generated Code" />
    );

    expect(screen.getByText(/Generated Code/)).toBeInTheDocument();
    expect(screen.getByTestId("syntax")).toHaveTextContent(code);
  });
});
