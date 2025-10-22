/// <reference types="jest" />
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

describe("TaskInput rate limiting (production path)", () => {
  const OLD_ENV = process.env;
  afterEach(() => {
    process.env = OLD_ENV;
  });

  test("prevents rapid duplicate submissions in production", () => {
    // Simulate production path where the component enables rate-limiting
    process.env = { ...OLD_ENV, NODE_ENV: "production" };

    // Import normally; TaskInput reads NODE_ENV at render time
    const { TaskInput } = require("../renderer/components/TaskInput");

    const onSubmit = jest.fn();
    render(<TaskInput onTaskSubmit={onSubmit} isProcessing={false} />);

    const input = screen.getByPlaceholderText(
      /Enter your task or query/i
    ) as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /dispatch/i });

    fireEvent.change(input, { target: { value: "do-something" } });
    // two rapid clicks should only result in one submit when rate-limited
    fireEvent.click(button);
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
