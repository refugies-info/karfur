import React from "react";
import { Col, Row } from "reactstrap";
import { withTranslation } from "react-i18next";

import EditableParagraph from "../EditableParagraph/EditableParagraph";
import QuickToolbar from "../../../../containers/Dispositif/QuickToolbar/QuickToolbar";
import ContenuParagraphe from "../ContenuParagraphe/ContenuParagraphe";

const contenuDispositif = (props) => {
  const { t, disableEdit, inVariante } = props;
  return props.menu.map((item, key) => {
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
                  {...item}
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
                    {...props}
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
    } else {
      return false;
    }
  });
};

export default withTranslation()(contenuDispositif);
