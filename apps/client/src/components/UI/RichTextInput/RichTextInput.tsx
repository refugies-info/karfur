import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { FC, useCallback, useState } from "react";

import { cls } from "@/lib/classname";
import styles from "./RichTextInput.module.scss";
import ToolbarPlugin from "./ToolbarPlugin";
import nodes from "./nodes";
import LexicalAutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CalloutPlugin from "./plugins/CalloutPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FocusPlugin from "./plugins/FocusPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import OnHtmlChangePlugin from "./plugins/OnHtmlChangePlugin";

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
  placeholder?: string;
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
      if (html === "<p><br></p>")
        props.onChange(""); // empty input
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
        <TabIndentationPlugin />
        <LinkPlugin />
        <CalloutPlugin />
        <FocusPlugin onFocus={onFocusCallback} onBlur={onBlurCallback} />
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem || undefined} />
        <RichTextPlugin
          contentEditable={<ContentEditable className={styles.content} />}
          placeholder={!value ? <div className={styles.placeholder}>{props.placeholder}</div> : null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnHtmlChangePlugin value={value} onHtmlChanged={onChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

export default RichTextInput;
