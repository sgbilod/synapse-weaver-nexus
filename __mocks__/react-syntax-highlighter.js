const React = require("react");

module.exports = {
  Prism: ({ children }) =>
    React.createElement("pre", { "data-testid": "syntax" }, children),
  // Provide a default export as well for any default imports
  default: {
    Prism: ({ children }) =>
      React.createElement("pre", { "data-testid": "syntax" }, children),
  },
};
