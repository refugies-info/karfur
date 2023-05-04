/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import Button from "components/UI/Button";
import {
  $getSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  CONTROLLED_TEXT_INSERTION_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "reactstrap";
import { getSelectedNode, sanitizeUrl, setFloatingElemPosition } from "../../lib";
import styles from "./FloatinLinkEditorPlugin.module.scss";

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton = (props: CloseButtonProps) => (
  <div className="text-end">
    <Button
      evaIcon="close-outline"
      iconPosition="right"
      priority="tertiary"
      className={styles.close}
      onClick={(e: any) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      Fermer
    </Button>
  </div>
);

interface FloatingLinkEditorProps {
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElem: HTMLElement;
}

const FloatingLinkEditor = ({ editor, isLink, setIsLink, anchorElem }: FloatingLinkEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
        setLinkText(parent.getTextContent());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
        setLinkText(node.getTextContent());
      } else {
        setLinkUrl("");
        setLinkText("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) return;

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild !== null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      setFloatingElemPosition(rect, editorElem, anchorElem);
    } else if (!activeElement || activeElement.className !== "link-input") {
      if (rootElement !== null) {
        setFloatingElemPosition(null, editorElem, anchorElem);
      }
      setLinkUrl("");
    }

    return true;
  }, [anchorElem, editor]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;
    const update = () => {
      editor.getEditorState().read(() => updateLinkEditor());
    };
    window.addEventListener("resize", update);
    if (scrollerElem) scrollerElem.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) scrollerElem.removeEventListener("scroll", update);
    };
  }, [anchorElem.parentElement, editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateLinkEditor());
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, updateLinkEditor, setIsLink, isLink]);

  useEffect(() => {
    editor.getEditorState().read(() => updateLinkEditor());
  }, [editor, updateLinkEditor]);

  const removeLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsLink(false);
  }, [editor, setIsLink]);

  const validateModal = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(linkUrl));
    // TODO: how to insert text
    // editor.dispatchCommand(CONTROLLED_TEXT_INSERTION_COMMAND, linkText);
    setIsModalOpen(false);
  };

  return (
    <>
      <div ref={editorRef} className={styles.floating_container}>
        <CloseButton onClick={() => setIsLink(false)} />
        <p className={styles.text}>{linkText}</p>
        <p className={styles.url}>{linkUrl}</p>
        <div className={styles.buttons}>
          <Button
            priority="secondary"
            className="me-4"
            onClick={(e: any) => {
              e.preventDefault();
              removeLink();
            }}
          >
            Supprimer le lien
          </Button>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
          >
            Modifier
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen((o) => !o)} contentClassName={styles.modal}>
        <CloseButton onClick={() => setIsModalOpen(false)} />

        <p className={styles.title}>Modifier le lien</p>
        <div>
          <label className={styles.label}>Texte</label>
          <span className={styles.input}>
            <i className="ri-message-3-line"></i>
            <input type="text" value={linkText} onChange={(event) => setLinkText(event.target.value)} />
          </span>
        </div>
        <div className="my-6">
          <label className={styles.label}>URL</label>
          <span className={styles.input}>
            <i className="ri-link"></i>
            <input type="url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} />
          </span>
        </div>
        <div className="text-end">
          <Button
            evaIcon="checkmark-circle-2"
            iconPosition="right"
            onClick={(event) => {
              event.preventDefault();
              validateModal();
            }}
          >
            Valider
          </Button>
        </div>
      </Modal>
    </>
  );
};

const useFloatingLinkEditorToolbar = (editor: LexicalEditor, anchorElem: HTMLElement) => {
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);
      const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode);

      // We don't want this menu to open for auto links.
      if (linkParent !== null && autoLinkParent === null) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

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

  return isLink
    ? createPortal(
        <FloatingLinkEditor editor={activeEditor} isLink={isLink} anchorElem={anchorElem} setIsLink={setIsLink} />,
        anchorElem,
      )
    : null;
};

interface FloatingLinkEditorPluginProps {
  anchorElem?: HTMLElement;
}
const FloatingLinkEditorPlugin = ({ anchorElem = document.body }: FloatingLinkEditorPluginProps) => {
  const [editor] = useLexicalComposerContext();
  return useFloatingLinkEditorToolbar(editor, anchorElem);
};

export default FloatingLinkEditorPlugin;
