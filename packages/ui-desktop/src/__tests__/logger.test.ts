/// <reference types="jest" />
import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { logger } from "../logger";

describe("ui-desktop logger", () => {
  const PREFIX = "[COMMAND DECK]";
  let origEnv: string | undefined;

  beforeEach(() => {
    origEnv = process.env.NODE_ENV;
    jest.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = origEnv;
    jest.restoreAllMocks();
  });

  test("info calls console.info with prefix", () => {
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});
    logger.info("hello");
    expect(spy).toHaveBeenCalledWith(PREFIX, "hello");
  });

  test("info supports multiple and non-string args", () => {
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});
    const payload = { x: 1 };
    logger.info("step", payload, 42);
    expect(spy).toHaveBeenCalled();
    const call = spy.mock.calls[0];
    expect(call[0]).toBe(PREFIX);
    expect(call[1]).toBe("step");
    expect(call[2]).toBe(payload);
    expect(call[3]).toBe(42);
  });

  test("debug only logs in non-production", () => {
    process.env.NODE_ENV = "development";
    const spy = jest.spyOn(console, "debug").mockImplementation(() => {});
    logger.debug("d");
    expect(spy).toHaveBeenCalledWith(PREFIX, "d");

    jest.restoreAllMocks();
    process.env.NODE_ENV = "production";
    const spyProd = jest.spyOn(console, "debug").mockImplementation(() => {});
    logger.debug("d");
    expect(spyProd).not.toHaveBeenCalled();
  });
});
