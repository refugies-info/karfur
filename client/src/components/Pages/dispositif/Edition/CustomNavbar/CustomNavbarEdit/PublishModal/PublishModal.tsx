import React, { useEffect, useMemo, useState } from "react";
import { DeepPartialSkipArrayKey, useWatch } from "react-hook-form";
import { ContentType, CreateDispositifRequest, DispositifStatus } from "api-types";
import { useEvent } from "hooks";
import { BaseModal } from "components/Pages/dispositif";
import { getMissingStepsEdit, Step } from "../functions";
import CompleteContent from "./CompleteContent";
import MissingContent from "./MissingContent";
import styles from "./PublishModal.module.scss";

interface Props {
  show: boolean;
  typeContenu: ContentType;
  status: DispositifStatus | null;
  toggle: () => void;
  onQuit: () => void;
  onPublish: (keepTranslations: boolean) => Promise<void>;
  redirectToBo: () => void;
}

const PublishModal = (props: Props) => {
  const { Event } = useEvent();
  const dispositif = useWatch<DeepPartialSkipArrayKey<CreateDispositifRequest>>();
  const missingSteps = useMemo(
    () => getMissingStepsEdit(dispositif, props.typeContenu).filter((c) => c !== null) as Step[],
    [dispositif, props.typeContenu],
  );

  const isComplete = useMemo(() => missingSteps.length === 0, [missingSteps]);

  const [title, setTitle] = useState(
    isComplete
      ? "Tout est prêt, envoyez votre fiche pour relecture !"
      : `Plus que ${missingSteps.length} étapes manquantes`,
  );

  // send event with missing steps
  useEffect(() => {
    if (props.show) {
      Event("DISPO_CREATE", `${missingSteps.length} missing steps: ${missingSteps.join(", ")}`, "Missing Steps");
    }
  }, [props.show, Event, missingSteps]);

  return (
    <BaseModal show={props.show} toggle={props.toggle} title={title} small>
      {isComplete ? (
        <CompleteContent
          status={props.status}
          onPublish={props.onPublish}
          toggle={props.toggle}
          redirectToBo={props.redirectToBo}
          setTitle={setTitle}
        />
      ) : (
        <MissingContent onQuit={props.onQuit} onStay={props.toggle} status={props.status} missingSteps={missingSteps} />
      )}
    </BaseModal>
  );
};

export default PublishModal;
