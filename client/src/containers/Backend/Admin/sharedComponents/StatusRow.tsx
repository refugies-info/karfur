import { statusCompare } from "lib/statusCompare";
import {
  ContentStatus,
  ProgressionStatus,
  SimplifiedDispositif,
  SimplifiedStructureForAdmin,
  StructureStatus,
} from "types/interface";
import { Label, StyledStatus } from "./SubComponents";
import styles from "./StatusRow.module.scss";

interface Props {
  element: SimplifiedDispositif | SimplifiedStructureForAdmin;
  status: ContentStatus[] | StructureStatus[];
  publicationStatus: ProgressionStatus[];
  progressionStatus: ProgressionStatus[];
  modifyStatus: (
    newStatus: string,
    property:
      | "status"
      | "adminProgressionStatus"
      | "adminPercentageProgressionStatus"
  ) => void;
  hiddenStatus?: string[];
}

export const StatusRow = (props: Props) => {
  return (
    <div className={styles.status_row}>
      <div>
        <Label>Statut de la fiche</Label>
        <div className="d-flex">
          {props.status.sort(statusCompare).map((status) => {
            if (
              props.hiddenStatus &&
              props.hiddenStatus.includes(status.storedStatus) && // hide some status
              status.storedStatus !== props.element.status
            )
              return null;

            return (
              <div
                className="mr-2"
                key={status.storedStatus}
                onClick={() =>
                  props.modifyStatus(status.storedStatus, "status")
                }
              >
                <StyledStatus
                  text={status.storedStatus}
                  overrideColor={status.storedStatus !== props.element.status}
                  textToDisplay={status.displayedStatus}
                  color={status.color}
                  disabled={status.storedStatus === props.element.status}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Statut de publication</Label>
        <div className="d-flex">
          {props.publicationStatus.map((status) => (
            <div
              key={status.storedStatus}
              className="mr-2"
              onClick={() =>
                props.modifyStatus(
                  status.storedStatus,
                  "adminProgressionStatus"
                )
              }
            >
              <StyledStatus
                text={status.storedStatus}
                textToDisplay={status.displayedStatus}
                color={status.color}
                textColor={status.textColor}
                overrideColor={
                  status.storedStatus !== props.element.adminProgressionStatus
                }
                disabled={
                  status.storedStatus === props.element.adminProgressionStatus
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Progression</Label>
        <div className="d-flex">
          {props.progressionStatus.map((status) => (
            <div
              key={status.storedStatus}
              className="mr-2"
              onClick={() =>
                props.modifyStatus(
                  status.storedStatus,
                  "adminPercentageProgressionStatus"
                )
              }
            >
              <StyledStatus
                text={status.storedStatus}
                textToDisplay={status.displayedStatus}
                color={status.color}
                textColor={status.textColor}
                overrideColor={
                  status.storedStatus !==
                  props.element.adminPercentageProgressionStatus
                }
                disabled={
                  status.storedStatus ===
                  props.element.adminPercentageProgressionStatus
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};