import { useContext, useMemo } from "react";
import { useContentType } from "hooks/dispositif";
import { DispositifStatus } from "@refugies-info/api-types";
import { isStatus } from "lib/dispositif";
import PageContext, { Modals } from "utils/pageContext";
import Button from "components/UI/Button";
import StepBar from "../../../StepBar";
import { getTotalSteps, Step } from "../../functions";
import MissingSteps from "../../../MissingSteps";
import { help } from "./data";

interface Props {
  missingSteps: Step[];
  status: DispositifStatus | null;
  onQuit: () => void;
  onStay: () => void;
}

const STEPS_MODAL: Record<Step, Modals | null> = {
  commitment: "Availability",
  conditions: "Conditions",
  location: "Location",
  price: "Price",
  public: "Public",
  theme: "Themes",
  abstract: "Abstract",
  mainSponsor: "MainSponsor",
  titreInformatif: null,
  titreMarque: null,
  what: null,
  why: null,
  how: null,
  next: null,
  sponsors: null,
};

const MissingContent = (props: Props) => {
  const pageContext = useContext(PageContext);

  const content = useMemo(() => {
    if (isStatus(props.status, DispositifStatus.ACTIVE)) return help.published;
    if (isStatus(props.status, [DispositifStatus.WAITING_ADMIN, DispositifStatus.WAITING_STRUCTURE]))
      return help.waiting;
    return help.draft;
  }, [props.status]);

  const navigateCallback = (step: Step) => {
    if (STEPS_MODAL[step]) {
      pageContext.setActiveModal?.(STEPS_MODAL[step]);
    }
  };

  const contentType = useContentType();
  const totalSteps = useMemo(() => getTotalSteps(contentType), [contentType]);

  return (
    <div>
      <p>{content}</p>
      <StepBar
        total={totalSteps}
        progress={totalSteps - props.missingSteps.length}
        text={`${totalSteps - props.missingSteps.length} étapes complétées sur ${totalSteps}`}
      />

      <MissingSteps
        missingSteps={props.missingSteps.map((s) => ({ step: s, status: "warning" }))}
        toggle={props.onStay}
        navigateCallback={navigateCallback}
        style="warning"
      />

      <div className="text-end">
        <Button
          priority="secondary"
          onClick={(e: any) => {
            e.preventDefault();
            props.onQuit();
          }}
          evaIcon="log-out-outline"
          iconPosition="right"
          className="me-2"
        >
          Quitter et finir plus tard
        </Button>
        <Button
          onClick={(e: any) => {
            e.preventDefault();
            props.onStay();
          }}
          evaIcon="arrow-forward-outline"
          iconPosition="right"
        >
          Compléter ma fiche
        </Button>
      </div>
    </div>
  );
};

export default MissingContent;
