import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $insertList, $isListNode, ListItemNode, ListNode } from "@lexical/list";
import {
  $getRoot,
  $isElementNode,
  $isParagraphNode,
  createEditor,
  type LexicalEditor,
} from "lexical";

import { $isCalloutNode, CalloutNode } from "../CalloutNode";

const createTestEditor = (html: string): LexicalEditor => {
  const editor = createEditor({
    nodes: [CalloutNode, ListNode, ListItemNode],
    onError: (error) => {
      throw error;
    },
  });
  editor.update(
    () => {
      const dom = new DOMParser().parseFromString(html, "text/html");
      $getRoot().append(...$generateNodesFromDOM(editor, dom));
    },
    { discrete: true },
  );
  return editor;
};

const legacyCallout =
  '<div class="callout callout--info" data-callout="info"><span>Texte</span></div>';

describe("CalloutNode", () => {
  it("wraps the inline content of an existing callout in a paragraph", () => {
    const editor = createTestEditor(legacyCallout);
    editor.getEditorState().read(() => {
      const callout = $getRoot().getFirstChild();
      expect($isCalloutNode(callout)).toBe(true);
      const paragraph = $isElementNode(callout) ? callout.getFirstChild() : null;
      expect($isParagraphNode(paragraph)).toBe(true);
      expect(paragraph?.getTextContent()).toBe("Texte");
    });
  });

  it("creates a bullet list inside the callout instead of replacing it", () => {
    const editor = createTestEditor(legacyCallout);
    editor.update(
      () => {
        $getRoot().getFirstDescendant()?.selectStart();
        $insertList("bullet");
      },
      { discrete: true },
    );
    editor.getEditorState().read(() => {
      const callout = $getRoot().getFirstChild();
      expect($isCalloutNode(callout)).toBe(true);
      expect($isListNode($isElementNode(callout) ? callout.getFirstChild() : null)).toBe(true);
      const html = $generateHtmlFromNodes(editor, null);
      expect(html).toMatch(
        /<div[^>]*data-callout="info"[^>]*><ul[^>]*><li[^>]*>.*Texte.*<\/li><\/ul><\/div>/,
      );
    });
  });
});
