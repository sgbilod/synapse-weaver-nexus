// packages/synapse-bridge/src/intentParser.test.ts
import { parseIntent, ParsedIntent } from "./intentParser";

describe("intentParser", () => {
  describe("TEST action classification", () => {
    it("should classify 'test' keyword as TEST action", () => {
      const result = parseIntent("test this function");
      expect(result.primaryAction).toBe("TEST");
    });

    it("should classify 'validate' keyword as TEST action", () => {
      const result = parseIntent("validate the input");
      expect(result.primaryAction).toBe("TEST");
    });

    it("should classify 'verify' keyword as TEST action", () => {
      const result = parseIntent("verify this works correctly");
      expect(result.primaryAction).toBe("TEST");
    });
  });

  describe("REFACTOR action classification", () => {
    it("should classify 'refactor' keyword as REFACTOR action", () => {
      const result = parseIntent("refactor this function");
      expect(result.primaryAction).toBe("REFACTOR");
    });

    it("should classify 'clean' keyword as REFACTOR action", () => {
      const result = parseIntent("clean up this code");
      expect(result.primaryAction).toBe("REFACTOR");
    });

    it("should classify 'improve' keyword as REFACTOR action", () => {
      const result = parseIntent("improve the performance");
      expect(result.primaryAction).toBe("REFACTOR");
    });

    it("should classify 'optimize' keyword as REFACTOR action", () => {
      const result = parseIntent("optimize this algorithm");
      expect(result.primaryAction).toBe("REFACTOR");
    });
  });

  describe("RESEARCH action classification", () => {
    it("should classify 'research' keyword as RESEARCH action", () => {
      const result = parseIntent("research better approaches");
      expect(result.primaryAction).toBe("RESEARCH");
    });

    it("should classify 'find' keyword as RESEARCH action", () => {
      const result = parseIntent("find a library for this");
      expect(result.primaryAction).toBe("RESEARCH");
    });

    it("should classify 'look up' keyword as RESEARCH action", () => {
      const result = parseIntent("look up best practices");
      expect(result.primaryAction).toBe("RESEARCH");
    });

    it("should classify 'is there a better' keyword as RESEARCH action", () => {
      const result = parseIntent("is there a better way to do this");
      expect(result.primaryAction).toBe("RESEARCH");
    });
  });

  describe("DOCUMENT action classification", () => {
    it("should classify 'doc' keyword as DOCUMENT action", () => {
      const result = parseIntent("doc this function");
      expect(result.primaryAction).toBe("DOCUMENT");
    });

    it("should classify 'comment' keyword as DOCUMENT action", () => {
      const result = parseIntent("comment this code");
      expect(result.primaryAction).toBe("DOCUMENT");
    });

    it("should classify 'explain' keyword as DOCUMENT action", () => {
      const result = parseIntent("explain what this does");
      expect(result.primaryAction).toBe("DOCUMENT");
    });
  });

  describe("DEBUG action classification", () => {
    it("should classify 'debug' keyword as DEBUG action", () => {
      const result = parseIntent("debug this issue");
      expect(result.primaryAction).toBe("DEBUG");
    });

    it("should classify 'fix' keyword as DEBUG action", () => {
      const result = parseIntent("fix the bug");
      expect(result.primaryAction).toBe("DEBUG");
    });
  });

  describe("CREATE action classification (default)", () => {
    it("should classify unknown intent as CREATE action", () => {
      const result = parseIntent("create a new component");
      expect(result.primaryAction).toBe("CREATE");
    });

    it("should default to CREATE for non-matching keywords", () => {
      const result = parseIntent("build something amazing");
      expect(result.primaryAction).toBe("CREATE");
    });
  });

  describe("ParsedIntent structure", () => {
    it("should return a complete ParsedIntent object", () => {
      const result = parseIntent("test this function thoroughly");

      expect(result).toHaveProperty("primaryAction");
      expect(result).toHaveProperty("subject");
      expect(result).toHaveProperty("context");
      expect(Array.isArray(result.context)).toBe(true);
    });

    it("should extract subject from intent string", () => {
      const result = parseIntent("refactor the authentication module");

      expect(result.subject).toContain("authentication");
    });

    it("should handle case-insensitive keyword matching", () => {
      const resultLower = parseIntent("test this");
      const resultUpper = parseIntent("TEST this");
      const resultMixed = parseIntent("TeSt this");

      expect(resultLower.primaryAction).toBe("TEST");
      expect(resultUpper.primaryAction).toBe("TEST");
      expect(resultMixed.primaryAction).toBe("TEST");
    });
  });
});
