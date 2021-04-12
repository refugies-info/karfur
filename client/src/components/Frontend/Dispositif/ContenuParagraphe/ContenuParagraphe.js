import React, { useState } from "react";
import { Col, Row, Collapse } from "reactstrap";
import ContentEditable from "react-contenteditable";
import EditableParagraph from "../EditableParagraph/EditableParagraph";
import { QuickToolbar } from "../../../../containers/Dispositif/QuickToolbar";
import {
  CardParagraphe,
  PlusCard,
} from "../../../../containers/Dispositif/CardParagraphe";
import MapParagraphe from "../../../../containers/Dispositif/MapParagraphe/MapParagraphe";
import MapParagraphePrint from "../../../../containers/Dispositif/MapParagraphe/MapParagraphePrint";
import EtapeParagraphe from "../../../../containers/Dispositif/EtapeParagraphe/EtapeParagraphe";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";
import { colors } from "colors";
import {
  cardTitlesDispositif,
  cardTitlesDemarche,
} from "../../../../containers/Dispositif/data";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { infocardsDemarcheTitles } from "../../../../containers/Dispositif/data";
import { isMobile } from "react-device-detect";

const StyledAccordeon = styled.div`
  padding: ${(props) =>
    props.disableEdit || props.subkey === 0 ? "16px" : "16px 62px 16px 16px"};

  border: ${(props) =>
    props.disableEdit && props.isAccordeonOpen
      ? `solid 2px ${props.darkColor}`
      : "none"};
  background: ${(props) =>
    props.disableEdit && props.isAccordeonOpen ? props.lightColor : "#f2f2f2"};
  border-radius: 12px;
  outline: none;
  boxshadow: none;
  cursor: pointer;
  display: flex;
  position: relative;
  flex-direction: row;
  box-shadow: ${(props) =>
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
  color: ${(props) => props.darkColor};
`;

