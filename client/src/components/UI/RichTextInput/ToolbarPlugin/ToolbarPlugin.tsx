import React, { useCallback, useEffect, useState } from "react";
import { isMacOs } from "react-device-detect";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $isParentElementRTL, $setBlocksType, $selectAll } from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $getNearestBlockElementAncestorOrThrow,
  mergeRegister,
} from "@lexical/utils";
import { $isTextNode, NodeKey } from "lexical";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { cls } from "lib/classname";
import { $isCalloutNode, INSERT_CALLOUT_COMMAND, REMOVE_CALLOUT_COMMAND } from "../plugins/CalloutPlugin";
import { CalloutLevel, CalloutNode } from "../plugins/CalloutPlugin/CalloutNode";
import { getSelectedNode } from "../lib";
import ToolbarButton from "./ToolbarButton";
import ToolbarDropdown from "./ToolbarDropdown";
import styles from "./ToolbarPlugin.module.scss";

const blockTypeToBlockName = {
  bullet: "Liste à puces",
  h3: "Titre",
  number: "Liste numérotée",
  paragraph: "Normal",
  important: "Important",
  info: "Bon à savoir",
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsRTL($isParentElementRTL(selection));

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      // Links
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      // Block formats
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          // list
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type as "number" | "bullet");
        } else if ($isCalloutNode(element)) {
          // callout
          const parentNode = $getNearestNodeOfType<CalloutNode>(anchorNode, CalloutNode);
          const type = parentNode ? parentNode.getLevel() : element.getLevel();
          setBlockType(type);
        } else {
          // heading
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
    }
  }, [activeEditor]);

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $selectAll(selection);
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
            $getNearestBlockElementAncestorOrThrow(node).setFormat("");
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection))
          $setBlocksType(selection, () => $createParagraphNode());
      });
    }
  };

  const formatHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
        if (blockType !== "h3") {
          $setBlocksType(selection, () => $createHeadingNode("h3"));
        } else {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      }
    });
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      // removes list only for the selection
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
      // removes the whole list block
      // editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      // removes list only for the selection
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
      // removes the whole list block
      // editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // needs a space, unable to create a link without content
          const node = getSelectedNode(selection);
          const parent = node.getParent();
          if (parent?.getType() === "root") {
            selection.insertText(" ");
          }
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: "", rel: "noreferrer" });
        }
        return true;
      });
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const formatCallout = (type: CalloutLevel) => {
    if (blockType !== type) {
      editor.dispatchCommand(INSERT_CALLOUT_COMMAND, type);
    } else {
      editor.dispatchCommand(REMOVE_CALLOUT_COMMAND, undefined);
    }
  };

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => setIsEditable(editable)),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [activeEditor, editor, updateToolbar]);

  return (
    <>
      <div className={cls(styles.container, "toolbar-plugin-container")}>
        <ToolbarButton
          disabled={!canUndo || !isEditable}
          onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
          title={isMacOs ? "Annuler (⌘Z)" : "Annuler (Ctrl+Z)"}
          icon="ri-arrow-go-back-line"
        />
        <ToolbarButton
          disabled={!canRedo || !isEditable}
          onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
          title={isMacOs ? "Rétablir (⌘Y)" : "Rétablir (Ctrl+Y)"}
          icon="ri-arrow-go-forward-line"
        />
        <span className={styles.divider} />
        <ToolbarButton
          disabled={!isEditable}
          onClick={formatParagraph}
          isPressed={blockType === "paragraph"}
          title="Paragraphe"
          text="Normal"
        />
        <ToolbarButton
          disabled={!isEditable}
          onClick={() => formatHeading()}
          isPressed={blockType === "h3"}
          title="Titre"
          text="Titre"
        />
        <span className={styles.divider} />
        <ToolbarButton
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
          title={isMacOs ? "Gras (⌘B)" : "Gras (Ctrl+B)"}
          isPressed={isBold}
          icon="ri-bold"
        />
        <ToolbarButton
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
          title={isMacOs ? "Italique (⌘I)" : "Italique (Ctrl+I)"}
          isPressed={isItalic}
          icon="ri-italic"
        />
        <ToolbarButton
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
          title={isMacOs ? "Souligné (⌘U)" : "Souligné (Ctrl+U)"}
          isPressed={isUnderline}
          icon="ri-underline"
        />
        <span className={styles.divider} />
        <ToolbarButton
          disabled={!isEditable}
          onClick={formatBulletList}
          isPressed={blockType === "bullet"}
          title="Liste à puces"
          icon="ri-list-unordered"
        />
        <ToolbarButton
          disabled={!isEditable}
          onClick={formatNumberedList}
          isPressed={blockType === "number"}
          title="Liste numérotée"
          icon="ri-list-ordered"
        />
        <span className={styles.divider} />
        <ToolbarButton
          disabled={!isEditable}
          onClick={insertLink}
          title="Lien externe"
          isPressed={isLink}
          icon="ri-link"
        />
        <span className={styles.divider} />
        <ToolbarDropdown
          disabled={!isEditable}
          name="callout-menu"
          title="Insérer un bloc"
          toggleElement={<ToolbarButton title="Insérer" icon="ri-add-line" text="Insérer" noButton />}
          items={[
            {
              text: "Bloc Important",
              icon: "ri-alert-fill",
              onClick: () => formatCallout("important"),
              selected: blockType === "important",
            },
            {
              text: "Bloc Bon à savoir",
              icon: "ri-side-bar-fill",
              onClick: () => formatCallout("info"),
              selected: blockType === "info",
            },
          ]}
        />
      </div>
    </>
  );
}
