/**
 * Markdown plugin tests have been moved to @refugies-info/markdown-utils.
 *
 * Run: pnpm --filter @refugies-info/markdown-utils test
 *
 * Tests for:
 * - VALID_DIRECTIVE_NAMES whitelist
 * - Helper functions (isValidDirectiveName, getDirectivePrefix, etc.)
 * - remarkRestoreHierarchy plugin
 *
 * Integration tests remain in:
 * - apps/client/src/components/Content/Dispositif/__tests__/Dispositif.rco.parsing.test.tsx
 */

import { remarkDirectiveToComponent } from "../directive-to-component";

describe("remarkDirectiveToComponent (integration with shared package)", () => {
  it("should export the plugin function", () => {
    expect(typeof remarkDirectiveToComponent).toBe("function");
  });

  it("should return a transformer function", () => {
    const transformer = remarkDirectiveToComponent();
    expect(typeof transformer).toBe("function");
  });

  it("should not crash on empty tree", () => {
    const tree = { type: "root" as const, children: [] };
    expect(() => remarkDirectiveToComponent()(tree)).not.toThrow();
  });
});
