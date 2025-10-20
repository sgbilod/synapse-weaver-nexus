import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskInput } from "../TaskInput";

describe("TaskInput component", () => {
  test("renders textarea and submit button", () => {
    const onTaskSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onTaskSubmit} />);

    expect(
      screen.getByPlaceholderText(/Enter your task or query/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Dispatch/i })
    ).toBeInTheDocument();
  });

  test("submits task on button click", () => {
    const onTaskSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onTaskSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your task or query/i);
    fireEvent.change(textarea, { target: { value: "Make a sandwich" } });

    const button = screen.getByRole("button", { name: /Dispatch/i });
    fireEvent.click(button);

    expect(onTaskSubmit).toHaveBeenCalledTimes(1);
    expect(onTaskSubmit).toHaveBeenCalledWith("Make a sandwich");
  });

  test("submits task on Enter key (without Shift)", () => {
    const onTaskSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onTaskSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your task or query/i);
    fireEvent.change(textarea, { target: { value: "Run tests" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", charCode: 13 });

    expect(onTaskSubmit).toHaveBeenCalledWith("Run tests");
  });

  test("does not submit when isProcessing is true", () => {
    const onTaskSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onTaskSubmit} isProcessing={true} />);

    const textarea = screen.getByPlaceholderText(/Enter your task or query/i);
    fireEvent.change(textarea, { target: { value: "Will not submit" } });

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onTaskSubmit).not.toHaveBeenCalled();
  });

  test("navigates history with ArrowUp and ArrowDown", async () => {
    const onTaskSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onTaskSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your task or query/i);

    // Submit two tasks
    fireEvent.change(textarea, { target: { value: "First task" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", charCode: 13 });

    fireEvent.change(textarea, { target: { value: "Second task" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", charCode: 13 });

    // Wait for the history indicator to show 2 tasks so state has updated
    const historyIndicator = await screen.findByText(/2 task/i);
    expect(historyIndicator).toBeInTheDocument();

    // ArrowUp should recall the last (Second task)
    fireEvent.keyDown(textarea, { key: "ArrowUp" });
    expect((textarea as HTMLTextAreaElement).value).toBe("Second task");

    // Another ArrowUp should recall the first task
    fireEvent.keyDown(textarea, { key: "ArrowUp" });
    expect((textarea as HTMLTextAreaElement).value).toBe("First task");

    // ArrowDown should go forward in history
    fireEvent.keyDown(textarea, { key: "ArrowDown" });
    expect((textarea as HTMLTextAreaElement).value).toBe("Second task");
  });
});
