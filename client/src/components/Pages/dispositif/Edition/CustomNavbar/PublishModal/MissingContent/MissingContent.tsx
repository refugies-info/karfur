import React, { useMemo } from "react";
import { DispositifStatus } from "api-types";
import { Badge } from "@dataesr/react-dsfr";
import { isStatus } from "lib/dispositif";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { help } from "./data";
import styles from "./MissingContent.module.scss";

interface Props {
  missingSteps: string[];
  status: DispositifStatus | null;
  onQuit: () => void;
  onStay: () => void;
}

const MissingContent = (props: Props) => {
  const content = useMemo(() => {
    if (isStatus(props.status, DispositifStatus.ACTIVE)) return help.published;
    if (isStatus(props.status, [DispositifStatus.WAITING_ADMIN, DispositifStatus.WAITING_STRUCTURE]))
      return help.waiting;
    return help.draft;
  }, [props.status]);

  return (
    <div>
      <p>{content}</p>
      <div className={styles.missing}>
        {props.missingSteps.map((step, i) => (
          <div key={i} className={styles.step}>
            <span>{step}</span>

            <span>
              <Badge type="warning" text="Manquant" icon="ri-alert-fill" isSmall className="me-4" />
              <EVAIcon name="plus-circle" size={24} fill={styles.lightTextMentionGrey} />
            </span>
          </div>
        ))}
      </div>
      <div className="text-end">
        <Button secondary onClick={props.onQuit} icon="log-out-outline" iconPlacement="end" className="me-2">
          Quitter et finir plus tard
        </Button>
        <Button onClick={props.onStay} icon="arrow-forward-outline" iconPlacement="end">
          Compléter ma fiche
        </Button>
      </div>
    </div>
  );
};

export default MissingContent;
