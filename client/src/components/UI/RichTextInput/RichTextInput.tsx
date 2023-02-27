import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import ToolbarPlugin from "./ToolbarPlugin";
import nodes from "./nodes";
import styles from "./RichTextInput.module.scss";
import LexicalAutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import OnHtmlChangePlugin from "./plugins/OnHtmlChangePlugin";
import CalloutPlugin from "./plugins/CalloutPlugin";

const theme = {};

interface Props {
  value: string;
  id: string;
}

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

  return (
    <div className={styles.container}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <LexicalAutoLinkPlugin />
        <ListPlugin />
        <LinkPlugin />
        <CalloutPlugin />
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
