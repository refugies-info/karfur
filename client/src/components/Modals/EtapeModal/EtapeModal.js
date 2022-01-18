import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import {
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Label,
  Input,
} from "reactstrap";
import _ from "lodash";
import ContentEditable from "react-contenteditable";
import ReactToPrint from "react-to-print";

import Modal from "../Modal";
import FButton from "../../FigmaUI/FButton/FButton";

// import "./EtapeModal.scss";
import {colors} from "colors";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

class EtapeModal extends Component {
  state = {
    checked: [],
  };
  modalRef = React.createRef();

  componentDidMount() {
    const newLength = _.get(this.props, "subitem.papiers", []).length;
    this.setState({ checked: new Array(newLength).fill(false) });
  }
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const newLength = _.get(nextProps, "subitem.papiers", []).length;
    if (newLength !== this.state.checked.length) {
      this.setState({ checked: new Array(newLength).fill(false) });
    }
  }

  handleCheck = (idx) =>
    this.setState((pS) => ({
      checked: pS.checked.map((x, i) => (i === idx ? !x : x)),
    }));

  handleCtaClick = () => {
    const option = (this.props.subitem || {}).option || {};
    switch (option.texte) {
      case "En ligne":
        window.open(
          (option.value1.indexOf("http") > -1 ? "" : "http://") + option.value1,
          "_blank"
        );
        break;
      case "En physique":
        this.props.upcoming();
        break;
      default:
      //
    }
  };

  render() {
    const { t, content, subkey } = this.props;
    const { checked } = this.state;
    const subitem = this.props.subitem || {};
    const option = subitem.option || {};
    const array1 = ["En ligne", "En physique", "Par téléphone"];
    const displayedText = array1.includes(option.texte)
      ? option.value1
      : option.texte === "Par courrier"
      ? [option.value1, option.value2, option.value3, option.value4].join(", ")
      : [option.value1, option.value2].join(" : ");
    return (
      <Modal
        className="etape-modal"
        modalHeader={
          <>
            <div className="title-wrapper">
              <span className="bigger-header">{content.titreInformatif}</span>
              <span className="smaller-header">
                Étape #{subkey + 1} - {subitem.title}
              </span>
            </div>
            <ReactToPrint
              trigger={() => (
                <FButton
                  type="light-action"
                  name="printer-outline"
                  fill={colors.noir}
                >
                  {t("Dispositif.Imprimer", "Imprimer")}
                </FButton>
              )}
              content={() => this.modalRef.current}
            />
          </>
        }
        modalRef={this.modalRef}
        {...this.props}
      >
        <ModalBody>
          <h5>{option.modalHeader}</h5>
          <div className="info-wrapper" onClick={this.handleCtaClick}>
            <h5>
              {displayedText}
              <div
                className="copy-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(displayedText);
                }}
              >
                <EVAIcon name="copy-outline" fill={colors.noir} />
              </div>
            </h5>
          </div>

          {subitem.papiers && subitem.papiers.length > 0 && (
            <>
              <h5>Documents nécessaires ({subitem.papiers.length})</h5>
              <ListGroup>
                {subitem.papiers.map((papier, idx) => {
                  if (checked[idx] !== undefined) {
                    return (
                      <ListGroupItem
                        key={idx}
                        className={checked[idx] ? "checked" : "unchecked"}
                      >
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={checked[idx]}
                            onChange={() => this.handleCheck(idx)}
                          />{" "}
                          <span>{papier.texte}</span>
                        </Label>
                      </ListGroupItem>
                    );
                  }
                  return false;
                })}
              </ListGroup>
            </>
          )}

          <h5>Précisions</h5>
          <div className="texte-very-small">
            <ContentEditable
              className="animated fadeIn"
              html={subitem.content || ""}
              disabled={true}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <FButton
            type="help"
            name="question-mark-circle-outline"
            fill={colors.error}
            onClick={this.props.upcoming}
          >
            {t("J'ai besoin d'aide")}
          </FButton>
          <FButton
            type="validate"
            name="checkmark-outline"
            onClick={this.props.toggle}
            fill={colors.noir}
          >
            {t("Dispositif.compris", "Ok, j’ai compris")}
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withTranslation()(EtapeModal);
