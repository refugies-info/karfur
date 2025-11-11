import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import Button from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import useUser from "~/hooks/useUser";
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
 * Input for rich text, using Lexical + Source Mode toggle
 */
const RichTextInput: FC<Props> = (props: Props) => {
  const { value, onBlur, onFocus } = props;
  const { user } = useUser();
  const [hasFocus, setHasFocus] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceText, setSourceText] = useState(value || ""); // Always stores minified HTML
  const sourceEditRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [displayText, setDisplayText] = useState(""); // Formatted HTML for display only

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

  const onChange = (html: string) => {
    const newHtml = html === "<p><br></p>" ? "" : html;
    setSourceText(newHtml);
    if (props.onChange) {
      props.onChange(newHtml);
    }
  };

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const onRef = (floatingAnchorElem: HTMLDivElement) => {
    if (floatingAnchorElem !== null) setFloatingAnchorElem(floatingAnchorElem);
  };

  const onBlurCallback = useCallback(() => {
    setHasFocus(false);
    onBlur?.();
  }, [onBlur]);

  const onFocusCallback = useCallback(() => {
    setHasFocus(true);
    onFocus?.();
  }, [onFocus]);

  // Format HTML with proper indentation
  const formatHtml = (html: string): string => {
    if (!html) return "";

    let formatted = "";
    let indent = 0;
    const tab = "  "; // 2 spaces

    // Remove extra whitespace between tags
    html = html.replace(/>\s+</g, "><");

    // Split by tags
    const tokens = html.split(/(<[^>]+>)/g).filter((token) => token.trim());

    tokens.forEach((token) => {
      if (token.match(/^<\/\w/)) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + token + "\n";
      } else if (token.match(/^<\w[^>]*[^\/]>$/)) {
        // Opening tag (not self-closing)
        formatted += tab.repeat(indent) + token + "\n";
        indent++;
      } else if (token.match(/^<\w[^>]*\/>$/)) {
        // Self-closing tag
        formatted += tab.repeat(indent) + token + "\n";
      } else {
        // Text content
        const text = token.trim();
        if (text) {
          formatted += tab.repeat(indent) + text + "\n";
        }
      }
    });

    return formatted.trim();
  };

  // Syntax highlight the code
  const highlightCode = (code: string) => {
    try {
      return Prism.highlight(code, Prism.languages.markup, "markup");
    } catch (e) {
      return code;
    }
  };

  const toggleSourceMode = () => {
    if (isSourceMode) {
      // Source → Rich: Get current text and minify it completely
      const content = sourceEditRef.current?.textContent || "";
      // Remove ALL formatting whitespace: between tags, multiple spaces, newlines
      const minified = content
        .replace(/>\s+</g, "><") // Remove whitespace between tags
        .replace(/\s+/g, " ") // Collapse multiple whitespace to single space
        .trim(); // Remove leading/trailing whitespace

      setSourceText(minified);
      props.onChange?.(minified);
    }
    setIsSourceMode(!isSourceMode);
  };

  const handleSourceInput = () => {
    const content = sourceEditRef.current?.textContent || "";
    // Always store minified version
    const minified = content.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
    setDisplayText(content); // Keep formatted version for display
    setHighlightedCode(highlightCode(content));
  };

  // Update syntax highlighting and display when switching to source mode
  useEffect(() => {
    if (isSourceMode && sourceEditRef.current) {
      const formatted = formatHtml(sourceText);
      setDisplayText(formatted);
      setHighlightedCode(highlightCode(formatted));
      // Only set textContent when switching to source mode
      sourceEditRef.current.textContent = formatted;
    }
  }, [isSourceMode]);

  const handleSourceKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();

    if (e.key === "Enter") {
      e.preventDefault();
      // Insert a newline character at cursor position
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        // Calculate indentation of current line
        const textBeforeCursor = sourceEditRef.current?.textContent?.substring(0, range.startOffset) || "";
        const currentLineStart = textBeforeCursor.lastIndexOf("\n") + 1;
        const currentLine = textBeforeCursor.substring(currentLineStart);
        const indentMatch = currentLine.match(/^(\s+)/);
        const currentIndent = indentMatch ? indentMatch[1] : "";

        // Insert newline + same indentation
        const textNode = document.createTextNode("\n" + currentIndent);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      handleSourceInput();
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Insert 2 spaces for indentation
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        if (e.shiftKey) {
          // Shift+Tab: Remove indentation (unindent)
          const textBeforeCursor = sourceEditRef.current?.textContent?.substring(0, range.startOffset) || "";
          const currentLineStart = textBeforeCursor.lastIndexOf("\n") + 1;
          const lineStartOffset = currentLineStart;

          // Check if there are spaces at the start of the line to remove
          const fullText = sourceEditRef.current?.textContent || "";
          const afterLineStart = fullText.substring(lineStartOffset);
          const spacesToRemove = afterLineStart.match(/^  /); // Match 2 spaces

          if (spacesToRemove) {
            const removeRange = document.createRange();
            const textNode = sourceEditRef.current?.firstChild;
            if (textNode) {
              removeRange.setStart(textNode, lineStartOffset);
              removeRange.setEnd(textNode, lineStartOffset + 2);
              removeRange.deleteContents();

              // Adjust cursor position
              range.setStart(textNode, Math.max(0, range.startOffset - 2));
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        } else {
          // Tab: Add indentation
          range.deleteContents();
          const textNode = document.createTextNode("  "); // 2 spaces
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      handleSourceInput();
    }
  };

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
        <div className="prose relative z-10 max-h-[600px] min-h-[300px] w-full max-w-none overflow-auto rounded-md bg-[#1e1e2e]">
          {/* Syntax highlighted background layer */}
          <pre className="pointer-events-none absolute inset-0 m-0 overflow-visible rounded-none border-0 bg-transparent p-6 font-mono text-sm leading-relaxed tracking-normal break-words whitespace-pre-wrap">
            <code
              className="language-markup m-0 bg-transparent p-0"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
          {/* Editable layer with transparent text */}
          <div
            ref={sourceEditRef}
            className={cn(
              styles.sourceArea,
              "relative m-0 min-h-[300px] w-full border-0 bg-transparent p-6 font-mono text-sm leading-relaxed tracking-normal break-words whitespace-pre-wrap text-transparent caret-cyan-400 outline-none",
            )}
            contentEditable
            onInput={handleSourceInput}
            onKeyDown={handleSourceKeyDown}
            spellCheck={false}
            suppressContentEditableWarning
          />
        </div>
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
          <OnHtmlChangePlugin value={sourceText} onHtmlChanged={onChange} />
          <HistoryPlugin />
        </LexicalComposer>
      )}
    </div>
  );
};

export default RichTextInput;
