import { $generateNodesFromDOM } from "@lexical/html";
import { HeadingNode } from "@lexical/rich-text";
import { $getRoot, $isElementNode, createEditor, type LexicalEditor } from "lexical";

import { registerTitleLevelTransform } from "../index";

const createTestEditor = (html: string): LexicalEditor => {
  const editor = createEditor({
    nodes: [HeadingNode],
    onError: (error) => {
      throw error;
    },
  });
  registerTitleLevelTransform(editor);
  editor.update(
    () => {
      const dom = new DOMParser().parseFromString(html, "text/html");
      $getRoot().append(...$generateNodesFromDOM(editor, dom));
    },
    { discrete: true },
  );
  return editor;
};

const readBlocks = (editor: LexicalEditor) =>
  editor.getEditorState().read(() =>
    $getRoot()
      .getChildren()
      .map((node) => ({
        type: node.getType(),
        tag: node.getType() === "heading" ? (node as HeadingNode).getTag() : undefined,
        text: node.getTextContent(),
        children: $isElementNode(node) ? node.getChildrenSize() : 0,
      })),
  );

describe("TitleLevelPlugin", () => {
  it("turns the titles saved as h3, and the other levels, into h4 without losing their text", () => {
    const editor = createTestEditor(
      '<h3 class="rtri-title">Ancien titre</h3><h2>Autre niveau</h2><h4>Déjà un h4</h4><p>Texte</p>',
    );

    expect(readBlocks(editor)).toEqual([
      { type: "heading", tag: "h4", text: "Ancien titre", children: 1 },
      { type: "heading", tag: "h4", text: "Autre niveau", children: 1 },
      { type: "heading", tag: "h4", text: "Déjà un h4", children: 1 },
      { type: "paragraph", tag: undefined, text: "Texte", children: 1 },
    ]);
  });
});
