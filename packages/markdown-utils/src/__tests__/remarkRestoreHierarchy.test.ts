import type { Root } from "mdast";
import { remarkRestoreHierarchy } from "../remarkRestoreHierarchy";

// ============================================================================
// Helper functions to create mock AST nodes
// ============================================================================

function createText(value: string): any {
  return { type: "text", value };
}

function createParagraph(children: any[]): any {
  return { type: "paragraph", children };
}

function createContainerDirective(name: string, children: any[] = []): any {
  return { type: "containerDirective", name, children, data: {} };
}

function createLeafDirective(name: string, children: any[] = []): any {
  return { type: "leafDirective", name, children, data: {} };
}

function createFence(): any {
  return createParagraph([createText(":::")]);
}

function createRoot(children: any[]): Root {
  return { type: "root", children };
}

// ============================================================================
// Tests
// ============================================================================

describe("remarkRestoreHierarchy", () => {
  const plugin = remarkRestoreHierarchy();

  describe("edge cases", () => {
    it("should handle empty tree", () => {
      const tree = createRoot([]);
      expect(() => plugin(tree)).not.toThrow();
      expect(tree.children).toHaveLength(0);
    });

    it("should handle tree without fences", () => {
      const tree = createRoot([
        createParagraph([createText("Just text")]),
        createContainerDirective("toggle", []),
      ]);
      expect(() => plugin(tree)).not.toThrow();
      expect(tree.children).toHaveLength(2);
    });

    it("should handle tree with only a fence", () => {
      const tree = createRoot([createFence()]);
      expect(() => plugin(tree)).not.toThrow();
      // Fence is removed (no target to nest into)
      expect(tree.children).toHaveLength(0);
    });

    it("should not crash with various node types", () => {
      const tree = createRoot([
        createContainerDirective("toggle", []),
        createContainerDirective("important", []),
        createFence(),
      ]);
      expect(() => plugin(tree)).not.toThrow();
    });
  });

  describe("nesting logic", () => {
    it("should nest content paragraph into preceding container directive", () => {
      // [toggle, paragraph, :::] → [toggle(paragraph)]
      const paragraph = createParagraph([createText("Content inside toggle")]);
      const toggle = createContainerDirective("toggle", []);
      const tree = createRoot([toggle, paragraph, createFence()]);

      plugin(tree);

      expect(tree.children).toHaveLength(1);
      expect(tree.children[0]).toBe(toggle);
      expect(toggle.children).toHaveLength(1);
      expect(toggle.children[0]).toBe(paragraph);
    });

    it("should NOT nest directive into another directive", () => {
      // [good-to-know, toggle, :::] → the fence closes good-to-know, toggle stays as sibling
      // This is the KEY bug fix: prevents toggle from nesting inside good-to-know
      const goodToKnow = createContainerDirective("good-to-know", []);
      const toggle = createContainerDirective("toggle", []);
      const tree = createRoot([goodToKnow, toggle, createFence()]);

      plugin(tree);

      // toggle should NOT be inside good-to-know
      // The fence is removed, but toggle stays as sibling
      expect(
        goodToKnow.children.some(
          (c: any) => c.type === "containerDirective" && c.name === "toggle",
        ),
      ).toBe(false);
    });

    it("should NOT nest leaf directive into container directive", () => {
      const container = createContainerDirective("toggle", []);
      const leaf = createLeafDirective("unknown");
      const tree = createRoot([container, leaf, createFence()]);

      plugin(tree);

      expect(container.children.some((c: any) => c.type === "leafDirective")).toBe(false);
    });

    it("should handle chained nesting (multiple paragraphs)", () => {
      // [toggle, paragraph1, :::, important, paragraph2, :::] → [toggle(paragraph1), important(paragraph2)]
      const p1 = createParagraph([createText("Content 1")]);
      const p2 = createParagraph([createText("Content 2")]);
      const toggle = createContainerDirective("toggle", []);
      const important = createContainerDirective("important", []);

      const tree = createRoot([toggle, p1, createFence(), important, p2, createFence()]);

      plugin(tree);

      expect(toggle.children).toContain(p1);
      expect(important.children).toContain(p2);
    });
  });

  describe("bug fix documentation", () => {
    it("documents the InvalidCharacterError bug (9:00 time notation)", () => {
      /**
       * BUG: InvalidCharacterError when rendering RCO content with time notations
       *
       * REPRODUCTION:
       *   Markdown: "Meeting from 9:00 to 12:00"
       *   remark-directive parsed "9:00" as textDirective name="00"
       *   remarkDirectiveToComponent set hName="00"
       *   React tried to create <00> element → crash
       *
       * FIX:
       *   Added whitelist validation (VALID_DIRECTIVE_NAMES) — now in this package.
       *   Only transform directives in the whitelist.
       *   Convert invalid textDirectives to plain text nodes.
       *
       * FILES:
       *   - packages/markdown-utils/src/constants.ts (whitelist)
       *   - packages/markdown-utils/src/helpers.ts (isValidDirectiveName)
       *   - apps/client/src/lib/markdown/directive-to-component.tsx (uses helpers)
       *   - apps/mobile/src/libs/markdown/remarkDirectiveToHtml.ts (uses helpers)
       */
      expect(true).toBe(true);
    });

    it("documents the hierarchy bug (toggle nested in good-to-know)", () => {
      /**
       * BUG: Toggle directives incorrectly nested inside good-to-know
       *
       * REPRODUCTION:
       *   Markdown: :::good-to-know\nInfo\n:::\n:::toggle{title="T"}\nContent\n:::
       *   Result: toggle appeared INSIDE good-to-know (incorrect)
       *
       * FIX:
       *   remarkRestoreHierarchy only nests CONTENT (paragraphs, lists),
       *   NOT other directives. If elementToMove is a directive, the fence
       *   is treated as closing the target, not as nesting.
       *
       * FILE: packages/markdown-utils/src/remarkRestoreHierarchy.ts
       */
      expect(true).toBe(true);
    });
  });
});
