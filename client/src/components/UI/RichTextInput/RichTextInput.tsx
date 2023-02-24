import { FC } from "react";
import { $createParagraphNode, $getRoot, EditorState, LexicalEditor } from "lexical";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import ToolbarPlugin from "./ToolbarPlugin";
import nodes from "./nodes";
import styles from "./RichTextInput.module.scss";
import LexicalAutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import { useFormContext } from "react-hook-form";

const theme = {};

interface Props {
  value: string;
  id: string;
}

const RichTextInput: FC<Props> = (props: Props) => {
  const { setValue } = useFormContext();

  const generateInitialState = (editor: LexicalEditor) => {
    const root = $getRoot();
    if (root.getFirstChild() === null) {
      const parser = new DOMParser();
      const dom = parser.parseFromString(props.value, "text/html");
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

      root.append(...newNodes);
    }
  };

  const initialConfig = {
    editorState: generateInitialState,
    namespace: "RIEditor",
    nodes: [...nodes],
    onError: (error: Error) => {
      throw error;
    },
    theme,
  };

  const onChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      if (setValue) setValue(props.id, htmlString);
    });
  };

  return (
    <div className={styles.container}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <LexicalAutoLinkPlugin />
        <ListPlugin />
        <LinkPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className={styles.content} />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} ignoreHistoryMergeTagChange={true} ignoreSelectionChange={true} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

export default RichTextInput;
