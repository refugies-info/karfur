import { ContentType, CreateDispositifRequest, DispositifStatus } from "@refugies-info/api-types";
import BaseModal from "components/UI/BaseModal";
import { Event } from "lib/tracking";
import { useEffect, useMemo, useState } from "react";
import { DeepPartialSkipArrayKey, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { userSelector } from "services/User/user.selectors";
import { getMissingStepsEdit, Step } from "../functions";
import CompleteContent from "./CompleteContent";
import MissingContent from "./MissingContent";

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
  const dispositif = useWatch<DeepPartialSkipArrayKey<CreateDispositifRequest>>();
  const user = useSelector(userSelector);
  const missingSteps = useMemo(
    () => getMissingStepsEdit(dispositif, props.typeContenu, user.admin).filter((c) => c !== null) as Step[],
    [dispositif, props.typeContenu, user.admin],
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
  }, [props.show, missingSteps]);

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
