import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import dynamic from "next/dynamic";
import { EditorBlock } from "draft-js";
import { useTranslation } from "next-i18next";
import { ContentBlock, EditorProps, EditorState } from "react-draft-wysiwyg";
import { useRouter } from "next/router";
import CustomOption from "./CustomOption/CustomOption";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import API from "utils/API";
import { logger } from "logger";
import { colors } from "colors";
import isInBrowser from "lib/isInBrowser";
import styles from "./EditableParagraph.module.scss";

const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

interface AddBtnProps {
  type: string|undefined;
  keyValue: number;
  subkey?: number;
  addItem: any;
}
const AddModuleBtn = (props: AddBtnProps) => {
  if (props.type !== "etape") {
    return (
      <div className={styles.plus_wrapper} style={{ marginBottom: 24 }}>
        <FButton
          onClick={() =>
            props.addItem(props.keyValue, "accordion", props.subkey)
          }
          type="dark"
          name="plus-circle-outline"
          className="mt-10 mb-10"
        >
          Ajouter un accordéon
        </FButton>
      </div>
    );
  }
  return null;
};

function uploadImageCallBack(file: any) {
  return new Promise((resolve, reject) => {
    //On l'envoie ensuite au serveur
    const formData = new FormData();
    //@ts-ignore
    formData.append(0, file);
    API.set_image(formData)
      .then((data_res) => {
        let response = data_res.data.data;
        response.link = response.secure_url;
        resolve({ data: response });
      })
      .catch((e) => {
        logger.error("uploadImageCallBack error", { error: e });
        reject(e);
      });
  });
}

interface BlockProps {}
const MyCustomBlock = (props: BlockProps) => (
  <div className="bloc-rouge">
    <div className="icon-left-side">
      <EVAIcon name="info-outline" fill={colors.noir} className="flex-center" />
    </div>
    <div className="right-side">
      <b>Bon à savoir :</b>
      <EditorBlock {...props} />
    </div>
  </div>
);
const myBlockRenderer = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  if (type === "header-six") {
    return {
      component: MyCustomBlock,
    };
  }
  return null;
}

// EditableParagraph deals with content (and not children of items) in lecture and edition mode
interface Props {
  editable: boolean
  disableEdit: boolean
  keyValue: number
  subkey?: number
  placeholder: string | undefined
  editorState: EditorState
  onEditorStateChange: any
  type: string|undefined
  addItem: (key: any, type?: string, subkey?: string | null) => void
  content: any
  handleMenuChange: (ev: any, value?: any) => any
  handleContentClick: any
  target: any
}
const EditableParagraph = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const editorReference = useRef<any>(null);
  const [focused, setFocused] = useState(false);

  const setEditorReference = (ref: any) => {
    editorReference.current = ref;
  };

  useEffect(() => {
    if (props.editable
      && !props.disableEdit
      && !focused
      && editorReference.current
    ) {
      editorReference.current.focus();
      setFocused(true);
    }

    if (!props.editable && props.disableEdit) {
      setFocused(false);
    }
  }, [props.editable, props.disableEdit, focused]);

  if (props.editable && !props.disableEdit) {
    return (
      <>
        {isInBrowser() && (
          <Editor
            spellCheck
            editorRef={setEditorReference}
            toolbarClassName={
              "toolbar-editeur" + (props.keyValue === 0 ? " no-top" : "")
            }
            editorClassName="editor-editeur"
            wrapperClassName="wrapper-editeur"
            placeholder={props.placeholder}
            onEditorStateChange={(editorState: EditorState) => {
              props.onEditorStateChange(
                editorState,
                props.keyValue,
                props.subkey
              );
            }}
            editorState={props.editorState}
            toolbarCustomButtons={[
              // eslint-disable-next-line react/jsx-key
              <CustomOption editorState={props.editorState} />,
            ]}
            // blockRendererFn={myBlockRenderer}
            customBlockRenderFunc={myBlockRenderer}
            stripPastedStyles
            localization={{
              locale: router.locale
            }}
            toolbar={{
              options: ["inline", "list", "link"], //, 'embedded'
              inline: {
                inDropdown: false,
                options: ["bold", "italic", "underline"],
                className: "bloc-gauche-inline blc-gh",
                bold: { icon: "/icons/toolbar/boldBtn.svg", className: "inline-btn btn-bold" },
                italic: { icon: "/icons/toolbar/italicBtn.svg", className: "inline-btn btn-italic" },
                underline: {
                  icon: "/icons/toolbar/underBtn.svg",
                  className: "inline-btn btn-underline",
                },
              },
              list: {
                inDropdown: false,
                options: ["unordered"],
                className: "bloc-gauche-list blc-gh",
                unordered: { icon: "/icons/toolbar/listBtn.svg", className: "list-btn" },
              },
              image: {
                className: "bloc-droite-image",
                icon: "/icons/toolbar/imgBtn.svg",
                urlEnabled: true,
                uploadEnabled: true,
                uploadCallback: uploadImageCallBack,
                alignmentEnabled: true,
                alt: { present: true, mandatory: false },
                previewImage: true,
              },
              link: {
                inDropdown: false,
                options: ["link"],
                className: "bloc-gauche-inline blc-gh",
                link: { icon: "/icons/toolbar/linkBtn.svg", className: "btn-link" },
                showOpenOptionOnHover: true,
              },
            }}
          />
        )}
        {props.keyValue !== 0 ? (
          <AddModuleBtn
            type={props.type}
            addItem={props.addItem}
            keyValue={props.keyValue}
            subkey={props.subkey}
          />
        ) : null}
      </>
    );
  } else if (typeof props.content === "string") {
    return (
      <>
        <ContentEditable
          id={props.keyValue+""}
          data-subkey={props.subkey}
          data-target={props.target}
          className="animated fadeIn"
          html={
            props.content ||
            "<p>" +
              t(
                "Dispositif.Rien à afficher",
                "Cet élément est vide, il n'y a rien à afficher"
              ) +
              "</p>"
          } // innerHTML of the editable div
          placeholder={"test"}
          disabled={props.disableEdit} // use true to disable editing
          onChange={props.handleMenuChange} // handle innerHTML change
          onClick={() =>
            props.handleContentClick(
              props.keyValue,
              !props.disableEdit,
              props.subkey
            )
          }
        />
        {!props.disableEdit && props.keyValue !== 0 && (
          <AddModuleBtn
            type={props.type}
            addItem={props.addItem}
            keyValue={props.keyValue}
            subkey={props.subkey}
          />
        )}
      </>
    );
  }
  return null;
};

export default EditableParagraph;
