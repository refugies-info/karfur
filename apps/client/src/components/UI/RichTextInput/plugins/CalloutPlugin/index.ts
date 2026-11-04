import { $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $findMatchingParent,
  $insertNodeToNearestRoot,
  $unwrapNode,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DELETE_CHARACTER_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  type LexicalNode,
  type RangeSelection,
} from "lexical";
import { useEffect } from "react";

import { $createCalloutNode, $isCalloutNode, type CalloutLevel, CalloutNode } from "./CalloutNode";

const INSERT_CALLOUT_COMMAND = createCommand<CalloutLevel>();
const REMOVE_CALLOUT_COMMAND = createCommand();

export { $isCalloutNode, INSERT_CALLOUT_COMMAND, REMOVE_CALLOUT_COMMAND };

const $getParentCallout = (selection: RangeSelection): CalloutNode | null =>
  $findMatchingParent(selection.anchor.getNode(), $isCalloutNode) as CalloutNode | null;

/** Selected root-level blocks, stopping at an existing callout to keep the document order. */
const $getSelectedRootBlocks = (selection: RangeSelection): LexicalNode[] => {
  const root = $getRoot();
  const blocks = new Set<LexicalNode>();
  for (const node of selection.getNodes()) {
    const block = node === root ? null : $findMatchingParent(node, (n) => n.getParent() === root);
    if (!block) continue;
    if ($isCalloutNode(block)) break;
    blocks.add(block);
  }
  return [...blocks];
};

const $isCaretAtCalloutStart = (selection: RangeSelection, callout: CalloutNode): boolean => {
  if (!selection.isCollapsed() || selection.anchor.offset !== 0) return false;
  const anchorNode = selection.anchor.getNode();
  const firstBlock = callout.getFirstChild();
  return (
    $isElementNode(firstBlock) &&
    (anchorNode === firstBlock || anchorNode === firstBlock.getFirstDescendant())
  );
};

export default function CalloutPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([CalloutNode])) {
      throw new Error("CalloutPlugin: CalloutNode not registered on editor");
    }

    return mergeRegister(
      // Backspace at the very start of a callout removes the box but keeps its content.
      // Lists are left to the list plugin, which first turns the item into a paragraph.
      editor.registerCommand(
        DELETE_CHARACTER_COMMAND,
        (isBackward: boolean) => {
          const selection = $getSelection();
          if (!isBackward || !$isRangeSelection(selection)) return false;
          const callout = $getParentCallout(selection);
          if (!callout || !$isCaretAtCalloutStart(selection, callout)) return false;
          if ($isListNode(callout.getFirstChild())) return false;
          $unwrapNode(callout);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      // When callout is the last child pressing down arrow will insert paragraph
      // below it to allow adding more content. It's similar what $insertBlockNode
      // (mainly for decorators), except it'll always be possible to continue adding
      // new content even if trailing paragraph is accidentally deleted
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
            return false;
          }

          const container = $getParentCallout(selection);

          if (container === null) {
            return false;
          }

          const parent = container.getParent();
          if (parent !== null && parent.getLastChild() === container) {
            parent.append($createParagraphNode());
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
            return false;
          }

          const container = $getParentCallout(selection);

          if (container === null) {
            return false;
          }

          const parent = container.getParent();
          if (parent !== null && parent.getFirstChild() === container) {
            container.insertBefore($createParagraphNode());
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_CALLOUT_COMMAND,
        (level: CalloutLevel) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;

          const parentCallout = $getParentCallout(selection);
          if (parentCallout) {
            parentCallout.setLevel(level);
            return true;
          }

          const blocks = $getSelectedRootBlocks(selection);
          const callout = $createCalloutNode(level);
          if (blocks.length === 0) {
            const paragraph = $createParagraphNode();
            $insertNodeToNearestRoot(callout.append(paragraph));
            paragraph.select();
            return true;
          }
          blocks[0].insertBefore(callout);
          callout.append(...blocks);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        REMOVE_CALLOUT_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;
          const callout = $getParentCallout(selection);
          if (callout) $unwrapNode(callout);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);
  return null;
}
