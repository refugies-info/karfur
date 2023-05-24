import { statusCompare } from "lib/statusCompare";
import { ContentStatus, ProgressionStatus, StructureAdminStatus } from "types/interface";
import { Label, StyledStatus } from "./SubComponents";
import styles from "./StatusRow.module.scss";
import { DispositifStatus, GetAllDispositifsResponse, GetAllStructuresResponse } from "@refugies-info/api-types";

interface Props {
  element: GetAllDispositifsResponse | GetAllStructuresResponse;
  status: ContentStatus[] | StructureAdminStatus[];
  publicationStatus: ProgressionStatus[];
  progressionStatus: ProgressionStatus[];
  modifyStatus: (
    newStatus: string,
    property: "status" | "adminProgressionStatus" | "adminPercentageProgressionStatus",
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
                className="me-2"
                key={status.storedStatus}
                onClick={() => props.modifyStatus(status.storedStatus as DispositifStatus, "status")}
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
              className="me-2"
              onClick={() =>
                props.modifyStatus(
                  status.storedStatus !== props.element.adminProgressionStatus ? status.storedStatus : "",
                  "adminProgressionStatus",
                )
              }
            >
              <StyledStatus
                text={status.storedStatus}
                textToDisplay={status.displayedStatus}
                color={status.color}
                textColor={status.textColor}
                overrideColor={status.storedStatus !== props.element.adminProgressionStatus}
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
              className="me-2"
              onClick={() =>
                props.modifyStatus(
                  status.storedStatus !== props.element.adminPercentageProgressionStatus ? status.storedStatus : "",
                  "adminPercentageProgressionStatus",
                )
              }
            >
              <StyledStatus
                text={status.storedStatus}
                textToDisplay={status.displayedStatus}
                color={status.color}
                textColor={status.textColor}
                overrideColor={status.storedStatus !== props.element.adminPercentageProgressionStatus}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
