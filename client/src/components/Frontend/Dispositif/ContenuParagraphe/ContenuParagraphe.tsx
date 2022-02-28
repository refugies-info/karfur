import React from "react";
import { Col, Row, Collapse } from "reactstrap";
import ContentEditable from "react-contenteditable";
import EditableParagraph from "../EditableParagraph/EditableParagraph";
import QuickToolbar from "components/Pages/dispositif/QuickToolbar";
import { useTranslation } from "next-i18next";
import CardParagraphe from "components/Pages/dispositif/CardParagraphe";
import {PlusCard} from "components/Pages/dispositif/CardParagraphe/PlusCard";
import MapParagraphe from "components/Pages/dispositif/MapParagraphe/MapParagraphe";
import MapParagraphePrint from "components/Pages/dispositif/MapParagraphe/MapParagraphePrint";
import EtapeParagraphe from "components/Pages/dispositif/EtapeParagraphe";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import { colors } from "colors";
import styled from "styled-components";
import {
  cardTitlesDispositif,
  cardTitlesDemarche,
  infocardsDemarcheTitles,
  ShortContent,
} from "data/dispositif";
import { isMobile } from "react-device-detect";
import styles from "./ContenuParagraphe.module.scss";
import { DispositifContent, Tag } from "types/interface";
import { EditorState } from "draft-js";
import { UiElement } from "services/SelectedDispositif/selectedDispositif.reducer";
import { useRouter } from "next/router";

interface AccordeonProps {
  disableEdit: boolean
  subkey: number
  isAccordeonOpen: boolean
  darkColor: string
  lightColor: string
}
const StyledAccordeon = styled.div`
  padding: ${(props: AccordeonProps) =>
    props.disableEdit || props.subkey === 0 ? "16px" : "16px 62px 16px 16px"};

  border: ${(props: AccordeonProps) =>
    props.disableEdit && props.isAccordeonOpen
      ? `solid 2px ${props.darkColor}`
      : "none"};
  background: ${(props: AccordeonProps) =>
    props.disableEdit && props.isAccordeonOpen ? props.lightColor : "#f2f2f2"};
  border-radius: 12px;
  outline: none;
  boxshadow: none;
  cursor: pointer;
  display: flex;
  position: relative;
  flex-direction: row;
  box-shadow: ${(props: AccordeonProps) =>
    props.disableEdit && !props.isAccordeonOpen
      ? "0px 10px 15px rgba(0, 0, 0, 0.25)"
      : "none"};
`;

const StyledHeader = styled.div`
  display: flex;
  margin: auto;
  font-weight: bold;
  font-size: ${isMobile ? "18px" : "22px"};
  line-height: 28px;
  color: ${(props: { darkColor: string}) => props.darkColor};
`;
const MobileInfoCardsSection = styled.div`
  display: flex;
`;

