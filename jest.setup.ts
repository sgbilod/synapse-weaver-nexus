// Jest setup: extend expect with jest-dom matchers
import "@testing-library/jest-dom";

// Additional global test setup can be added here in future (mocks, timers, etc.)
// Polyfill scrollIntoView which isn't implemented in JSDOM
if (
  typeof window !== "undefined" &&
  typeof window.HTMLElement !== "undefined"
) {
  // @ts-ignore
  if (!window.HTMLElement.prototype.scrollIntoView) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    window.HTMLElement.prototype.scrollIntoView = function () {};
  }
}
