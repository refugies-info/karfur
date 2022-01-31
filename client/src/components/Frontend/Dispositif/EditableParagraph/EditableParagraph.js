import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import dynamic from "next/dynamic"
import { EditorBlock } from "draft-js";
import { withTranslation } from "react-i18next";
import {
  boldBtn,
  italicBtn,
  underBtn,
  listBtn,
  imgBtn,
  linkBtn,
} from "assets/figma"; //videoBtn
import CustomOption from "./CustomOption/CustomOption";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import API from "utils/API";
import { logger } from "logger";
import { colors } from "colors";
import isInBrowser from "lib/isInBrowser";
import styles from "./EditableParagraph.module.scss";

// const styles = {
//   media: {
//     width: "100%",
//     // Fix an issue with Firefox rendering video controls
//     // with 'pre-wrap' white-space
//     whiteSpace: "initial",
//   },
// };

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
)

const MyCustomBlock = (props) => (
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

// not used anymore ?
// const Audio = (props) => {
//   return <audio controls src={props.src} style={styles.media} />;
// };

// const Image = (props) => {
//   return <Image src={props.src} style={styles.media} />;
// };

// const Video = (props) => {
//   return <video controls src={props.src} style={styles.media} />;
// };

// const Media = (props) => {
//   const entity = props.contentState.getEntity(props.block.getEntityAt(0));
//   const { src } = entity.getData();
//   const type = entity.getType();

//   let media;
//   if (type === "audio") {
//     media = <Audio src={src} />;
//   } else if (type === "image") {
//     media = <Image src={src} />;
//   } else if (type === "video") {
//     media = <Video src={src} />;
//   }

//   return media;
// };

function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    //On l'envoie ensuite au serveur
    const formData = new FormData();
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

function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();
  if (type === "header-six") {
    return {
      component: MyCustomBlock,
    };
  }
  return undefined;
}

// EditableParagraph deals with content (and not children of items) in lecture and edition mode
class EditableParagraph extends Component {
  // this component may have a props placeholder (from component contenuParagraphe )
  state = {
    tooltipOpen: false,
    isDropdownOpen: false,
    dropdownColor: new Array(4).fill("#FFFFFF"),
    modalState: true,
  };

  toggle = () => this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  toggleTooltip = () =>
    this.setState((prevState) => ({ tooltipOpen: !prevState.tooltipOpen }));
  toggleColor = (key, hover) =>
    this.setState((prevState) => ({
      dropdownColor: prevState.dropdownColor.map((_, i) =>
        i === key ? (hover ? colors.noir : "#FFFFFF") : "#FFFFFF"
      ),
    }));

  Button = () => {
    return (
      <div className="bloc-droite-image blc-dr">
        <EVAIcon name="alert-triangle-outline" />
      </div>
    );
  };

  setEditorReference = (ref) => {
    this.editorReference = ref;
    if (ref) {
      ref.focus();
    }
  };

  // used in Media upload which is commented
  // insertBlock = (type, data) => {
  //   const { editorState } = this.props;
  //   const contentState = editorState.getCurrentContent();
  //   const contentStateWithEntity = contentState.createEntity(
  //     type,
  //     "IMMUTABLE",
  //     { src: data }
  //   );

  //   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  //   const newEditorState = EditorState.set(editorState, {
  //     currentContent: contentStateWithEntity,
  //   });

  //   this.props.onEditorStateChange(
  //     AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "),
  //     this.props.keyValue,
  //     this.props.subkey
  //   );
  // };

  render() {
    const props = this.props;
    if (props.editable && !props.disableEdit) {
      return (
        // {/* <Backdrop show={true} clicked={()=>props.handleContentClick(props.keyValue,false, props.subkey)} /> */}
        <>
          {isInBrowser() && <Editor
            spellCheck
            editorRef={this.setEditorReference}
            toolbarClassName={
              "toolbar-editeur" + (props.keyValue === 0 ? " no-top" : "")
            }
            editorClassName="editor-editeur"
            wrapperClassName={
              "wrapper-editeur editeur-" + props.keyValue + "-" + props.subkey
            }
            placeholder={props.placeholder}
            onEditorStateChange={(editorState) =>
              props.onEditorStateChange(
                editorState,
                props.keyValue,
                props.subkey
              )
            }
            editorState={props.editorState}
            toolbarCustomButtons={[
              // eslint-disable-next-line react/jsx-key
              <CustomOption editorState={props.editorState} />,
            ]}
            blockRendererFn={myBlockRenderer}
            stripPastedStyles
            localization={{
              locale: this.props.i18n.language,
            }}
            toolbar={{
              options: ["inline", "list", "link"], //, 'embedded'
              inline: {
                inDropdown: false,
                options: ["bold", "italic", "underline"],
                className: "bloc-gauche-inline blc-gh",
                bold: { icon: boldBtn, className: "inline-btn btn-bold" },
                italic: { icon: italicBtn, className: "inline-btn btn-italic" },
                underline: {
                  icon: underBtn,
                  className: "inline-btn btn-underline",
                },
              },
              list: {
                inDropdown: false,
                options: ["unordered"],
                className: "bloc-gauche-list blc-gh",
                unordered: { icon: listBtn, className: "list-btn" },
              },
              image: {
                className: "bloc-droite-image",
                icon: imgBtn,
                urlEnabled: true,
                uploadEnabled: true,
                uploadCallback: uploadImageCallBack,
                alignmentEnabled: true,
                alt: { present: true, mandatory: false },
                previewImage: true,
              },
              /*   image: {
                component: this.Button
                //uploadCallback: uploadImageCallBack,
              }, */
              // embedded:{
              //   className: "bloc-droite-embedded",
              //   icon: videoBtn
              // },
              link: {
                inDropdown: false,
                options: ["link"],
                className: "bloc-gauche-inline blc-gh",
                link: { icon: linkBtn, className: "btn-link" },
                showOpenOptionOnHover: true,
              },
            }}
          />}
          {this.props.keyValue !== 0 ? (
            <AddModuleBtn
              isDropdownOpen={this.state.isDropdownOpen}
              dropdownColor={this.state.dropdownColor}
              tooltipOpen={this.state.tooltipOpen}
              toggle={this.toggle}
              toggleColor={this.toggleColor}
              toggleTooltip={this.toggleTooltip}
              type={this.props.type}
              addItem={this.props.addItem}
              keyValue={this.props.keyValue}
              subkey={this.props.subkey}
            />
          ) : null}
        </>
      );
    } else if (typeof props.content === "string") {
      return (
        <>
          <ContentEditable
            id={props.keyValue}
            data-subkey={props.subkey}
            data-target={props.target}
            className="animated fadeIn"
            html={
              props.content ||
              "<p>" +
                props.t(
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
          {!props.disableEdit && this.props.keyValue !== 0 && (
            <AddModuleBtn
              isDropdownOpen={this.state.isDropdownOpen}
              dropdownColor={this.state.dropdownColor}
              tooltipOpen={this.state.tooltipOpen}
              toggle={this.toggle}
              toggleColor={this.toggleColor}
              toggleTooltip={this.toggleTooltip}
              type={this.props.type}
              addItem={this.props.addItem}
              keyValue={this.props.keyValue}
              subkey={this.props.subkey}
            />
          )}
        </>
      );
    }
    return false;
  }
}

const AddModuleBtn = (props) => {
  if (props.type !== "etape") {
    return (
      <div className={styles.plus_wrapper} style={{ marginBottom: "24px" }}>
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
  return false;
};

export default withTranslation()(EditableParagraph);
