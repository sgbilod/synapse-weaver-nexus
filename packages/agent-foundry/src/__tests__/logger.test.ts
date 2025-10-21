/// <reference types="jest" />
import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { logger } from "../logger";

describe("agent-foundry logger", () => {
  const PREFIX = "[AGENT-FOUNDRY]";
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
    logger.info("ok");
    expect(spy).toHaveBeenCalledWith(PREFIX, "ok");
  });
  test("debug obeys NODE_ENV", () => {
    process.env.NODE_ENV = "development";
    const spy = jest.spyOn(console, "debug").mockImplementation(() => {});
    logger.debug("dbg");
    expect(spy).toHaveBeenCalledWith(PREFIX, "dbg");
  });
});
