import { useState, useEffect } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $createParagraphNode, $getRoot, EditorState, LexicalEditor } from "lexical";

interface Props {
  value?: string;
  onHtmlChanged: (html: string) => void;
}

const generateInitialState = (editor: LexicalEditor, value: string) => {
  const root = $getRoot();
  const parser = new DOMParser();
  const dom = parser.parseFromString(value, "text/html");
  const nodes = $generateNodesFromDOM(editor, dom);

  const newNodes = nodes.map((node) => {
    const nodeType = node.getType();
    if (nodeType === "text" || nodeType === "linebreak") {
      const paragraph = $createParagraphNode();
      paragraph.append(node);
      return paragraph;
    }
    return node;
  });
  root.clear(); // fix for generate called twice
  root.append(...newNodes);
};

// Fix for parsing list on initial render
// https://stackoverflow.com/questions/73079026/how-we-can-get-html-from-editorstate-in-lexical-rich-editor/75080913#75080913
const OnHtmlChangePlugin = ({ value, onHtmlChanged }: Props) => {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (!value || !isFirstRender) return;
    setIsFirstRender(false);
    editor.update(() => generateInitialState(editor, value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onHtmlChanged(htmlString);
    });
  };

  return <OnChangePlugin onChange={onChange} ignoreHistoryMergeTagChange={true} ignoreSelectionChange={true} />;
};

export default OnHtmlChangePlugin;
