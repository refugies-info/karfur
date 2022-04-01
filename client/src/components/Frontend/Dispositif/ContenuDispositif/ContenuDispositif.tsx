import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { useTranslation } from "next-i18next";
import EditableParagraph from "../EditableParagraph/EditableParagraph";
import QuickToolbar from "components/Pages/dispositif/QuickToolbar";
import ContenuParagraphe from "../ContenuParagraphe";
import { DispositifContent, IDispositif, Tag } from "types/interface";
import FButton from "components/UI/FButton/FButton";
import { EditorState } from "draft-js";
import { UiElement, UiElementNodes } from "services/SelectedDispositif/selectedDispositif.reducer";
import mobile from "scss/components/mobile.module.scss";
import { cls } from "lib/classname";
import { getContent } from "lib/dispositifPage";

interface Props {
  updateUIArray: (
    key: number,
    arg: number|null,
    variante: UiElementNodes,
    option?: boolean
  ) => void;
  handleContentClick: (key: number, editable: boolean, subkey?: number | undefined) => void;
  handleMenuChange: (ev: any, value?: any) => any
  onEditorStateChange: (editorState: EditorState, key: number, subkey?: number | null) => void;
  addItem: (key: any, type?: string, subkey?: string|number|null) => void
  admin: boolean;
  dispositif: IDispositif | null;
  showGeolocModal: boolean;
  typeContenu: "dispositif" | "demarche";
  uiArray: UiElement[];
  disableEdit: boolean;
  menu: DispositifContent[];
  displayTuto: boolean;
  addMapBtn: boolean;
  printing: boolean;
  mainTag: Tag;
  toggleModal: (show: boolean, name: string) => void
  toggleTutorielModal: (arg: string) => void;
  toggleGeolocModal: (val: boolean) => void;
  toggleTooltip: () => void;
  removeItem: (key: number, subkey: number | null) => void
  showMapButton: (val: boolean) => void;
  changeTitle: (key: any, subkey: any, node: any, value: any) => void
  changeAge: (e: any, key: any, subkey: any, isBottom?: boolean) => any
  changeDepartements: (departments: any, key: any, subkey: any) => any
  changePrice: (e: any, key: any, subkey: any) => any
  toggleFree: (key: any, subkey: any) => any
  toggleNiveau: (selectedLevels: any, key: any, subkey: any) => void
  deleteCard: (key: any, subkey: any, type: any) => void
  setMarkers: (markers: any, key: any, subkey: any) => void
  toggleShareContentOnMobileModal: () => any
  upcoming: () => any
}

/**
 *
 * @param props
 * disableEdit : true in lecture mode and false when editing
 */

const ContenuDispositif = (props: Props) => {
  const [content, setContent] = useState(getContent(props.dispositif));
  const { t } = useTranslation();
  const { disableEdit } = props;

  useEffect(() => {
    setContent(getContent(props.dispositif));
  }, [props.dispositif]);

  const getTitle = (title: string) => {
    if (title === "La démarche par étapes")
      return t("Dispositif.Comment faire ?", "Comment faire ?");

    return t("Dispositif." + title, title);
  };

  // props.menu is an array of the different sections (for example for a dispositif it is C'est quoi, C'est pour qui, Pourquoi c'est intéressant and Comment je m'engage)
  return (
    <>
      {props.menu.map((dispositifContent: DispositifContent, key: number) => (
        <div key={key} className="contenu-wrapper" id={"contenu-" + key}>
          <Row className="relative-position nopadding content-row">
            <Col
              xs="12"
              className={"contenu " + (props.uiArray[key]?.isHover ? " isHovered" : "")}
              onMouseEnter={() => props.updateUIArray(key, null, "isHover")}
            >
              <button className={cls(mobile.hidden, "anchor")} id={"item-head-" + key}>
                {dispositifContent.title}
              </button>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <h3
                  className={"contenu-title " + (key !== 0 ? " mt-20" : "")}
                  style={{ color: props.mainTag.darkColor }}
                >
                  {dispositifContent.title && getTitle(dispositifContent.title)}
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
                        onClick={() => props.toggleTutorielModal(dispositifContent.title || "")}
                      >
                        Tutoriel
                      </FButton>
                    </div>
                  )}
              </div>
              { // EditableParagraph displays content (but not children) in lecture mode and deal with edition in edition mode
                dispositifContent.content !== null && dispositifContent.content !== "null" && (
                  <EditableParagraph
                    keyValue={key}
                    handleMenuChange={props.handleMenuChange}
                    onEditorStateChange={props.onEditorStateChange}
                    handleContentClick={props.handleContentClick}
                    disableEdit={disableEdit}
                    addItem={props.addItem}
                    editable={!!dispositifContent.editable}
                    type={dispositifContent.type}
                    placeholder={dispositifContent.placeholder || ""}
                    target={dispositifContent.target}
                    content={dispositifContent.content}
                    // @ts-ignore
                    editorState={dispositifContent.editorState}
                  />
                )
              }
            </Col>
            {props.uiArray[key]?.isHover && (
              <Col lg="2" md="2" sm="2" xs="2" className={cls(mobile.hidden, "toolbar-col")}>
                {
                  // on the right, contains reaction and reading
                  <QuickToolbar
                    show={props.uiArray[key].isHover}
                    keyValue={key}
                    item={dispositifContent}
                    handleContentClick={props.handleContentClick}
                    disableEdit={disableEdit}
                    toggleModal={props.toggleModal}
                    removeItem={props.removeItem}
                  />
                }
              </Col>
            )}
          </Row>
          {
            // lecture and edition of childrens and info cards
            <ContenuParagraphe
              dispositifContent={dispositifContent}
              keyValue={key}
              updateUIArray={props.updateUIArray}
              handleContentClick={props.handleContentClick}
              handleMenuChange={props.handleMenuChange}
              onEditorStateChange={props.onEditorStateChange}
              addItem={props.addItem}
              typeContenu={props.typeContenu}
              uiArray={props.uiArray}
              disableEdit={props.disableEdit}
              menu={props.menu}
              toggleModal={props.toggleModal}
              removeItem={props.removeItem}
              toggleTutorielModal={props.toggleTutorielModal}
              toggleGeolocModal={props.toggleGeolocModal}
              displayTuto={props.displayTuto}
              addMapBtn={props.addMapBtn}
              printing={props.printing}
              mainTag={props.mainTag}
              showMapButton={props.showMapButton}
              changeTitle={props.changeTitle}
              changeAge={props.changeAge}
              toggleFree={props.toggleFree}
              changePrice={props.changePrice}
              toggleNiveau={props.toggleNiveau}
              changeDepartements={props.changeDepartements}
              deleteCard={props.deleteCard}
              content={content}
              admin={props.admin}
              showGeolocModal={props.showGeolocModal}
              setMarkers={props.setMarkers}
              toggleShareContentOnMobileModal={props.toggleShareContentOnMobileModal}
              upcoming={props.upcoming}
            />
          }
        </div>
      ))}
    </>
  )
};

export default ContenuDispositif;
