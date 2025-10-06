// packages/synapse-bridge/src/intentParser.ts

/**
 * Represents the result of parsing natural language intent.
 */
export interface ParsedIntent {
  primaryAction:
    | "CREATE"
    | "TEST"
    | "REFACTOR"
    | "DEBUG"
    | "DOCUMENT"
    | "RESEARCH";
  subject: string;
  context: string[];
}

/**
 * Parses natural language intent into structured action data.
 * v1 implementation uses rule-based keyword matching.
 *
 * @param naturalLanguageIntent - The raw user command
 * @returns Parsed intent with primary action classification
 */
export function parseIntent(naturalLanguageIntent: string): ParsedIntent {
  const lowerIntent = naturalLanguageIntent.toLowerCase();
  let primaryAction: ParsedIntent["primaryAction"] = "CREATE";

  // Rule-based keyword matching
  if (
    lowerIntent.includes("test") ||
    lowerIntent.includes("validate") ||
    lowerIntent.includes("verify")
  ) {
    primaryAction = "TEST";
  } else if (
    lowerIntent.includes("refactor") ||
    lowerIntent.includes("clean") ||
    lowerIntent.includes("improve") ||
    lowerIntent.includes("optimize")
  ) {
    primaryAction = "REFACTOR";
  } else if (
    lowerIntent.includes("research") ||
    lowerIntent.includes("find") ||
    lowerIntent.includes("look up") ||
    lowerIntent.includes("is there a better")
  ) {
    primaryAction = "RESEARCH";
  } else if (
    lowerIntent.includes("doc") ||
    lowerIntent.includes("comment") ||
    lowerIntent.includes("explain")
  ) {
    primaryAction = "DOCUMENT";
  } else if (lowerIntent.includes("debug") || lowerIntent.includes("fix")) {
    primaryAction = "DEBUG";
  }

  return {
    primaryAction,
    subject: naturalLanguageIntent,
    context: [],
  };
}
