/// <reference types="jest" />
import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { logger } from "../logger";

describe("synapse-bridge logger", () => {
  const PREFIX = "[SYNAPSE-BRIDGE]";
  let origEnv: string | undefined;

  beforeEach(() => {
    origEnv = process.env.NODE_ENV;
    jest.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = origEnv;
    jest.restoreAllMocks();
  });

  test("error calls console.error with prefix", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    logger.error("boom");
    expect(spy).toHaveBeenCalledWith(PREFIX, "boom");
  });
  test("warn and info are callable", () => {
    const si = jest.spyOn(console, "info").mockImplementation(() => {});
    const sw = jest.spyOn(console, "warn").mockImplementation(() => {});
    logger.info("i");
    logger.warn("w");
    expect(si).toHaveBeenCalled();
    expect(sw).toHaveBeenCalled();
  });
});
