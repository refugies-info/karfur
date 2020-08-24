import React from "react";
import { Col, Row, Collapse } from "reactstrap";
import ContentEditable from "react-contenteditable";

import EditableParagraph from "../EditableParagraph/EditableParagraph";
import { QuickToolbar } from "../../../../containers/Dispositif/QuickToolbar";
import {
  CardParagraphe,
  PlusCard,
} from "../../../../containers/Dispositif/CardParagraphe";
import MapParagraphe from "../../../../containers/Dispositif/MapParagraphe/MapParagraphe";
import EtapeParagraphe from "../../../../containers/Dispositif/EtapeParagraphe/EtapeParagraphe";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";

import variables from "scss/colors.scss";
import { cardTitles } from "../../../../containers/Dispositif/data";

const contenuParagraphe = (props) => {
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
  return (
    <div className={item.type === "cards" ? "row cards" : "sous-paragraphe"}>
      {item.children &&
        item.children.map((subitem, subkey) => {
          const newDisableEdit =
            disableEdit ||
            (props.typeContenu === "demarche" &&
              props.inVariante &&
              !safeUiArray(props.keyValue, subkey, "varianteSelected"));
          return (
            <div
              className={
                "sous-contenu-wrapper" +
                (item.type === "cards" ? " sous-contenu-cards" : "") +
                (props.inVariante && disableEdit
                  ? " in-variante" +
                    (safeUiArray(props.keyValue, subkey, "varianteSelected")
                      ? " variante-selected"
                      : "")
                  : "")
              }
              key={subkey}
            >
              {props.inVariante && disableEdit && (
                <div className="variante-radio variante-paragraphe">
                  <div
                    className="radio-btn"
                    onClick={() =>
                      props.updateUIArray(
                        props.keyValue,
                        subkey,
                        "varianteSelected",
                        !safeUiArray(props.keyValue, subkey, "varianteSelected")
                      )
                    }
                  >
                    {safeUiArray(
                      props.keyValue,
                      subkey,
                      "varianteSelected"
                    ) && <div className="active-inset" />}
                  </div>
                </div>
              )}
              {subitem.type === "card" ? (
                <CardParagraphe
                  subkey={subkey}
                  subitem={subitem}
                  disableEdit={newDisableEdit}
                  changeTitle={bprops.changeTitle}
                  handleMenuChange={bprops.handleMenuChange}
                  changeAge={bprops.changeAge}
                  toggleFree={bprops.toggleFree}
                  changePrice={bprops.changePrice}
                  updateUIArray={bprops.updateUIArray}
                  toggleNiveau={bprops.toggleNiveau}
                  deleteCard={bprops.deleteCard}
                  content={bprops.content}
                  keyValue={bprops.keyValue}
                  cards={cards}
                  mainTag={bprops.mainTag}
                />
              ) : subitem.type === "map" ? (
                <MapParagraphe
                  key={subkey}
                  subkey={subkey}
                  subitem={subitem}
                  disableEdit={newDisableEdit}
                  {...bprops}
                />
              ) : subitem.type === "etape" ? (
                <EtapeParagraphe
                  key={subkey}
                  subkey={subkey}
                  subitem={subitem}
                  tutoriel={item.tutoriel}
                  disableEdit={newDisableEdit}
                  {...bprops}
                />
              ) : subitem.type === "accordion" ? (
                <div
                  key={subkey}
                  className={
                    "contenu" +
                    (!props.inVariante &&
                    safeUiArray(props.keyValue, subkey, "isHover")
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
                        <div
                          id="accordion-header"
                          className={
                            "text-left " +
                            (safeUiArray(props.keyValue, subkey, "accordion")
                              ? "active"
                              : "inactive")
                          }
                          onMouseUp={() =>
                            newDisableEdit &&
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
                          <h5>
                            <span className="accordion-text">
                              <ContentEditable
                                id={props.keyValue}
                                data-subkey={subkey}
                                data-target="title"
                                html={subitem.title || ""} // innerHTML of the editable div
                                disabled={newDisableEdit} // use true to disable editing
                                onChange={props.handleMenuChange} // handle innerHTML change
                                onMouseUp={(e) =>
                                  !newDisableEdit && e.stopPropagation()
                                }
                              />
                            </span>
                            {newDisableEdit && (
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
                                fill={variables.darkColor}
                              />
                            )}
                          </h5>
                          {!newDisableEdit && subkey > 0 && (
                            <EVAIcon
                              onClick={() =>
                                props.removeItem(props.keyValue, subkey)
                              }
                              className="accordeon-delete-icon ml-10 cursor-pointer"
                              name="close-circle"
                              fill={variables.error}
                              size="xlarge"
                            />
                          )}
                        </div>
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
                            disableEdit={newDisableEdit}
                            tutoriel={item.tutoriel}
                            addItem={props.addItem}
                            {...subitem}
                          />
                        }
                      </Collapse>
                    </Col>
                    {!props.sideView && !props.inVariante && newDisableEdit && (
                      <Col lg="2" md="2" sm="2" xs="2" className="toolbar-col">
                        <QuickToolbar
                          show={safeUiArray(props.keyValue, subkey, "isHover")}
                          keyValue={props.keyValue}
                          subkey={subkey}
                          disableEdit={newDisableEdit}
                          {...bprops}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              ) : (
                <div
                  key={subkey}
                  className={
                    "contenu paragraphe borderColor-darkColor" +
                    (!props.inVariante &&
                    safeUiArray(props.keyValue, subkey, "isHover")
                      ? " isHovered"
                      : "")
                  }
                  onMouseEnter={() =>
                    props.updateUIArray(props.keyValue, subkey, "isHover")
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
                          disabled={newDisableEdit} // use true to disable editing
                          onChange={props.handleMenuChange} // handle innerHTML change
                        />
                        {!newDisableEdit && (
                          <EVAIcon
                            onClick={() =>
                              props.removeItem(props.keyValue, subkey)
                            }
                            className="delete-icon ml-10 cursor-pointer"
                            name="minus-circle-outline"
                            fill={variables.noir}
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
                        disableEdit={newDisableEdit}
                        tutoriel={item.tutoriel}
                        addItem={props.addItem}
                        {...subitem}
                      />
                      <br />
                    </Col>
                    {!props.sideView && !props.inVariante && newDisableEdit && (
                      <Col lg="2" md="2" sm="2" xs="2" className="toolbar-col">
                        <QuickToolbar
                          show={safeUiArray(props.keyValue, subkey, "isHover")}
                          keyValue={props.keyValue}
                          subkey={subkey}
                          disableEdit={newDisableEdit}
                          {...bprops}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              )}
              {props.addMapBtn && props.keyValue === 3 && !props.disableEdit ? (
                <AddModuleBtn
                  addItem={props.addItem}
                  subkey={item.children ? item.children.length : 0}
                />
              ) : null}
            </div>
          );
        })}

      {!props.disableEdit &&
        item.type === "cards" &&
        item.children &&
        item.title === "C'est pour qui ?" &&
        // when all types of incards are displayed we do not want to add more
        cards.length < cardTitles.length && (
          <PlusCard
            addItem={props.addItem}
            keyValue={props.keyValue}
            cards={cards}
          />
        )}
    </div>
  );
};

const AddModuleBtn = (props) => {
  return (
    <div className="plus-wrapper ml-15">
      <FButton
        onClick={() => props.addItem(3, "map", props.subkey)}
        type="dark"
        name="plus-circle-outline"
        className="mt-10"
      >
        Ajouter un point de contacte
      </FButton>
    </div>
  );
};

export default contenuParagraphe;
