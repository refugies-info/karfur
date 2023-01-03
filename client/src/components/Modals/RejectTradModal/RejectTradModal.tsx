import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, ListGroup, ListGroupItem } from "reactstrap";
import Swal from "sweetalert2";
import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import API from "utils/API";
import marioProfile from "assets/mario-profile.jpg";
import { colors } from "colors";
import styles from "./RejectTradModal.module.scss";
import Image from "next/legacy/image";

const reasons = [
  {
    text: "Le vocabulaire est trop complexe"
  },
  {
    text: "La modification induit un contresens"
  },
  {
    text: "L’information proposée est fausse "
  },
  {
    text: "L’information proposée est obsolète"
  }
];

interface Props {
  name: string;
  show: boolean;
  toggle: any;
  removeTranslation: any;
  currIdx: number;
  selectedTrad: any;
  userId: any;
}

const RejectTradModal = (props: Props) => {
  const [clicked, setClicked] = useState(new Array(5).fill(false));
  const [message, setMessage] = useState("");

  const selectReason = (idx: number) => setClicked(clicked.map((x, i) => (i === idx ? !x : false)));
  const handleChange = (e: any) => setMessage(e.target.value);

  const onReject = () => {
    if (!clicked.includes(true)) {
      Swal.fire({
        title: "Oh non",
        text: "Aucune option n'a été sélectionnée, veuillez rééssayer",
        type: "error",
        timer: 1500
      });
      return;
    }
    const selectedR = clicked.findIndex((x) => x === true);
    const newTrad = {
      _id: props.selectedTrad._id,
      translatedText: {
        ...props.selectedTrad.translatedText,
        status: {
          ...(props.selectedTrad.translatedText.status || {}),
          [props.currIdx]: "Rejetée"
        },
        feedbacks: {
          ...(props.selectedTrad.translatedText.feedback || {}),
          [props.currIdx]: [message && message !== "" ? message : reasons[selectedR].text]
        }
      }
    };
    API.update_tradForReview(newTrad).then(() => {
      props.removeTranslation(props.selectedTrad);
      props.toggle();
    });
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalBody className={styles.modal_body}>
        <h5>Refusé</h5> <span>Choisissez une raison ou rédigez un message :</span>
        <ListGroup className={styles.list_group}>
          {reasons.map((r, key) => (
            <ListGroupItem
              tag="button"
              action
              key={key}
              onClick={() => selectReason(key)}
              active={clicked[key]}
              className={styles.list_group_item}
            >
              <EVAIcon name={"radio-button-" + (clicked[key] ? "on" : "off")} fill={colors.gray90} className="me-2" />
              {r.text}
            </ListGroupItem>
          ))}
          <ListGroupItem
            tag="button"
            action
            key={reasons.length}
            onClick={() => selectReason(reasons.length)}
            active={clicked[reasons.length]}
          >
            <EVAIcon
              name={"radio-button-" + (clicked[reasons.length] ? "on" : "off")}
              fill={colors.gray90}
              className="me-2"
            />
            <span>Message personnalisé à : </span>
            <div className="me-2">
              <Image
                src={(props.userId.picture || {}).secure_url || marioProfile}
                className="profile-img-pin"
                alt="profile"
                width={40}
                height={40}
              />
            </div>
            <b>{props.userId.username}</b>
          </ListGroupItem>
        </ListGroup>
        {clicked[reasons.length] && (
          <textarea
            id="message"
            name="message"
            rows={7}
            cols={33}
            value={message}
            onChange={handleChange}
            placeholder="Message personnalisé"
          />
        )}
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        <div>
          <FButton type="light-action" className="me-2" onClick={props.toggle}>
            Annuler
          </FButton>
          <FButton
            type="validate"
            name="checkmark-circle-outline"
            onClick={onReject}
            disabled={!clicked.includes(true) || (clicked[reasons.length] && (!message || message === ""))}
          >
            Envoyer
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default RejectTradModal;
