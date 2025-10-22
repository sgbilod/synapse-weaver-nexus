import React from "react";
import { render, screen } from "@testing-library/react";
import { CodeDisplay } from "../CodeDisplay";

// Mock SyntaxHighlighter to simplify assertions
jest.mock("react-syntax-highlighter", () => ({
  Prism: ({ children }: any) => <pre data-testid="syntax">{children}</pre>,
}));

describe("CodeDisplay component", () => {
  test("renders title and code block", () => {
    const code = "const x = 1;";
    render(<CodeDisplay code={code} title="Generated Code" />);

    expect(screen.getByText(/Generated Code/)).toBeInTheDocument();
    expect(screen.getByTestId("syntax")).toHaveTextContent(code);
  });
});
