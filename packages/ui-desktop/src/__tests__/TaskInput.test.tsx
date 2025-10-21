/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import { describe, test, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaskInput } from "../renderer/components/TaskInput";

describe("TaskInput", () => {
  test("submits sanitized text and clears input", () => {
    const onSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onSubmit} isProcessing={false} />);

    const ta = screen.getByPlaceholderText(/Enter your task or query/i) as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "  <script>alert(1)</script> Hello\u0000world  " } });

    const btn = screen.getByRole("button", { name: /Dispatch/i });
    fireEvent.click(btn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(expect.stringContaining("Helloworld"));
    // Input should be cleared after submit
    expect(ta.value).toBe("");
    // History indicator should show 1 task
    expect(screen.getByText(/1 task/i)).toBeInTheDocument();
  });

  test("does not submit when isProcessing is true", () => {
    const onSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onSubmit} isProcessing={true} />);

    const ta = screen.getByPlaceholderText(/Enter your task or query/i) as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "Do something" } });

    const btn = screen.getByRole("button", { name: /Processing|Dispatch/i });
    fireEvent.click(btn);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("navigates history with arrow keys", () => {
    const onSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onSubmit} isProcessing={false} />);

    const ta = screen.getByPlaceholderText(/Enter your task or query/i) as HTMLTextAreaElement;
    const btn = screen.getByRole("button", { name: /Dispatch/i });

    fireEvent.change(ta, { target: { value: "first" } });
    fireEvent.click(btn);

    fireEvent.change(ta, { target: { value: "second" } });
    fireEvent.click(btn);

    // Navigate up once -> shows 'second'
    fireEvent.keyDown(ta, { key: "ArrowUp", code: "ArrowUp" });
    expect(ta.value).toBe("second");

    // Navigate up again -> shows 'first'
    fireEvent.keyDown(ta, { key: "ArrowUp", code: "ArrowUp" });
    expect(ta.value).toBe("first");

    // Navigate down -> back to second
    fireEvent.keyDown(ta, { key: "ArrowDown", code: "ArrowDown" });
    expect(ta.value).toBe("second");

    // Navigate down -> to empty
    fireEvent.keyDown(ta, { key: "ArrowDown", code: "ArrowDown" });
    expect(ta.value).toBe("");
  });
});
