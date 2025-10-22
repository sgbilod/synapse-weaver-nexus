/// <reference types="jest" />
import { describe, test, expect } from "@jest/globals";
import {
  removeControlChars,
  stripAnsiEscapeSequences,
  cleanOutput,
} from "../renderer/utils/textUtils";

describe("textUtils", () => {
  test("removeControlChars removes NUL and other control characters", () => {
    const input = "ab\u0000cd\u0007ef";
    const out = removeControlChars(input);
    expect(out).toBe("abcdef");
  });

  test("stripAnsiEscapeSequences removes common CSI sequences", () => {
    const input = "Hello\x1b[31mRED\x1b[0mWorld";
    expect(stripAnsiEscapeSequences(input)).toBe("HelloREDWorld");
  });

  test("cleanOutput composes both filters", () => {
    const input = "\x1b[31mA\u0000B\x1b[0m";
    expect(cleanOutput(input)).toBe("AB");
  });

  test("removeControlChars handles empty string", () => {
    expect(removeControlChars("")).toBe("");
  });

  test("removeControlChars handles only control chars", () => {
    expect(removeControlChars("\u0000\u0007\u0008")).toBe("");
  });

  test("stripAnsiEscapeSequences handles only ANSI", () => {
    expect(stripAnsiEscapeSequences("\x1b[31m\x1b[0m")).toBe("");
  });

  test("cleanOutput handles mixed input", () => {
    expect(cleanOutput("\u0000\x1b[31mX\x1b[0m\u0007")).toBe("X");
  });
});
