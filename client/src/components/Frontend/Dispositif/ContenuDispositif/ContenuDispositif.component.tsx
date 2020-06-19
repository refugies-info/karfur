import React from "react";
import { Col, Row } from "reactstrap";
import { Props } from "./ContenuDispositif.container";
import EditableParagraph from "../EditableParagraph/EditableParagraph";
import { QuickToolbar } from "../../../../containers/Dispositif/QuickToolbar";
import ContenuParagraphe from "../ContenuParagraphe/ContenuParagraphe";
import { DispositifContent } from "../../../../@types/interface";

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
}

export const contenuDispositif = (props: Props) => {
  const { t, disableEdit, inVariante } = props;
  return props.menu.map((item: DispositifContent, key: number) => {
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
              <h3
                className={
                  "contenu-title color-darkColor" + (key !== 0 ? " mt-20" : "")
                }
              >
                {item.title && t("Dispositif." + item.title, item.title)}
              </h3>
              {item.content !== null && item.content !== "null" && (
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
              )}
            </Col>
            {!props.sideView &&
              !props.inVariante &&
              props.uiArray[key].isHover && (
                <Col lg="2" md="2" sm="2" xs="2" className="toolbar-col">
                  <QuickToolbar
                    show={props.uiArray[key].isHover}
                    keyValue={key}
                    item={item}
                    handleContentClick={props.handleContentClick}
                    disableEdit={newDisableEdit}
                    tracking={props.tracking}
                    toggleModal={props.toggleModal}
                    readAudio={props.readAudio}
                    subkey={props.subkey}
                    t={props.t}
                    removeItem={props.removeItem}
                    ttsActive={props.ttsActive}
                  />
                </Col>
              )}
          </Row>
          <ContenuParagraphe item={item} keyValue={key} {...props} />
          <button className="anchor" id={"item-" + key}>
            {item.title}
          </button>
        </div>
      );
    }
    return false;
  });
};
