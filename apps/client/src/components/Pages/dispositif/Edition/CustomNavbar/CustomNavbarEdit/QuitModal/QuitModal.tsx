import React, { useMemo } from "react";
import { Col, Row } from "reactstrap";
import Image from "next/image";
import { DispositifStatus } from "@refugies-info/api-types";
import { isStatus } from "lib/dispositif";
import Button from "components/UI/Button";
import BaseModal from "components/UI/BaseModal";
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
  hasDraftVersion: boolean;
}

const QuitModal = (props: Props) => {
  const content = useMemo(() => {
    if (isStatus(props.status, DispositifStatus.ACTIVE) || props.hasDraftVersion) {
      return props.isComplete ? contents.publishedComplete : contents.publishedIncomplete;
    }
    if (isStatus(props.status, DispositifStatus.DRAFT)) {
      return props.isComplete ? contents.draftComplete : contents.draftIncomplete;
    }
    return contents.waitingIncomplete; // should not happen: an incomplete dispositif reverts to Draft / a complete one redirects to the BO
  }, [props.status, props.isComplete, props.hasDraftVersion]);

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
            priority="secondary"
            onClick={(e: any) => {
              e.preventDefault();
              if (props.isComplete) props.onPublish();
              else props.toggle();
            }}
            evaIcon="arrow-forward-outline"
            iconPosition="right"
            className="me-2"
          >
            {content.buttonText}
          </Button>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              props.onQuit();
            }}
            evaIcon="log-out-outline"
            iconPosition="right"
          >
            Quitter et finir plus tard
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default QuitModal;
