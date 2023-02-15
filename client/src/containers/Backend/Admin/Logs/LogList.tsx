import React, { useEffect, useState } from "react";
import moment from "moment";
import { LogLine } from "./LogLine";
import styles from "./LogList.module.scss";
import { GetLogResponse, Id } from "api-types";

type GroupedLogs = { [key: string]: GetLogResponse[] };

interface Props {
  logs: GetLogResponse[];
  openUserModal?: (user: Id | null) => void;
  openContentModal?: (element: Id | null, status: string | null) => void;
  openStructureModal?: (element: Id | null) => void;
  openAnnuaire?: (id: Id) => void;
  openImprovementsModal?: () => void;
  openNeedsModal?: () => void;
}

export const LogList = (props: Props) => {
  const [groupedLogs, setGroupedLogs] = useState<GroupedLogs>({});

  useEffect(() => {
    const newGroupedLogs: GroupedLogs = {};
    for (const log of props.logs) {
      const key = moment(log.created_at).format("dddd Do MMM YYYY");
      if (!newGroupedLogs[key]) newGroupedLogs[key] = [];
      newGroupedLogs[key].push(log);
    }
    setGroupedLogs(newGroupedLogs);
  }, [props.logs]);

  return (
    <div className={styles.container}>
      {Object.entries(groupedLogs).map((group, j) => (
        <div key={j} className="mb-2">
          <p className={styles.date}>{group[0]}</p>
          {group[1].map((log, i) => (
            <LogLine
              key={i}
              log={log}
              openUserModal={props.openUserModal}
              openContentModal={props.openContentModal}
              openStructureModal={props.openStructureModal}
              openAnnuaire={props.openAnnuaire}
              openImprovementsModal={props.openImprovementsModal}
              openNeedsModal={props.openNeedsModal}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
