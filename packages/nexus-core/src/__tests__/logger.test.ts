/// <reference types="jest" />
import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { logger } from "../logger";

describe("nexus-core logger", () => {
  const PREFIX = "[NEXUS-CORE]";
  let origEnv: string | undefined;

  beforeEach(() => {
    origEnv = process.env.NODE_ENV;
    jest.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = origEnv;
    jest.restoreAllMocks();
  });

  test("warn calls console.warn with prefix", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("watch out");
    expect(spy).toHaveBeenCalledWith(PREFIX, "watch out");
  });

  test("debug only logs in non-production", () => {
    process.env.NODE_ENV = "test";
    const spy = jest.spyOn(console, "debug").mockImplementation(() => {});
    logger.debug("dbg");
    expect(spy).toHaveBeenCalledWith(PREFIX, "dbg");
  });

  test("info logs multiple args", () => {
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});
    logger.info("a", { b: 1 });
    expect(spy).toHaveBeenCalled();
  });
});
