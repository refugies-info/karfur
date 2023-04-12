import React, { useMemo, useState } from "react";
import { DeepPartialSkipArrayKey, useWatch } from "react-hook-form";
import { CreateDispositifRequest, DispositifStatus } from "api-types";
import { BaseModal } from "components/Pages/dispositif";
import { getMissingSteps } from "../functions";
import CompleteContent from "./CompleteContent";
import MissingContent from "./MissingContent";
import styles from "./PublishModal.module.scss";

interface Props {
  show: boolean;
  status: DispositifStatus | null;
  toggle: () => void;
  onQuit: () => void;
  onPublish: (keepTranslations: boolean) => Promise<void>;
}

const PublishModal = (props: Props) => {
  const dispositif = useWatch<DeepPartialSkipArrayKey<CreateDispositifRequest>>();
  const missingSteps = useMemo(
    () => getMissingSteps(dispositif).filter((c) => c !== null) as string[],
    [dispositif],
  );

  const isComplete = useMemo(() => missingSteps.length === 0, [missingSteps]);

  const [title, setTitle] = useState(
    isComplete
      ? "Tout est prêt, envoyez votre fiche pour relecture !"
      : `Plus que ${missingSteps.length} étapes manquantes`,
  );

  return (
    <BaseModal show={props.show} toggle={props.toggle} title={title} small>
      {isComplete ? (
        <CompleteContent status={props.status} onPublish={props.onPublish} toggle={props.toggle} setTitle={setTitle} />
      ) : (
        <MissingContent onQuit={props.onQuit} onStay={props.toggle} status={props.status} missingSteps={missingSteps} />
      )}
    </BaseModal>
  );
};

export default PublishModal;
