import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { FC, useCallback, useEffect, useState } from "react";
import { sanitizeContent } from "~/lib/sanitizeContent";

import Button from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import useUser from "~/hooks/useUser";
import styles from "./RichTextInput.module.scss";
import SourceEditor from "./SourceEditor";
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
 * RichTextInput Component
 *
 * A high-level orchestrator component that provides dual editing modes:
 * - Visual Mode: Lexical-based rich text editor with formatting toolbar
 * - Source Mode: HTML source code editor with syntax highlighting (admin only)
 *
 * The component manages mode switching and delegates rendering to specialized
 * sub-components (Lexical editor or SourceEditor) based on the current mode.
 */
const RichTextInput: FC<Props> = (props: Props) => {
  const { value, onBlur, onFocus } = props;
  const { user } = useUser();
  const [hasFocus, setHasFocus] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceText, setSourceText] = useState(value || ""); // Always stores minified HTML
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  // Keep sourceText in sync with value when not in source mode
  useEffect(() => {
    if (!isSourceMode) {
      setSourceText(value || "");
    }
  }, [value, isSourceMode]);

  const initialConfig = {
    namespace: "RIEditor",
    nodes: [...nodes],
    editable: !isSourceMode,
    onError: (error: Error) => {
      throw error;
    },
    theme,
  };

  /**
   * Handle changes from the Lexical editor
   */
  const handleLexicalChange = useCallback(
    (html: string) => {
      const newHtml = html === "<p><br></p>" ? "" : html;
      setSourceText(newHtml);
      if (props.onChange) {
        props.onChange(newHtml);
      }
    },
    [props],
  );

  /**
   * Handle changes from the SourceEditor
   */
  const handleSourceChange = useCallback(
    (html: string) => {
      const sanitizedHtml = sanitizeContent(html);
      setSourceText(sanitizedHtml);
      if (props.onChange) {
        props.onChange(sanitizedHtml);
      }
    },
    [props],
  );

  const onRef = useCallback((floatingAnchorElem: HTMLDivElement) => {
    if (floatingAnchorElem !== null) setFloatingAnchorElem(floatingAnchorElem);
  }, []);

  const onBlurCallback = useCallback(() => {
    setHasFocus(false);
    onBlur?.();
  }, [onBlur]);

  const onFocusCallback = useCallback(() => {
    setHasFocus(true);
    onFocus?.();
  }, [onFocus]);

  /**
   * Toggle between visual and source editing modes
   * When switching from source to visual, minifies the HTML
   */
  const toggleSourceMode = useCallback(() => {
    setIsSourceMode((prevMode) => !prevMode);
  }, []);

  // Check if user is admin
  const isAdmin = user?.admin ?? false;

  return (
    <div className={cn("relative", styles.container, hasFocus && styles.focus, props.className)} ref={onRef}>
      {isAdmin && (
        <Button
          onClick={toggleSourceMode}
          className="absolute top-1 right-px z-0 translate-x-full"
          iconId={isSourceMode ? "fr-icon-file-text-fill" : "fr-icon-code-box-fill"}
          priority={!isSourceMode ? "primary" : "tertiary"}
          size="small"
          title={isSourceMode ? "Mode visuel" : "Mode source"}
          type="button"
        />
      )}

      {isAdmin && isSourceMode ? (
        <SourceEditor
          value={sourceText}
          onChange={handleSourceChange}
          onFocus={onFocusCallback}
          onBlur={onBlurCallback}
        />
      ) : (
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
            placeholder={!sourceText ? <div className={styles.placeholder}>{props.placeholder}</div> : null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnHtmlChangePlugin value={sourceText} onHtmlChanged={handleLexicalChange} />
          <HistoryPlugin />
        </LexicalComposer>
      )}
    </div>
  );
};

export default RichTextInput;
