import Prism from "prismjs";
import "prismjs/components/prism-markup";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@refugies-info/ui";

interface SourceEditorProps {
  value: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

interface CursorState {
  charOffset: number; // Character offset from start of content
}

/**
 * SourceEditor Component
 *
 * A self-contained editor for viewing and editing HTML source code with syntax highlighting.
 * Handles all state management, formatting, syntax highlighting, and keyboard interactions
 * specific to source editing mode.
 *
 * Features:
 * - Syntax highlighting with Prism.js
 * - HTML formatting with proper indentation
 * - Smart indentation on Enter key
 * - Tab/Shift+Tab for indentation control
 * - Minified HTML storage with formatted display
 * - Robust cursor position preservation during editing (scroll-aware)
 */
/**
 * Memoized highlight overlay component to prevent unnecessary re-renders
 * that interfere with cursor position tracking in the editable layer
 */
const HighlightOverlay = React.memo(({ highlightedCode }: { highlightedCode: string }) => (
  <pre className="pointer-events-none absolute inset-0 m-0 overflow-visible rounded-none border-0 bg-transparent p-6 font-mono text-sm leading-relaxed tracking-normal break-words whitespace-pre-wrap">
    <code className="m-0 bg-transparent p-0" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
  </pre>
));

HighlightOverlay.displayName = "HighlightOverlay";

const SourceEditor: FC<SourceEditorProps> = ({ value, onChange, onBlur, onFocus }) => {
  const sourceEditRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState("");
  const isInitializedRef = useRef(false);
  const lastValueRef = useRef(value);
  const cursorStateRef = useRef<CursorState>({ charOffset: 0 });
  const isUserEditingRef = useRef(false);

  /**
   * Format HTML with proper indentation
   * Converts minified HTML into readable format with 2-space indentation
   */
  const formatHtml = useCallback((html: string): string => {
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
  }, []);

  /**
   * Syntax highlight the code using Prism.js
   * Memoized to prevent unnecessary re-renders
   */
  const highlightCodeMemo = useCallback((code: string): string => {
    try {
      return Prism.highlight(code, Prism.languages.markup, "markup");
    } catch (e) {
      return code;
    }
  }, []);

  /**
   * Calculate character offset from start of content to cursor position
   */
  const getCharOffsetFromStart = useCallback((range: Range): number => {
    if (!sourceEditRef.current) return 0;

    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(sourceEditRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }, []);

  /**
   * Set cursor position from character offset
   * Traverses DOM tree to find the exact node and offset
   */
  const setCursorFromCharOffset = useCallback((charOffset: number): boolean => {
    if (!sourceEditRef.current) return false;

    const selection = window.getSelection();
    if (!selection) return false;

    let currentOffset = 0;
    let found = false;

    const traverse = (node: Node): boolean => {
      if (found) return true;

      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (currentOffset + textLength >= charOffset) {
          const range = document.createRange();
          const offsetInNode = Math.min(charOffset - currentOffset, textLength);
          range.setStart(node, offsetInNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          found = true;
          return true;
        }
        currentOffset += textLength;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (traverse(node.childNodes[i])) return true;
        }
      }
      return false;
    };

    traverse(sourceEditRef.current);

    // If not found (charOffset > content length), place cursor at end
    if (!found && sourceEditRef.current.lastChild) {
      const lastNode = sourceEditRef.current.lastChild;
      if (lastNode.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.setStart(lastNode, lastNode.textContent?.length || 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        found = true;
      }
    }

    return found;
  }, []);

  const saveCursorPosition = useCallback(() => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      try {
        const range = selection.getRangeAt(0);
        const charOffset = getCharOffsetFromStart(range);
        cursorStateRef.current = { charOffset };
      } catch (e) {
        cursorStateRef.current = { charOffset: 0 };
      }
    }
  }, [getCharOffsetFromStart]);

  /**
   * Restore cursor position after DOM updates
   */
  const restoreCursorPosition = useCallback(() => {
    const { charOffset } = cursorStateRef.current;

    if (charOffset === undefined || !sourceEditRef.current) {
      return;
    }

    setCursorFromCharOffset(charOffset);
  }, [setCursorFromCharOffset]);

  /**
   * Update syntax highlighting immediately
   */
  const updateHighlight = useCallback(
    (content: string) => {
      setHighlightedCode(highlightCodeMemo(content));
    },
    [highlightCodeMemo],
  );

  /**
   * Initialize editor with formatted content on mount
   * Only runs once to avoid cursor jumping
   */
  useEffect(() => {
    if (!isInitializedRef.current) {
      const formatted = formatHtml(value || "");
      if (sourceEditRef.current) {
        sourceEditRef.current.textContent = formatted;
      }
      setHighlightedCode(highlightCodeMemo(formatted));
      lastValueRef.current = value;
      isInitializedRef.current = true;
    }
  }, [value, formatHtml, highlightCodeMemo]);

  /**
   * Handle external value changes (from parent component)
   * Only update if value actually changed and user is not currently editing
   */
  useEffect(() => {
    if (value !== lastValueRef.current && !isUserEditingRef.current) {
      saveCursorPosition();
      const formatted = formatHtml(value || "");
      if (sourceEditRef.current) {
        sourceEditRef.current.textContent = formatted;
      }
      setHighlightedCode(highlightCodeMemo(formatted));
      lastValueRef.current = value;

      // Restore cursor after DOM update
      requestAnimationFrame(() => {
        restoreCursorPosition();
      });
    }
  }, [value, formatHtml, highlightCodeMemo, saveCursorPosition, restoreCursorPosition]);

  /**
   * Handle input changes in the source editor
   * Maintains minified version internally while displaying formatted version
   * Browser naturally maintains cursor position since we only update the overlay
   */
  const handleSourceInput = useCallback(() => {
    isUserEditingRef.current = true;

    const content = sourceEditRef.current?.textContent || "";
    // Always store minified version
    const minified = content.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
    onChange?.(minified);

    // Update highlight immediately - cursor stays in editable div naturally
    updateHighlight(content);
  }, [onChange, updateHighlight]);

  /**
   * Handle keyboard events in the source editor
   * Supports:
   * - Enter: Insert newline with automatic indentation
   * - Tab: Add 2-space indentation
   * - Shift+Tab: Remove 2-space indentation
   */
  const handleSourceKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
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
    },
    [handleSourceInput],
  );

  const handleFocus = useCallback(() => {
    isUserEditingRef.current = true;
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    isUserEditingRef.current = false;
    onBlur?.();
  }, [onBlur]);

  return (
    <div className="prose relative z-10 w-full max-w-none rounded-md bg-[#1e1e2e]">
      {/* Syntax highlighted background layer - memoized to prevent cursor interference */}
      <HighlightOverlay highlightedCode={highlightedCode} />
      {/* Editable layer with transparent text */}
      <div
        ref={sourceEditRef}
        className={cn(
          "relative m-0 w-full border-0 bg-transparent p-6 font-mono text-sm leading-relaxed tracking-normal break-words whitespace-pre-wrap text-transparent caret-cyan-400 outline-none",
        )}
        contentEditable
        onInput={handleSourceInput}
        onKeyDown={handleSourceKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        spellCheck={false}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default SourceEditor;