interface BtnProps {
  onClick: () => void;
}
const AddModuleBtnTag = (props: BtnProps) => {
  return (
    <div className={"ml-15 mt-10 mb-10"}>
      <FButton
        type="edit"
        name="pin-outline"
        fill={colors.blanc}
        onClick={props.onClick}
      >
        {"Ajouter une carte interactive"}
      </FButton>
    </div>
  );
};
interface Props {
  dispositifContent: DispositifContent;
  keyValue: number;
  updateUIArray: (
    key: number,
    arg: number|null,
    variante: string,
    option?: boolean
  ) => void;
  handleContentClick: (key: number, editable: boolean, subkey?: number | undefined) => void;
  handleMenuChange: (ev: any, value?: any) => any;
  onEditorStateChange: (editorState: EditorState, key: number, subkey?: number | null) => void;
  addItem: (key: any, type?: string, subkey?: string | null) => void
  admin: boolean
  content: ShortContent
  showGeolocModal: boolean
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
  upcoming: () => void
}
const ContenuParagraphe = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const safeUiArray = (key: number, subkey: number, node: string) => {
    const children = props.uiArray[key]?.children;
    if (children === undefined) return false;
    return props.uiArray[key] &&
    children &&
    children.length > subkey &&
    children[subkey] &&
    //@ts-ignore
    children[subkey][node];
  }

  const cards = (props.dispositifContent.children || [])
    .filter((x) => x.type === "card")
    .map((x) => x.title || "");
  const darkColor =
    props.mainTag && props.mainTag.darkColor
      ? props.mainTag.darkColor
      : colors.darkColor;

  const lightColor =
    props.mainTag && props.mainTag.lightColor
      ? props.mainTag.lightColor
      : colors.lightColor;

  const nbChildren = (props.dispositifContent?.children || []).length;

  return (
    <div
      className={
        props.dispositifContent.type === "cards"
          ? "row " + styles.cards
          : "sous-paragraphe"
      }
      style={isMobile ? { overflowX: "auto", overflowY: "hidden" } : {}}
    >
      {isMobile && props.dispositifContent.type === "cards" && nbChildren > 1 && (
        <MobileInfoCardsSection>
          {(props.dispositifContent?.children || []).map(
            (subDispositifContent, i) => {
              return (
                <CardParagraphe
                  key={i}
                  subkey={i}
                  dispositifId={router.query.id as string}
                  subitem={subDispositifContent}
                  disableEdit={props.disableEdit}
                  changeTitle={props.changeTitle}
                  handleMenuChange={props.handleMenuChange}
                  changeAge={props.changeAge}
                  toggleFree={props.toggleFree}
                  changePrice={props.changePrice}
                  updateUIArray={props.updateUIArray}
                  toggleNiveau={props.toggleNiveau}
                  changeDepartements={props.changeDepartements}
                  deleteCard={props.deleteCard}
                  content={props.content}
                  keyValue={props.keyValue}
                  cards={cards}
                  mainTag={props.mainTag}
                  toggleTutorielModal={props.toggleTutorielModal}
                  admin={props.admin}
                  toggleGeolocModal={props.toggleGeolocModal}
                  showGeolocModal={props.showGeolocModal}
                  typeContenu={props.typeContenu}
                />
              );
            }
          )}
        </MobileInfoCardsSection>
      )}
      {(props.dispositifContent.children || []).map((subitem, index) => {
          const isAccordeonOpen = !!safeUiArray(
            props.keyValue,
            index,
            "accordion"
          );

          return (
            <div
              className={
                "sous-contenu-wrapper" +
                (subitem.type === "map"
                  ? " sous-contenu-map"
                  : (props.dispositifContent.title ===
                      "Comment je m'engage ?" ||
                      props.dispositifContent.title === "Et après ?") &&
                    nbChildren === index + 1
                  ? " mb-15 last-props.item"
                  : "") +
                (props.dispositifContent.type === "cards"
                  ? " sous-contenu-cards"
                  : "")
              }
              key={index}
            >
              {subitem.type === "card" && (!isMobile || nbChildren === 1) ? (
                <CardParagraphe
                  subkey={index}
                  subitem={subitem}
                  dispositifId={router.query.id as string}
                  disableEdit={props.disableEdit}
                  changeTitle={props.changeTitle}
                  handleMenuChange={props.handleMenuChange}
                  changeAge={props.changeAge}
                  toggleFree={props.toggleFree}
                  changePrice={props.changePrice}
                  updateUIArray={props.updateUIArray}
                  toggleNiveau={props.toggleNiveau}
                  changeDepartements={props.changeDepartements}
                  deleteCard={props.deleteCard}
                  content={props.content}
                  keyValue={props.keyValue}
                  cards={cards}
                  mainTag={props.mainTag}
                  toggleTutorielModal={props.toggleTutorielModal}
                  admin={props.admin}
                  toggleGeolocModal={props.toggleGeolocModal}
                  showGeolocModal={props.showGeolocModal}
                  typeContenu={props.typeContenu}
                />
              ) : subitem.type === "map" && !props.printing ? (
                <MapParagraphe
                  key={index}
                  subkey={index}
                  subitem={subitem}
                  disableEdit={props.disableEdit}
                  mainTag={props.mainTag}
                  showMapButton={props.showMapButton}
                  displayTuto={props.displayTuto}
                  updateUIArray={props.updateUIArray}
                  setMarkers={props.setMarkers}
                  keyValue={props.keyValue}
                  toggleShareContentOnMobileModal={props.toggleShareContentOnMobileModal}
                  toggleTutorielModal={props.toggleTutorielModal}
                  deleteCard={props.deleteCard}
                />
              ) : subitem.type === "map" && props.printing ? (
                <MapParagraphePrint
                  updateUIArray={props.updateUIArray}
                  subitem={subitem}
                  mainTag={props.mainTag}
                />
              ) : subitem.type === "etape" ? (
                <EtapeParagraphe
                  key={index}
                  subkey={index}
                  subitem={subitem}
                  item={props.dispositifContent}
                  handleContentClick={props.handleContentClick}
                  handleMenuChange={props.handleMenuChange}
                  onEditorStateChange={props.onEditorStateChange}
                  addItem={props.addItem}
                  removeItem={props.removeItem}
                  mainTag={props.mainTag}
                  typeContenu={props.typeContenu}
                  uiArray={props.uiArray}
                  upcoming={props.upcoming}
                  content={props.content}
                  keyValue={props.keyValue}
                  updateUIArray={props.updateUIArray}
                  disableEdit={props.disableEdit}
                  toggleModal={props.toggleModal}
                />
              ) : subitem.type === "accordion" ? (
                <div
                  key={index}
                  className={
                    "contenu" +
                    (safeUiArray(props.keyValue, index, "isHover")
                      ? " isHovered"
                      : "")
                  }
                  onMouseEnter={(e) =>
                    props.updateUIArray(
                      props.keyValue,
                      index,
                      "isHover",
                      true
                    )
                  }
                >
                  <Row className="relative-position">
                    <Col
                      lg="12"
                      md="12"
                      sm="12"
                      xs="12"
                      className="accordeon-col"
                    >
                      <div className="title-bloc">
                        <StyledAccordeon
                          isAccordeonOpen={isAccordeonOpen}
                          disableEdit={props.disableEdit}
                          lightColor={lightColor}
                          darkColor={darkColor}
                          subkey={index}
                          onMouseUp={() =>
                            props.disableEdit &&
                            props.updateUIArray(
                              props.keyValue,
                              index,
                              "accordion",
                              !safeUiArray(props.keyValue, index, "accordion")
                            )
                          }
                          aria-expanded={safeUiArray(
                            props.keyValue,
                            index,
                            "accordion"
                          )}
                          aria-controls={
                            "collapse" + props.keyValue + "-" + index
                          }
                        >
                          <StyledHeader darkColor={darkColor}>
                            <ContentEditable
                              id={props.keyValue+""}
                              data-subkey={index}
                              data-target="title"
                              html={subitem.title || ""} // innerHTML of the editable div
                              disabled={props.disableEdit} // use true to disable editing
                              onChange={props.handleMenuChange} // handle innerHTML change
                              onMouseUp={(e) =>
                                !props.disableEdit && e.stopPropagation()
                              }
                              placeholder={"Titre à remplacer"}
                            />
                            {props.disableEdit && (
                              <EVAIcon
                                name={
                                  "chevron-" +
                                  (safeUiArray(
                                    props.keyValue,
                                    index,
                                    "accordion"
                                  )
                                    ? "up"
                                    : "down") +
                                  "-outline"
                                }
                                size="large"
                                fill={darkColor}
                                className="ml-12"
                              />
                            )}
                          </StyledHeader>
                          {!props.disableEdit && index > 0 && (
                            <EVAIcon
                              onClick={() =>
                                props.removeItem(props.keyValue, index)
                              }
                              className="accordeon-delete-icon  cursor-pointer"
                              name="close-circle"
                              fill={colors.error}
                              size="xlarge"
                            />
                          )}
                        </StyledAccordeon>
                      </div>
                      <Collapse
                        className="contenu-accordeon"
                        isOpen={safeUiArray(
                          props.keyValue,
                          index,
                          "accordion"
                        )}
                        data-parent="#accordion"
                        id={"collapse" + props.keyValue + "-" + index}
                        aria-labelledby={
                          "heading" + props.keyValue + "-" + index
                        }
                      >
                        {
                          // display and edition of content
                          <EditableParagraph
                            keyValue={props.keyValue}
                            subkey={index}
                            target="content"
                            handleMenuChange={props.handleMenuChange}
                            onEditorStateChange={props.onEditorStateChange}
                            handleContentClick={props.handleContentClick}
                            disableEdit={props.disableEdit}
                            addItem={props.addItem}
                            type={subitem.type}
                            content={subitem.content}
                            editable={!!subitem.editable}
                            placeholder={subitem.placeholder}
                            editorState={subitem.editorState}
                          />
                        }
                      </Collapse>
                    </Col>
                    {props.disableEdit && !isMobile && (
                      <Col lg="2" md="2" sm="2" xs="2" className="toolbar-col">
                        <QuickToolbar
                          show={safeUiArray(props.keyValue, index, "isHover")}
                          keyValue={props.keyValue}
                          subkey={index}
                          disableEdit={props.disableEdit}
                          item={props.dispositifContent}
                          handleContentClick={props.handleContentClick}
                          toggleModal={props.toggleModal}
                          removeItem={props.removeItem}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              ) : (
                <>
                  {!isMobile && props.dispositifContent.type !== "cards" && (
                    <div
                      key={index}
                      className={
                        "contenu paragraphe" +
                        (safeUiArray(props.keyValue, index, "isHover")
                          ? " isHovered"
                          : "")
                      }
                      onMouseEnter={() =>
                        props.updateUIArray(props.keyValue, index, "isHover")
                      }
                    >
                      <Row className="relative-position">
                        <Col lg="12" md="12" sm="12" xs="12">
                          <h4>
                            <ContentEditable
                              id={props.keyValue+""}
                              data-subkey={index}
                              data-target="title"
                              className="display-inline-block"
                              html={subitem.title || ""} // innerHTML of the editable div
                              disabled={props.disableEdit} // use true to disable editing
                              onChange={props.handleMenuChange} // handle innerHTML change
                            />
                            {!props.disableEdit && (
                              <EVAIcon
                                onClick={() =>
                                  props.removeItem(props.keyValue, index)
                                }
                                className="delete-icon ml-10 cursor-pointer"
                                name="minus-circle-outline"
                                fill={colors.noir}
                              />
                            )}
                          </h4>
                          <EditableParagraph
                            keyValue={props.keyValue}
                            subkey={index}
                            target="content"
                            handleMenuChange={props.handleMenuChange}
                            onEditorStateChange={props.onEditorStateChange}
                            handleContentClick={props.handleContentClick}
                            disableEdit={props.disableEdit}
                            addItem={props.addItem}
                            type={subitem.type}
                            content={subitem.content}
                            editable={!!subitem.editable}
                            placeholder={subitem.placeholder}
                            editorState={subitem.editorState}
                          />
                          <br />
                        </Col>
                        {props.disableEdit && !isMobile && (
                          <Col
                            lg="2"
                            md="2"
                            sm="2"
                            xs="2"
                            className="toolbar-col"
                          >
                            <QuickToolbar
                              show={safeUiArray(
                                props.keyValue,
                                index,
                                "isHover"
                              )}
                              keyValue={props.keyValue}
                              subkey={index}
                              disableEdit={props.disableEdit}
                              item={props.dispositifContent}
                              handleContentClick={props.handleContentClick}
                              toggleModal={props.toggleModal}
                              removeItem={props.removeItem}
                            />
                          </Col>
                        )}
                      </Row>
                    </div>
                  )}
                  <div></div>
                </>
              )}
              {props.addMapBtn &&
              props.keyValue === 3 &&
              !props.disableEdit &&
              !(props.typeContenu === "demarche") ? (
                <AddModuleBtnTag
                  onClick={() => props.addItem(3, "map", nbChildren.toString())}
                />
              ) : null}
            </div>
          );
        })}

      {!props.disableEdit &&
        props.dispositifContent.type === "cards" &&
        props.dispositifContent.children &&
        props.dispositifContent.title === "C'est pour qui ?" &&
        props.typeContenu === "dispositif" &&
        // when all types of incards are displayed we do not want to add more
        cards.length < cardTitlesDispositif.length && (
          <PlusCard
            addItem={props.addItem}
            keyValue={props.keyValue}
            cards={cards}
            typeContenu={props.typeContenu}
            mainTag={props.mainTag}
          />
        )}

      {!props.disableEdit &&
        props.dispositifContent.type === "cards" &&
        props.dispositifContent.children &&
        props.dispositifContent.title === "C'est pour qui ?" &&
        props.typeContenu === "demarche" &&
        // when all types of incards are displayed we do not want to add more
        // we need to filter because on old demarches there may be other types of infocards not used anymore
        cards.filter((card) => infocardsDemarcheTitles.includes(card)).length <
          cardTitlesDemarche.length && (
          <PlusCard
            addItem={props.addItem}
            keyValue={props.keyValue}
            cards={cards}
            typeContenu={props.typeContenu}
            mainTag={props.mainTag}
          />
        )}
      {props.disableEdit &&
        isMobile &&
        (props.dispositifContent.title === "Comment je m'engage ?" ||
          props.dispositifContent.title === "Et après ?") &&
        props.dispositifContent.children &&
        props.dispositifContent.children[nbChildren - 1] &&
        props.dispositifContent.children[nbChildren - 1].type !== "map" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: 10,
            }}
          >
            <FButton
              type="outline-black"
              name={"share-outline"}
              onClick={props.toggleShareContentOnMobileModal}
            >
              {t("Dispositif.Partager Fiche", "Partager la fiche")}
            </FButton>
          </div>
        )}
    </div>
  );
};

export default ContenuParagraphe;
