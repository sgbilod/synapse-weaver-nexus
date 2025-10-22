/**
 * Lightweight logger abstraction for nexus-core package.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const PREFIX = "[NEXUS-CORE]";

function formatArgs(args: unknown[]): unknown[] {
  return args.map((a) => (typeof a === "string" ? a : a));
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(PREFIX, ...formatArgs(args));
    }
  },
  info: (...args: unknown[]) => {
    console.info(PREFIX, ...formatArgs(args));
  },
  warn: (...args: unknown[]) => {
    console.warn(PREFIX, ...formatArgs(args));
  },
  error: (...args: unknown[]) => {
    console.error(PREFIX, ...formatArgs(args));
  },
};

export default logger;
