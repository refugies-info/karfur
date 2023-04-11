import React, { useMemo } from "react";
import { Col, Row } from "reactstrap";
import Image from "next/image";
import { DispositifStatus } from "api-types";
import { isStatus } from "lib/dispositif";
import Button from "components/UI/Button";
import { BaseModal } from "components/Pages/dispositif";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import QuitImage from "assets/dispositif/quit-image.svg";
import { contents } from "./data";
import styles from "./QuitModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onQuit: () => void;
  onPublish: () => void;
  status: DispositifStatus | null;
  isComplete: boolean;
}

const QuitModal = (props: Props) => {
  const content = useMemo(() => {
    if (isStatus(props.status, DispositifStatus.DRAFT)) return contents.draft;
    if (isStatus(props.status, DispositifStatus.ACTIVE)) {
      return props.isComplete ? contents.publishedComplete : contents.publishedIncomplete;
    }
    return contents.waiting;
  }, [props.status, props.isComplete]);

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

  const publishedAndComplete = isStatus(props.status, DispositifStatus.ACTIVE) && props.isComplete;

  return (
    <BaseModal show={props.show} toggle={props.toggle} title={content.title} small>
      <div>
        {content.intro && <p>{content.intro}</p>}
        <Row className={styles.content}>
          <Col>
            <ul className={styles.list}>
              {content.items.map((item, i) => (
                <li key={i}>
                  {icon} {item}
                </li>
              ))}
            </ul>
          </Col>
          <Col xs="auto">
            <Image src={QuitImage} width={128} height={200} alt="" className="mt-3" />
          </Col>
        </Row>

        <div className="text-end">
          <Button
            secondary
            onClick={publishedAndComplete ? props.onPublish : props.toggle}
            icon="arrow-forward-outline"
            iconPlacement="end"
            className="me-2"
          >
            {publishedAndComplete ? "Envoyer pour relecture" : "Rester dans l'éditeur"}
          </Button>
          <Button onClick={props.onQuit} icon="log-out-outline" iconPlacement="end">
            Quitter et finir plus tard
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default QuitModal;