const contenuParagraphe = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === props.item.children.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? props.item.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const { disableEdit, ...bprops } = props;
  const item = props.item;
  const safeUiArray = (key, subkey, node) =>
    props.uiArray[key] &&
    props.uiArray[key].children &&
    props.uiArray[key].children.length > subkey &&
    props.uiArray[key].children[subkey] &&
    props.uiArray[key].children[subkey][node];

  const cards = item.children
    ? item.children.filter((x) => x.type === "card").map((x) => x.title)
    : [];
  const darkColor =
    props.mainTag && props.mainTag.darkColor
      ? props.mainTag.darkColor
      : colors.darkColor;

  const lightColor =
    props.mainTag && props.mainTag.lightColor
      ? props.mainTag.lightColor
      : colors.lightColor;

  return (
    <div className={item.type === "cards" ? "row cards" : "sous-paragraphe"}>
      {isMobile && item.type === "cards" && item.children.length > 1 && (
        <div className={"sous-contenu-wrapper sous-contenu-cards"}>
          <Carousel activeIndex={activeIndex} next={next} previous={previous}>
            <CarouselIndicators
              items={item.children}
              activeIndex={activeIndex}
              onClickHandler={goToIndex}
            />
            {item.children &&
              item.children.map((subitem, subkey) => {
                return (
                  <CarouselItem
                    onExiting={() => setAnimating(true)}
                    onExited={() => setAnimating(false)}
                    key={item}
                  >
                    <CardParagraphe
                      location={props.location}
                      subkey={subkey}
                      subitem={subitem}
                      disableEdit={disableEdit}
                      changeTitle={bprops.changeTitle}
                      handleMenuChange={bprops.handleMenuChange}
                      changeAge={bprops.changeAge}
                      toggleFree={bprops.toggleFree}
                      changePrice={bprops.changePrice}
                      updateUIArray={bprops.updateUIArray}
                      toggleNiveau={bprops.toggleNiveau}
                      changeDepartements={bprops.changeDepartements}
                      deleteCard={bprops.deleteCard}
                      content={bprops.content}
                      keyValue={bprops.keyValue}
                      cards={cards}
                      mainTag={bprops.mainTag}
                      toggleTutorielModal={props.toggleTutorielModal}
                      admin={props.admin}
                      toggleGeolocModal={props.toggleGeolocModal}
                      showGeolocModal={props.showGeolocModal}
                      typeContenu={props.typeContenu}
                    />

                    <CarouselCaption
                      captionText={item.caption}
                      captionHeader={item.caption}
                    />
                  </CarouselItem>
                );
              })}
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={previous}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={next}
            />
          </Carousel>
        </div>
      )}
      {item.children &&
        item.children.map((subitem, subkey) => {
          const childrenLength = item.children.length;
          const isAccordeonOpen = !!safeUiArray(
            props.keyValue,
            subkey,
            "accordion"
          );

          return (
            <div
              className={
                "sous-contenu-wrapper" +
                (subitem.type === "map"
                  ? " sous-contenu-map"
                  : item.title === "Comment je m'engage ?" &&
                    childrenLength === subkey + 1
                  ? " mb-15"
                  : "") +
                (item.type === "cards" ? " sous-contenu-cards" : "")
              }
              key={subkey}
            >
              {subitem.type === "card" &&
              (!isMobile || item.children.length === 1) ? (
                <CardParagraphe
                  location={props.location}
                  subkey={subkey}
                  subitem={subitem}
                  disableEdit={disableEdit}
                  changeTitle={bprops.changeTitle}
                  handleMenuChange={bprops.handleMenuChange}
                  changeAge={bprops.changeAge}
                  toggleFree={bprops.toggleFree}
                  changePrice={bprops.changePrice}
                  updateUIArray={bprops.updateUIArray}
                  toggleNiveau={bprops.toggleNiveau}
                  changeDepartements={bprops.changeDepartements}
                  deleteCard={bprops.deleteCard}
                  content={bprops.content}
                  keyValue={bprops.keyValue}
                  cards={cards}
                  mainTag={bprops.mainTag}
                  toggleTutorielModal={props.toggleTutorielModal}
                  admin={props.admin}
                  toggleGeolocModal={props.toggleGeolocModal}
                  showGeolocModal={props.showGeolocModal}
                  typeContenu={props.typeContenu}
                />
              ) : subitem.type === "map" && !bprops.printing ? (
                <MapParagraphe
                  key={subkey}
                  subkey={subkey}
                  subitem={subitem}
                  disableEdit={disableEdit}
                  {...bprops}
                />
              ) : subitem.type === "map" && bprops.printing ? (
                <MapParagraphePrint
                  key={subkey}
                  subkey={subkey}
                  subitem={subitem}
                  disableEdit={disableEdit}
                  {...bprops}
                />
              ) : subitem.type === "etape" ? (
                <EtapeParagraphe
                  key={subkey}
                  subkey={subkey}
                  subitem={subitem}
                  tutoriel={item.tutoriel}
                  disableEdit={disableEdit}
                  {...bprops}
                />
              ) : subitem.type === "accordion" ? (
                <div
                  key={subkey}
                  className={
                    "contenu" +
                    (safeUiArray(props.keyValue, subkey, "isHover")
                      ? " isHovered"
                      : "")
                  }
                  onMouseEnter={(e) =>
                    props.updateUIArray(
                      props.keyValue,
                      subkey,
                      "isHover",
                      true,
                      e
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
                          disableEdit={disableEdit}
                          lightColor={lightColor}
                          darkColor={darkColor}
                          subkey={subkey}
                          onMouseUp={() =>
                            disableEdit &&
                            props.updateUIArray(
                              props.keyValue,
                              subkey,
                              "accordion",
                              !safeUiArray(props.keyValue, subkey, "accordion")
                            )
                          }
                          aria-expanded={safeUiArray(
                            props.keyValue,
                            subkey,
                            "accordion"
                          )}
                          aria-controls={
                            "collapse" + props.keyValue + "-" + subkey
                          }
                        >
                          <StyledHeader darkColor={darkColor}>
                            <ContentEditable
                              id={props.keyValue}
                              data-subkey={subkey}
                              data-target="title"
                              html={subitem.title || ""} // innerHTML of the editable div
                              disabled={disableEdit} // use true to disable editing
                              onChange={props.handleMenuChange} // handle innerHTML change
                              onMouseUp={(e) =>
                                !disableEdit && e.stopPropagation()
                              }
                              placeholder={"Titre à remplacer"}
                            />
                            {disableEdit && (
                              <EVAIcon
                                name={
                                  "chevron-" +
                                  (safeUiArray(
                                    props.keyValue,
                                    subkey,
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
                          {!disableEdit && subkey > 0 && (
                            <EVAIcon
                              onClick={() =>
                                props.removeItem(props.keyValue, subkey)
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
                          subkey,
                          "accordion"
                        )}
                        data-parent="#accordion"
                        id={"collapse" + props.keyValue + "-" + subkey}
                        aria-labelledby={
                          "heading" + props.keyValue + "-" + subkey
                        }
                      >
                        {
                          // display and edition of content
                          <EditableParagraph
                            keyValue={props.keyValue}
                            subkey={subkey}
                            target="content"
                            handleMenuChange={props.handleMenuChange}
                            onEditorStateChange={props.onEditorStateChange}
                            handleContentClick={props.handleContentClick}
                            disableEdit={disableEdit}
                            tutoriel={item.tutoriel}
                            addItem={props.addItem}
                            {...subitem}
                          />
                        }
                      </Collapse>
                    </Col>
                    {!props.sideView && disableEdit && !isMobile && (
                      <Col lg="2" md="2" sm="2" xs="2" className="toolbar-col">
                        <QuickToolbar
                          show={safeUiArray(props.keyValue, subkey, "isHover")}
                          keyValue={props.keyValue}
                          subkey={subkey}
                          disableEdit={disableEdit}
                          {...bprops}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              ) : (
                <>
                  {!isMobile &&
                    item.type !==
                      "cards"(
                        <div
                          key={subkey}
                          className={
                            "contenu paragraphe" +
                            (safeUiArray(props.keyValue, subkey, "isHover")
                              ? " isHovered"
                              : "")
                          }
                          onMouseEnter={() =>
                            props.updateUIArray(
                              props.keyValue,
                              subkey,
                              "isHover"
                            )
                          }
                        >
                          <Row className="relative-position">
                            <Col lg="12" md="12" sm="12" xs="12">
                              <h4>
                                <ContentEditable
                                  id={props.keyValue}
                                  data-subkey={subkey}
                                  data-target="title"
                                  className="display-inline-block"
                                  html={subitem.title || ""} // innerHTML of the editable div
                                  disabled={disableEdit} // use true to disable editing
                                  onChange={props.handleMenuChange} // handle innerHTML change
                                />
                                {!disableEdit && (
                                  <EVAIcon
                                    onClick={() =>
                                      props.removeItem(props.keyValue, subkey)
                                    }
                                    className="delete-icon ml-10 cursor-pointer"
                                    name="minus-circle-outline"
                                    fill={colors.noir}
                                  />
                                )}
                              </h4>
                              <EditableParagraph
                                keyValue={props.keyValue}
                                subkey={subkey}
                                target="content"
                                handleMenuChange={props.handleMenuChange}
                                onEditorStateChange={props.onEditorStateChange}
                                handleContentClick={props.handleContentClick}
                                disableEdit={disableEdit}
                                tutoriel={item.tutoriel}
                                addItem={props.addItem}
                                {...subitem}
                              />
                              <br />
                            </Col>
                            {!props.sideView && disableEdit && !isMobile && (
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
                                    subkey,
                                    "isHover"
                                  )}
                                  keyValue={props.keyValue}
                                  subkey={subkey}
                                  disableEdit={disableEdit}
                                  {...bprops}
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
                <AddMoudleBtnTag
                  addItem={props.addItem}
                  subkey={item.children ? item.children.length : 0}
                  tag={props.mainTag}
                />
              ) : null}
            </div>
          );
        })}

      {!props.disableEdit &&
        item.type === "cards" &&
        item.children &&
        item.title === "C'est pour qui ?" &&
        props.typeContenu === "dispositif" &&
        // when all types of incards are displayed we do not want to add more
        cards.length < cardTitlesDispositif.length && (
          <PlusCard
            addItem={props.addItem}
            keyValue={props.keyValue}
            cards={cards}
            typeContenu={props.typeContenu}
          />
        )}

      {!props.disableEdit &&
        item.type === "cards" &&
        item.children &&
        item.title === "C'est pour qui ?" &&
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
          />
        )}
      {props.disableEdit &&
        isMobile &&
        (item.title === "Comment je m'engage ?" ||
          item.title === "Et après ?") &&
        item.children &&
        item.children[item.children.length - 1] &&
        item.children[item.children.length - 1].type !== "map" && (
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
              className="ml-10"
              onClick={props.toggleShareContentOnMobileModal}
            >
              {props.t("Dispositif.Partager Fiche", "Partager la fiche")}
            </FButton>
          </div>
        )}
    </div>
  );
};

const AddMoudleBtnTag = (props) => {
  return (
    <div className={"ml-15 mt-10 mb-10"}>
      <FButton
        type="edit"
        name="pin-outline"
        fill={colors.blanc}
        onClick={() => props.addItem(3, "map", props.subkey)}
      >
        {"Ajouter une carte interactive"}
      </FButton>
    </div>
  );
};

export default withRouter(contenuParagraphe);
