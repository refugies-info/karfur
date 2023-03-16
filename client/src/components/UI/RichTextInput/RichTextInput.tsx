import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import ToolbarPlugin from "./ToolbarPlugin";
import nodes from "./nodes";
import LexicalAutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import OnHtmlChangePlugin from "./plugins/OnHtmlChangePlugin";
import CalloutPlugin from "./plugins/CalloutPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import styles from "./RichTextInput.module.scss";

const theme = {
  link: styles.link,
  heading: {
    h3: styles.title,
  },
  text: {
    underline: styles.underline,
    bold: styles.bold,
    italic: styles.italic,
  },
};

interface Props {
  value: string;
  id: string;
}

/**
 * Input for rich text, using Lexical
 */
const RichTextInput: FC<Props> = (props: Props) => {
  const { setValue } = useFormContext();

  const initialConfig = {
    namespace: "RIEditor",
    nodes: [...nodes],
    onError: (error: Error) => {
      throw error;
    },
    theme,
  };

  const onChange = (html: string) => {
    if (setValue) setValue(props.id, html);
  };

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const onRef = (floatingAnchorElem: HTMLDivElement) => {
    if (floatingAnchorElem !== null) {
      setFloatingAnchorElem(floatingAnchorElem);
    }
  };

  return (
    <div className={styles.container} ref={onRef}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <LexicalAutoLinkPlugin />
        <ListPlugin />
        <LinkPlugin />
        <CalloutPlugin />
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem || undefined} />
        <RichTextPlugin
          contentEditable={<ContentEditable className={styles.content} />}
          placeholder={<div></div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnHtmlChangePlugin value={props.value} onHtmlChanged={onChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

export default RichTextInput;
