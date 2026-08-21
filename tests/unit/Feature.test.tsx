import { describe, it, expect } from "vitest";
import { validPact } from "../../src/Feature";
describe("pact validation", () => {
  it("requires a bounded clear commitment", () => {
    expect(validPact("go")).toBe(false);
    expect(validPact("finish draft")).toBe(true);
    expect(validPact("   ")).toBe(false);
    expect(validPact("x".repeat(161))).toBe(false);
  });
});
