import { useCallback, useContext, useMemo } from "react";
import { Col, Row } from "reactstrap";
import Image from "next/image";
import { Languages } from "api-types";
import PageContext from "utils/pageContext";
import { useUser, useLanguages } from "hooks";
import Button from "components/UI/Button";
import { BaseModal } from "components/Pages/dispositif";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import StepBar from "../../StepBar";
import MissingSteps from "../../MissingSteps";
import { Step } from "../functions";
import { ContentKey, contentTitle, getContentIntro } from "./data";
import PublishImage from "assets/dispositif/publish-image.svg";
import QuitImage from "assets/dispositif/quit-image.svg";
import styles from "./QuitModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onQuit: () => void;
  onPublish: () => void;
  isComplete: boolean;
  missingSteps: Step[];
  pendingSteps: Step[];
  progress: number;
  locale?: Languages;
}

const QuitModal = (props: Props) => {
  const { user } = useUser();
  const pageContext = useContext(PageContext);

  const contentKey: ContentKey = useMemo(() => {
    const hasToFinish = props.pendingSteps.length > 0;
    if (user.expertTrad) return "expert";
    if (!props.isComplete && hasToFinish) return "pending";
    if (!props.isComplete) return "incomplete";
    return "complete";
  }, [props.isComplete, props.pendingSteps, user.expertTrad]);

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
            <MissingSteps
              missingSteps={props.pendingSteps.map((p) => ({ step: p, status: "new" }))}
              toggle={props.toggle}
              noPlusIcon
              style="new"
            />
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
              <Button onClick={props.onQuit} icon="checkmark-circle-2" iconPlacement="end">
                C'est noté
              </Button>
            </div>
          </>
        );
    }
  }, [contentKey, props]);

  const nbWords = 12; // TODO: get this
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
