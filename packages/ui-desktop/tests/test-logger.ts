/**
 * Test-only logger helper. Tests are allowed to use console for debugging, but
 * we centralize test logging here to keep ESLint happy and ensure consistent
 * prefixes for automated test outputs.
 */
export const testLogger = {
  info: (...args: unknown[]) => {
    // Use console directly in tests — tests are allowed to use console.
    // Prefix messages to make them easy to grep in CI artifacts.
    // eslint-disable-next-line no-console
    console.log("[TEST]", ...args);
  },
};

export default testLogger;
