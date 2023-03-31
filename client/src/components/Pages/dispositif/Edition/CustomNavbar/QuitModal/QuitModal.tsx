import React, { useMemo } from "react";
import { Col, Row } from "reactstrap";
import Image from "next/image";
import Button from "components/UI/Button";
import { BaseModal } from "components/Pages/dispositif";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import QuitImage from "assets/dispositif/quit-image.svg";
import styles from "./QuitModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onQuit: () => void;
}

const DeleteContentModal = (props: Props) => {
  const icon = useMemo(
    () => (
      <EVAIcon
        name="arrow-forward-outline"
        fill={styles.lightTextActionHighBlueFrance}
        size={16}
        className={styles.icon}
      />
    ),
    [],
  );
  return (
    <BaseModal show={props.show} toggle={props.toggle} title="Vous allez quitter l’éditeur de fiches" small>
      <div>
        <Row className={styles.content}>
          <Col>
            <ul className={styles.list}>
              <li>{icon} Votre fiche va être enregistrée dans vos brouillons.</li>
              <li>{icon} Tant qu’elle est en brouillon, elle est visible uniquement par vous.</li>
              <li>
                {icon} Vous devrez la valider pour qu’elle puisse être envoyée à notre équipe pour relecture, puis
                publiée.
              </li>
            </ul>
          </Col>
          <Col xs="auto">
            <Image src={QuitImage} width={128} height={200} alt="" className="mt-3" />
          </Col>
        </Row>

        <div className="text-end">
          <Button secondary onClick={props.toggle} icon="arrow-forward-outline" iconPlacement="end" className="me-2">
            Rester dans l'éditeur
          </Button>
          <Button onClick={props.onQuit} icon="log-out-outline" iconPlacement="end">
            Quitter et finir plus tard
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteContentModal;
