import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import Swal from "sweetalert2";

import FButton from "../../FigmaUI/FButton/FButton";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import API from "../../../utils/API";
import marioProfile from "../../../assets/mario-profile.jpg";

// import "./RejectTradModal.scss";
import {colors} from "colors";

const reasons = [
  {
    text: "Le vocabulaire est trop complexe",
  },
  {
    text: "La modification induit un contresens",
  },
  {
    text: "L’information proposée est fausse ",
  },
  {
    text: "L’information proposée est obsolète",
  },
];

class RejectTradModal extends Component {
  state = {
    clicked: new Array(5).fill(false),
    message: "",
  };

  selectReason = (idx) =>
    this.setState((pS) => ({
      clicked: pS.clicked.map((x, i) => (i === idx ? !x : false)),
    }));
  handleChange = (e) => this.setState({ message: e.target.value });

  onReject = () => {
    const { clicked, message } = this.state,
      { selectedTrad, currIdx } = this.props;
    if (!clicked.includes(true)) {
      Swal.fire({
        title: "Oh non",
        text: "Aucune option n'a été sélectionnée, veuillez rééssayer",
        type: "error",
        timer: 1500,
      });
      return;
    }
    const selectedR = clicked.findIndex((x) => x === true);
    const newTrad = {
      _id: selectedTrad._id,
      translatedText: {
        ...selectedTrad.translatedText,
        status: {
          ...(selectedTrad.translatedText.status || {}),
          [currIdx]: "Rejetée",
        },
        feedbacks: {
          ...(selectedTrad.translatedText.feedback || {}),
          [currIdx]: [
            message && message !== "" ? message : reasons[selectedR].text,
          ],
        },
      },
    };
    API.update_tradForReview(newTrad).then(() => {
      this.props.removeTranslation(selectedTrad);
      this.props.toggle();
    });
  };

  render() {
    const { show, toggle, userId } = this.props;
    const { clicked, message } = this.state;
    return (
      <Modal isOpen={show} toggle={toggle} className="reject-trad-modal">
        {/* <ModalHeader toggle={toggle}>
          {selection ? "Droits d’édition" : "Confirmation"}
        </ModalHeader> */}
        <ModalBody>
          <h5>Refusé</h5>{" "}
          <span>Choisissez une raison ou rédigez un message :</span>
          <ListGroup>
            {reasons.map((r, key) => (
              <ListGroupItem
                tag="button"
                action
                key={key}
                onClick={() => this.selectReason(key)}
                active={clicked[key]}
              >
                <EVAIcon
                  name={"radio-button-" + (clicked[key] ? "on" : "off")}
                  fill={colors.noir}
                  className="mr-10"
                />
                {r.text}
              </ListGroupItem>
            ))}
            <ListGroupItem
              tag="button"
              action
              key={reasons.length}
              onClick={() => this.selectReason(reasons.length)}
              active={clicked[reasons.length]}
            >
              <EVAIcon
                name={
                  "radio-button-" + (clicked[reasons.length] ? "on" : "off")
                }
                fill={colors.noir}
                className="mr-10"
              />
              <span>Message personnalisé à : </span>
              <img
                src={(userId.picture || {}).secure_url || marioProfile}
                className="profile-img-pin mr-10"
                alt="profile"
              />
              <b>{userId.username}</b>
            </ListGroupItem>
          </ListGroup>
          {clicked[reasons.length] && (
            <textarea
              id="message"
              name="message"
              rows="7"
              cols="33"
              value={message}
              onChange={this.handleChange}
              placeholder="Message personnalisé"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <div className="footer-btns">
            {/* <FButton type="outline-black" name="flag-outline" onClick={this.signaler} disabled={!(this.props.translated || {}).body} fill={colors.noir} className="mr-10">
            Signaler
          </FButton> */}
            <FButton type="light-action" className="mr-10" onClick={toggle}>
              Annuler
            </FButton>
            <FButton
              type="validate"
              name="checkmark-circle-outline"
              onClick={this.onReject}
              disabled={
                !clicked.includes(true) ||
                (clicked[reasons.length] && (!message || message === ""))
              }
            >
              Envoyer
            </FButton>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RejectTradModal;
