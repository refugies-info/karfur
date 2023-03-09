import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $setBlocksType_experimental } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  DELETE_CHARACTER_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  NodeKey,
  createCommand,
} from "lexical";
import { useEffect } from "react";

import { $createCalloutNode, $isCalloutNode, CalloutLevel, CalloutNode } from "./CalloutNode";

export const INSERT_CALLOUT_COMMAND = createCommand<CalloutLevel>();


export default function CalloutPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([CalloutNode])) {
      throw new Error("CalloutPlugin: CalloutNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        DELETE_CHARACTER_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed() || selection.anchor.offset !== 0) {
            return false;
          }
          const anchorNode = selection.anchor.getNode().getTopLevelElement();
          const previousSibling = anchorNode?.getPreviousSibling();
          if (anchorNode && previousSibling === null) {
            $setSelection(null);
            anchorNode?.insertBefore($createParagraphNode());
            anchorNode.remove();
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
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

          const container = $findMatchingParent(selection.anchor.getNode(), $isCalloutNode);

          if (container === null) {
            return false;
          }

          const parent = container.getParent();
          if (parent !== null && parent.getLastChild() === container) {
            parent.append($createParagraphNode());
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_CALLOUT_COMMAND,
        (level: CalloutLevel) => {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            if ($findMatchingParent(selection.anchor.getNode(), $isCalloutNode)) return; // do not nest callouts

            $setBlocksType_experimental(selection, () => $createCalloutNode(level));
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
    );
  }, [editor]);
  return null;
}
