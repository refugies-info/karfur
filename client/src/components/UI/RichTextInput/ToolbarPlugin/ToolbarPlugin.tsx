import { useCallback, useEffect, useState } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $isParentElementRTL, $setBlocksType_experimental } from "@lexical/selection";
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import type { LexicalEditor, NodeKey } from "lexical";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import * as React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { getSelectedNode } from "../lib";
import styles from "./ToolbarPlugin.module.scss";
import ToolbarButton from "./ToolbarButton";
import ToolbarDropdown from "./ToolbarDropdown";

const blockTypeToBlockName = {
  bullet: "Liste à puces",
  h3: "Titre",
  number: "Liste numérotée",
  paragraph: "Normal",
};

const blockTypeToBlockIcon = {
  h3: <EVAIcon fill="dark" name="text-outline" />,
  paragraph: <EVAIcon fill="dark" name="text" />,
  bullet: <EVAIcon fill="dark" name="list-outline" />,
  number: <EVAIcon fill="dark" name="list-outline" />,
};

const BlockFormatDropDown = ({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}) => {
  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection))
          $setBlocksType_experimental(selection, () => $createParagraphNode());
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType_experimental(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };
  return (
    <>
      <ToolbarDropdown
        name="text-type-menu"
        title="Choisir la présentation du texte"
        disabled={disabled}
        toggleElement={
          <>
            {blockTypeToBlockIcon[blockType]}
            <span>&nbsp;{blockTypeToBlockName[blockType]}</span>
          </>
        }
        items={[
          { text: "Normal", icon: "text", onClick: formatParagraph, selected: blockType === "paragraph" },
          { text: "Titre", icon: "text", onClick: () => formatHeading("h3"), selected: blockType === "h3" },
          {
            text: "Liste à puces",
            icon: "list-outline",
            onClick: formatBulletList,
            selected: blockType === "bullet",
          },
          {
            text: "Liste numérotée",
            icon: "list-outline",
            onClick: formatNumberedList,
            selected: blockType === "number",
          },
        ]}
      />
    </>
  );
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

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          //@ts-ignore check here
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
    }
  }, [activeEditor]);

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
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
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

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://" /* sanitizeUrl("https://") */);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <>
      <div className={styles.container}>
        <ToolbarButton
          disabled={!canUndo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          title={"IS_APPLE" ? "Précédent (⌘Z)" : "Précédent (Ctrl+Z)"}
          iconName="corner-up-left"
        />
        <ToolbarButton
          disabled={!canRedo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          title={"IS_APPLE" ? "Suivant (⌘Y)" : "Suivant (Ctrl+Y)"}
          iconName="corner-up-right"
        />
        <span className={styles.divider} />
        {blockType in blockTypeToBlockName && activeEditor === editor && (
          <>
            <BlockFormatDropDown disabled={!isEditable} blockType={blockType} editor={editor} />
          </>
        )}
        <span className={styles.divider} />
        <ToolbarButton
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
          title={"IS_APPLE" ? "Gras (⌘B)" : "Gras (Ctrl+B)"}
          isPressed={isBold}
          iconName="text"
        />
        <ToolbarButton
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
          title={"IS_APPLE" ? "Italique (⌘I)" : "Italique (Ctrl+I)"}
          isPressed={isItalic}
          iconName="text"
        />
        <ToolbarButton
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
          title={"IS_APPLE" ? "Souligné (⌘U)" : "Souligné (Ctrl+U)"}
          isPressed={isUnderline}
          iconName="text"
        />
        <ToolbarButton
          disabled={!isEditable}
          onClick={insertLink}
          title="Insérer un lien"
          isPressed={isLink}
          iconName="link-outline"
        />
        <span className={styles.divider} />
        <ToolbarDropdown
          name="alignment-menu"
          title="Alignement du texte"
          disabled={!isEditable}
          toggleElement={<EVAIcon fill="dark" name="list-outline" />}
          items={[
            {
              text: "Aligner à gauche",
              icon: "text",
              onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left"),
            },
            {
              text: "Centrer",
              icon: "text",
              onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center"),
            },
            {
              text: "Aligner à droite",
              icon: "list-outline",
              onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right"),
            },
            {
              text: "Justifier",
              icon: "list-outline",
              onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify"),
            },
            {
              text: "Désindenter",
              icon: isRTL ? "list-outline" : "list-outline",
              onClick: () => activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
            },
            {
              text: "Indenter",
              icon: isRTL ? "list-outline" : "list-outline",
              onClick: () => activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
            },
          ]}
        />
      </div>
    </>
  );
}
