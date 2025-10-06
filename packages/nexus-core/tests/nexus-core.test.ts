import { registerDirective } from "../src";

describe("nexus-core::registerDirective", () => {
  it("returns a copy of the directive", () => {
    const directive = {
      id: "alpha",
      description: "test directive",
      priority: 1,
    };
    const result = registerDirective(directive);

    expect(result).toEqual(directive);
    expect(result).not.toBe(directive);
  });
});
