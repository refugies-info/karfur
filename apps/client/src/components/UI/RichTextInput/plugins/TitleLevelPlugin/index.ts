import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import type { LexicalEditor } from "lexical";
import { useEffect } from "react";

export const TITLE_TAG = "h4";

/**
 * Every title of the editor is an h4: the titles saved before were h3, and pasted
 * content can bring other levels. The children of the title are kept.
 */
export const registerTitleLevelTransform = (editor: LexicalEditor) =>
  editor.registerNodeTransform(HeadingNode, (node) => {
    if (node.getTag() !== TITLE_TAG) {
      node.replace($createHeadingNode(TITLE_TAG), true);
    }
  });

const TitleLevelPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => registerTitleLevelTransform(editor), [editor]);

  return null;
};

export default TitleLevelPlugin;
