import { FC, useCallback, useState } from "react";
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
import FocusPlugin from "./plugins/FocusPlugin";
import { cls } from "lib/classname";
import styles from "./RichTextInput.module.scss";

const theme = {
  link: "rtri-link",
  heading: {
    h3: "rtri-title",
  },
  text: {
    underline: "rtri-underline",
    bold: "rtri-bold",
    italic: "rtri-italic",
  },
};

interface Props {
  value: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
}

/**
 * Input for rich text, using Lexical
 */
const RichTextInput: FC<Props> = (props: Props) => {
  const { value, onBlur, onFocus } = props;
  const [hasFocus, setHasFocus] = useState(false);

  const initialConfig = {
    namespace: "RIEditor",
    nodes: [...nodes],
    onError: (error: Error) => {
      throw error;
    },
    theme,
  };

  const onChange = (html: string) => {
    if (props.onChange) {
      if (html === "<p><br></p>") props.onChange(""); // empty input
      else props.onChange(html);
    }
  };

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const onRef = (floatingAnchorElem: HTMLDivElement) => {
    if (floatingAnchorElem !== null) {
      setFloatingAnchorElem(floatingAnchorElem);
    }
  };

  const onBlurCallback = useCallback(() => {
    setHasFocus(false);
    onBlur?.();
  }, [onBlur]);

  const onFocusCallback = useCallback(() => {
    setHasFocus(true);
    onFocus?.();
  }, [onFocus]);

  return (
    <div className={cls(styles.container, hasFocus && styles.focus, props.className)} ref={onRef}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <LexicalAutoLinkPlugin />
        <ListPlugin />
        <LinkPlugin />
        <CalloutPlugin />
        <FocusPlugin onFocus={onFocusCallback} onBlur={onBlurCallback} />
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem || undefined} />
        <RichTextPlugin
          contentEditable={<ContentEditable className={styles.content} />}
          placeholder={<div></div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnHtmlChangePlugin value={value} onHtmlChanged={onChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

export default RichTextInput;
