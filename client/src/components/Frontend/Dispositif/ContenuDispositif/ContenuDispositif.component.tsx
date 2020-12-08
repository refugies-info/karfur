import React from "react";
import { Col, Row } from "reactstrap";
import { Props } from "./ContenuDispositif.container";
import EditableParagraph from "../EditableParagraph/EditableParagraph";
import { QuickToolbar } from "../../../../containers/Dispositif/QuickToolbar";
import ContenuParagraphe from "../ContenuParagraphe/ContenuParagraphe";
import { DispositifContent } from "../../../../@types/interface";
import FButton from "../../../FigmaUI/FButton/FButton";

interface UiObject {
  accordion: boolean;
  addDropdown: boolean;
  cardDropdown: boolean;
  isHover: boolean;
  varianteSelected: boolean;
}

export interface PropsBeforeInjection {
  updateUIArray: (
    key: number,
    arg: null,
    variante: string,
    option?: boolean
  ) => void;
  handleContentClick: () => void;
  handleMenuChange: () => void;
  onEditorStateChange: () => void;
  addItem: () => void;
  // not sure it is boolean
  sideView: boolean;
  typeContenu: string;
  uiArray: UiObject[];
  t: any;
  disableEdit: boolean;
  inVariante: boolean;
  menu: DispositifContent[];
  tracking: any;
  toggleModal: any;
  readAudio: any;
  subkey: any;
  show: any;
  tts: any;
  removeItem: any;
  ttsActive: any;
  filtres: any;
  toggleTutorielModal: (arg: string) => void;
  toggleGeolocModal: () => void;
  displayTuto: boolean;
  addMapBtn: boolean;
  printing: boolean;
}

/**
 *
 * @param props
 * disableEdit : true in lecture mode and false when editing
 */

export const contenuDispositif = (props: Props) => {
  const { t, disableEdit, inVariante } = props;

  // props.menu is an array of the different sections (for example for a dispositif it is C'est quoi, C'est pour qui, Pourquoi c'est intéressant and Comment je m'engage)
  return props.menu.map((item: DispositifContent, key: number) => {
    // TO DO : check the second constraint
    const newDisableEdit =
      disableEdit ||
      (props.typeContenu === "demarche" &&
        inVariante &&
        !props.uiArray[key].varianteSelected);

    if (
      (newDisableEdit && !inVariante) ||
      props.typeContenu !== "demarche" ||
      item.title !== "C'est pour qui ?"
    ) {
      return (
        <div
          key={key}
          className={
            "contenu-wrapper" +
            (inVariante &&
            disableEdit &&
            item.content !== null &&
            item.content !== "null"
              ? " in-variante" +
                (props.uiArray[key].varianteSelected
                  ? " variante-selected"
                  : "")
              : "")
          }
          id={"contenu-" + key}
        >
          {inVariante &&
            disableEdit &&
            item.content !== null &&
            item.content !== "null" && (
              // selection of parts to modify when creating a variante of a demarche
              <Col className={"variante-radio" + (key !== 0 ? " mt-20" : "")}>
                <div
                  className="radio-btn"
                  onClick={() =>
                    props.updateUIArray(
                      key,
                      null,
                      "varianteSelected",
                      !props.uiArray[key].varianteSelected
                    )
                  }
                >
                  {props.uiArray[key].varianteSelected && (
                    <div className="active-inset" />
                  )}
                </div>
              </Col>
            )}
          <Row className="relative-position nopadding content-row">
            <Col
              lg="12"
              md="12"
              sm="12"
              xs="12"
              className={
                "contenu borderColor-darkColor" +
                (!props.inVariante && props.uiArray[key].isHover
                  ? " isHovered"
                  : "")
              }
              onMouseEnter={() => props.updateUIArray(key, null, "isHover")}
            >
              <button className="anchor" id={"item-head-" + key}>
                {item.title}
              </button>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <h3
                  className={
                    "contenu-title color-darkColor" +
                    (key !== 0 ? " mt-20" : "")
                  }
                >
                  {
                    // display title of dispositif
                  }
                  {item.title && t("Dispositif." + item.title, item.title)}
                </h3>
                {!disableEdit &&
                  props.typeContenu === "dispositif" &&
                  props.displayTuto && (
                    <div
                      style={{
                        marginTop: key !== 0 ? "20px" : "0px",
                        marginLeft: "18px",
                      }}
                    >
                      <FButton
                        type="tuto"
                        name={"play-circle-outline"}
                        onClick={() => props.toggleTutorielModal(item.title)}
                      >
                        Tutoriel
                      </FButton>
                    </div>
                  )}
              </div>
              {
                // EditableParagraph displays content (but not children) in lecture mode and deal with edition in edition mode
                item.content !== null && item.content !== "null" && (
                  <EditableParagraph
                    keyValue={key}
                    handleMenuChange={props.handleMenuChange}
                    onEditorStateChange={props.onEditorStateChange}
                    handleContentClick={props.handleContentClick}
                    disableEdit={newDisableEdit}
                    addItem={props.addItem}
                    subkey={props.subkey}
                    editable={item.editable}
                    type={item.type}
                    placeholder={item.placeholder}
                    target={item.target}
                    content={item.content}
                    // @ts-ignore
                    editorState={item.editorState}
                  />
                )
              }
            </Col>
            {!props.sideView &&
              !props.inVariante &&
              props.uiArray[key].isHover && (
                <Col lg="2" md="2" sm="2" xs="2" className="toolbar-col">
                  {
                    // on the right, contains reaction and reading
                    <QuickToolbar
                      show={props.uiArray[key].isHover}
                      keyValue={key}
                      item={item}
                      handleContentClick={props.handleContentClick}
                      disableEdit={newDisableEdit}
                      toggleModal={props.toggleModal}
                      readAudio={props.readAudio}
                      subkey={props.subkey}
                      t={props.t}
                      removeItem={props.removeItem}
                      ttsActive={props.ttsActive}
                    />
                  }
                </Col>
              )}
          </Row>
          {
            // lecture and edition of childrens and info cards
            <ContenuParagraphe item={item} keyValue={key} {...props} />
          }
          {/*           <button className="anchor" id={"item-" + key}>
            {item.title}
          </button> */}
        </div>
      );
    }
    return false;
  });
};
