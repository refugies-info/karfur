import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "reactstrap";
import ContentEditable from "react-contenteditable";
import { Editor } from "react-draft-wysiwyg";
import { EditorBlock, AtomicBlockUtils, EditorState } from "draft-js";
import { Player } from "video-react";
import { withTranslation } from "react-i18next";
import insertAtomicBlockWithData from "./insertAtomicBlockWithData";

// import Backdrop from '../../../UI/Backdrop/Backdrop';
import {
  boldBtn,
  italicBtn,
  underBtn,
  listBtn,
  imgBtn,
  linkBtn,
} from "../../../../assets/figma"; //videoBtn
import CustomOption from "./CustomOption/CustomOption";
import MediaUpload from "../MediaUpload";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";
import API from "../../../../utils/API";

import "./EditableParagraph.scss";
import variables from "scss/colors.scss";

const styles = {
  media: {
    width: "100%",
    // Fix an issue with Firefox rendering video controls
    // with 'pre-wrap' white-space
    whiteSpace: "initial",
  },
};

const MyCustomBlock = (props) => (
  <div className="bloc-rouge">
    <div className="icon-left-side">
      <EVAIcon
        name="info-outline"
        fill={variables.noir}
        className="flex-center"
      />
    </div>
    <div className="right-side">
      <b>Bon à savoir :</b>
      <EditorBlock {...props} />
    </div>
  </div>
);

const MyImageBlock = (props) => {
  const { block, contentState } = props;
  if (block.getEntityAt(0)) {
    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    if (data.alt !== undefined) {
      return (
        <div className="image-wrapper">
          <img {...data} alt={(data || {}).alt} />
        </div>
      );
    } 
      return (
        <div className="video-wrapper">
          <Player playsInline {...data} />
        </div>
      );
    
  } 
    return false;
  
};

const MyMediaBlock = (props) => {
  const { block, contentState } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  if (type === "image") {
    const link = data.imageData.secure_url;
    return (
      <div className="image-wrapper">
        <img src={data.imageData.secure_url} />
      </div>
    );
  }
};

const Audio = (props) => {
  return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
  return <img src={props.src} style={styles.media} />;
};

const Video = (props) => {
  return <video controls src={props.src} style={styles.media} />;
};

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  let media;
  if (type === "audio") {
    media = <Audio src={src} />;
  } else if (type === "image") {
    media = <Image src={src} />;
  } else if (type === "video") {
    media = <Video src={src} />;
  }

  return media;
};

function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();
  if (type === "header-six") {
    return {
      component: MyCustomBlock,
    };
  } else if (type === "atomic") {
    return {
      component: MyImageBlock, //Media,
      //editable: false,
    };
  }
  return undefined;
}

class EditableParagraph extends Component {
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
        i === key ? (hover ? variables.noir : "#FFFFFF") : "#FFFFFF"
      ),
    }));

  Button = () => {
    return (
      <div className="bloc-droite-image blc-dr">
        <EVAIcon name="alert-triangle-outline" />
      </div>
    );
  };

  insertBlock = (type, data) => {
    const { editorState } = this.props;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      type,
      "IMMUTABLE",
      { src: data }
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    this.props.onEditorStateChange(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "),
      this.props.keyValue,
      this.props.subkey
    );
  };

  render() {
    const props = this.props;
    if (props.editable && !props.disableEdit) {
      return (
        // {/* <Backdrop show={true} clicked={()=>props.handleContentClick(props.keyValue,false, props.subkey)} /> */}
        <>
          <Editor
            spellCheck
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
              // <MediaUpload modalState={this.state.modalState} insertBlock={this.insertBlock} />,
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
                defaultTargetOption: "_blank",
                showOpenOptionOnHover: true,
              },
            }}
          />
          <AddModuleBtn
            isDropdownOpen={this.state.isDropdownOpen}
            dropdownColor={this.state.dropdownColor}
            tooltipOpen={this.state.tooltipOpen}
            toggle={this.toggle}
            toggleColor={this.toggleColor}
            toggleTooltip={this.toggleTooltip}
            {...this.props}
          />
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
            html={props.content || ""} // innerHTML of the editable div
            placeholder={props.placeholder}
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
          {!props.disableEdit && (
            <AddModuleBtn
              isDropdownOpen={this.state.isDropdownOpen}
              dropdownColor={this.state.dropdownColor}
              tooltipOpen={this.state.tooltipOpen}
              toggle={this.toggle}
              toggleColor={this.toggleColor}
              toggleTooltip={this.toggleTooltip}
              {...this.props}
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
      <div className="plus-wrapper">
        <Dropdown isOpen={props.isDropdownOpen} toggle={props.toggle}>
          <DropdownToggle
            tag="span"
            onClick={props.toggle}
            data-toggle="dropdown"
            aria-expanded={props.isDropdownOpen}
            id="add-module-btn"
          >
            <FButton type="dark" name="plus-circle-outline" className="mt-10">
              Ajouter un module
            </FButton>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() =>
                props.addItem(props.keyValue, "paragraph", props.subkey)
              }
              id="paragraph"
              onMouseEnter={() => props.toggleColor(0, true)}
              onMouseLeave={() => props.toggleColor(0, false)}
            >
              <EVAIcon
                name="menu-outline"
                fill={props.dropdownColor[0]}
                id="0"
              />
              Paragraphe
            </DropdownItem>
            <DropdownItem
              onClick={() => props.addItem(props.keyValue, "map", props.subkey)}
              id="map"
              onMouseEnter={() => props.toggleColor(2, true)}
              onMouseLeave={() => props.toggleColor(2, false)}
            >
              <EVAIcon
                name="pin-outline"
                fill={props.dropdownColor[2]}
                id="2"
              />
              Carte
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                props.addItem(props.keyValue, "accordion", props.subkey)
              }
              id="accordion"
              onMouseEnter={() => props.toggleColor(3, true)}
              onMouseLeave={() => props.toggleColor(3, false)}
            >
              <EVAIcon
                name="list-outline"
                fill={props.dropdownColor[3]}
                id="3"
              />
              Accordéon
            </DropdownItem>
            {props.typeContenu === "demarche" && (
              <DropdownItem
                onClick={() =>
                  props.addItem(props.keyValue, "etape", props.subkey)
                }
                id="etape"
                onMouseEnter={() => props.toggleColor(4, true)}
                onMouseLeave={() => props.toggleColor(4, false)}
              >
                <EVAIcon
                  name="list-outline"
                  fill={props.dropdownColor[4]}
                  id="4"
                />
                Etape
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>

        <Tooltip
          placement="top"
          offset="0px, 8px"
          isOpen={props.tooltipOpen}
          target="add-module-btn"
          toggle={props.toggleTooltip}
        >
          ajouter
        </Tooltip>
      </div>
    );
  } 
    return false;
  
};

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
        console.log(e);
        reject(e);
      });
  });
}

export default withTranslation()(EditableParagraph);
