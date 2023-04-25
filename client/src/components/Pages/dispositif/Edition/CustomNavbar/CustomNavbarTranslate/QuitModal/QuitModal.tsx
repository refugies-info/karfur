import React, { useCallback, useContext, useMemo } from "react";
import { Col, Row } from "reactstrap";
import Image from "next/image";
import { DispositifStatus, Languages } from "api-types";
import { isStatus } from "lib/dispositif";
import Button from "components/UI/Button";
import { BaseModal } from "components/Pages/dispositif";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import QuitImage from "assets/dispositif/quit-image.svg";
import { ContentKey, contentTitle, getContentIntro } from "./data";
import styles from "./QuitModal.module.scss";
import { useUser, useLanguages } from "hooks";
import PublishImage from "assets/dispositif/publish-image.svg";
import { Step } from "../functions";
import MissingSteps from "../../MissingSteps";
import PageContext from "utils/pageContext";
import StepBar from "../../StepBar";

interface Props {
  show: boolean;
  toggle: () => void;
  onQuit: () => void;
  onPublish: () => void;
  isComplete: boolean;
  missingSteps: Step[];
  progress: number;
  locale?: Languages;
}

const QuitModal = (props: Props) => {
  const { user } = useUser();
  const pageContext = useContext(PageContext);

  const contentKey: ContentKey = useMemo(() => {
    const hasToFinish = false;
    if (user.expertTrad) return "expert";
    if (!props.isComplete && hasToFinish) return "pending";
    if (!props.isComplete) return "incomplete";
    return "complete";
  }, [props.isComplete, user.expertTrad]);

  const goToStep = useCallback(
    (step: Step) => {
      pageContext.setShowMissingSteps?.(true);
      props.toggle();
      // delay scroll so the modal is closed
      setTimeout(() => {
        document.getElementById(`step-${step}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 1000);
    },
    [pageContext, props],
  );

  const content = useMemo(() => {
    switch (contentKey) {
      case "expert":
        return (
          <>
            <Row className={styles.content}>
              <Col>
                <ul className={styles.list}>
                  {[
                    "Votre travail est enregistré.",
                    "Vous devrez valider la fiche pour qu’elle soit publiée sur le site dans votre langue.",
                  ].map((item, i) => (
                    <li key={i}>
                      <EVAIcon
                        name="arrow-forward-outline"
                        fill={styles.lightTextActionHighBlueFrance}
                        size={16}
                        className={styles.icon}
                      />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs="auto">
                <Image src={QuitImage} width={56} height={88} alt="" className="mt-3 ms-8" />
              </Col>
            </Row>

            <div className="text-end">
              <Button
                secondary
                onClick={props.onPublish}
                icon="arrow-forward-outline"
                iconPlacement="end"
                className="me-2"
              >
                Publier
              </Button>
              <Button onClick={props.onQuit} icon="log-out-outline" iconPlacement="end">
                Quitter et publier plus tard
              </Button>
            </div>
          </>
        );
      case "pending":
        return (
          <>
            {/* @ts-ignore */}
            <MissingSteps missingSteps={props.missingSteps} goToStep={goToStep} /> {/* TODO: fix step type */}
            <div className="text-end">
              <Button
                secondary
                onClick={props.toggle}
                icon="arrow-forward-outline"
                iconPlacement="end"
                className="me-2"
              >
                Valider les propositions
              </Button>
              <Button onClick={props.onQuit} icon="log-out-outline" iconPlacement="end">
                Quitter et finir plus tard
              </Button>
            </div>
          </>
        );
      case "incomplete":
        return (
          <>
            <div className="text-center mb-8 mt-6">
              <Image src={PublishImage} width={345} height={240} alt="" />
            </div>
            <div className="text-end">
              <Button
                secondary
                onClick={props.toggle}
                icon="arrow-forward-outline"
                iconPlacement="end"
                className="me-2"
              >
                Continuer à traduire
              </Button>
              <Button onClick={props.onQuit} icon="log-out-outline" iconPlacement="end">
                Quitter
              </Button>
            </div>
          </>
        );
      case "complete":
        return (
          <>
            <StepBar
              total={props.progress}
              progress={props.progress}
              text={`${props.progress} étapes complétées sur ${props.progress}`}
            />
            <div className="text-center mb-8 mt-6">
              <Image src={PublishImage} width={345} height={240} alt="" />
            </div>
            <div className="text-end">
              <Button onClick={props.onQuit} icon="log-out-outline" iconPlacement="end">
                C'est noté
              </Button>
            </div>
          </>
        );
    }
  }, [contentKey, props, goToStep]);

  const nbWords = 12; //TODO: get this
  const { getLanguageByCode } = useLanguages();
  const language = props.locale ? getLanguageByCode(props.locale)?.langueFr : "";
  return (
    <BaseModal show={props.show} toggle={props.toggle} title={contentTitle[contentKey]} small>
      <div>
        <p>{getContentIntro(contentKey, nbWords, language || "")}</p>
        {content}
      </div>
    </BaseModal>
  );
};

export default QuitModal;
