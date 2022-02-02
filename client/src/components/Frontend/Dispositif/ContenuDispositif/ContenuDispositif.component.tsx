import React from "react";
import { Col, Row } from "reactstrap";
import { Props } from "./ContenuDispositif.container";
import EditableParagraph from "../EditableParagraph/EditableParagraph";
import { QuickToolbar } from "components/Pages/dispositif/QuickToolbar";
import ContenuParagraphe from "../ContenuParagraphe/ContenuParagraphe";
import { DispositifContent, Tag, UiObject } from "types/interface";
import FButton from "components/FigmaUI/FButton/FButton";
import { isMobile } from "react-device-detect";
import { ShortContent } from "data/dispositif";

export interface PropsBeforeInjection {
  updateUIArray: (
    key: number,
    arg: number|null,
    variante: string,
    option?: boolean
  ) => void;
  handleContentClick: () => void;
  handleMenuChange: (ev: any, value?: any) => any
  onEditorStateChange: () => void;
  addItem: (key: any, type?: string, subkey?: string|null) => void
  sideView: boolean; // unused?
  admin: boolean;
  content: ShortContent;
  showGeolocModal: boolean;
  typeContenu: "dispositif" | "demarche";
  uiArray: UiObject[];
  disableEdit: boolean;
  menu: DispositifContent[];
  displayTuto: boolean;
  addMapBtn: boolean;
  printing: boolean;
  mainTag: Tag;
  t: any;
  toggleModal: (show: boolean, name: string) => void
  toggleTutorielModal: (arg: string) => void;
  toggleGeolocModal: () => void;
  removeItem: (key: number, subkey?: number | null) => void
  showMapButton: () => void;
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

export const contenuDispositif = (props: Props) => {
  const { t, disableEdit } = props;

  const getTitle = (title: string) => {
    if (title === "La démarche par étapes")
      return t("Dispositif.Comment faire ?", "Comment faire ?");

    return t("Dispositif." + title, title);
  };

  // props.menu is an array of the different sections (for example for a dispositif it is C'est quoi, C'est pour qui, Pourquoi c'est intéressant and Comment je m'engage)
  return props.menu.map((dispositifContent: DispositifContent, key: number) => {
    return (
      <div key={key} className={"contenu-wrapper"} id={"contenu-" + key}>
        <Row className="relative-position nopadding content-row">
          <Col
            lg="12"
            md="12"
            sm="12"
            xs="12"
            className={
              "contenu " + (props.uiArray[key].isHover ? " isHovered" : "")
            }
            onMouseEnter={() => props.updateUIArray(key, null, "isHover")}
          >
            {!isMobile && (
              <button className="anchor" id={"item-head-" + key}>
                {dispositifContent.title}
              </button>
            )}
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h3
                className={
                  "contenu-title " + (key !== 0 ? " mt-20" : "")
                }
                style={{ color: props.mainTag.darkColor }}
              >
                {
                  // display title of dispositif
                }
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
                      onClick={() => props.toggleTutorielModal(dispositifContent.title)}
                    >
                      Tutoriel
                    </FButton>
                  </div>
                )}
            </div>
            {
              // EditableParagraph displays content (but not children) in lecture mode and deal with edition in edition mode
              dispositifContent.content !== null && dispositifContent.content !== "null" && (
                <EditableParagraph
                  keyValue={key}
                  subkey={0} // TODO: ok?
                  handleMenuChange={props.handleMenuChange}
                  onEditorStateChange={props.onEditorStateChange}
                  handleContentClick={props.handleContentClick}
                  disableEdit={disableEdit}
                  addItem={props.addItem}
                  editable={dispositifContent.editable}
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
          {!props.sideView && props.uiArray[key].isHover && !isMobile && (
            <Col lg="2" md="2" sm="2" xs="2" className="toolbar-col">
              {
                // on the right, contains reaction and reading
                <QuickToolbar
                  show={props.uiArray[key].isHover}
                  keyValue={key}
                  subkey={0} // TODO: ok?
                  item={dispositifContent}
                  handleContentClick={props.handleContentClick}
                  disableEdit={disableEdit}
                  toggleModal={props.toggleModal}
                  removeItem={props.removeItem}
                  t={props.t}
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
            sideView={props.sideView}
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
            content={props.content}
            admin={props.admin}
            showGeolocModal={props.showGeolocModal}
            setMarkers={props.setMarkers}
            toggleShareContentOnMobileModal={props.toggleShareContentOnMobileModal}
            upcoming={props.upcoming}
          />
        }
      </div>
    );
  });
};
