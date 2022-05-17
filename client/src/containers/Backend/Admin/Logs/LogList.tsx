import React, { useEffect, useState } from "react";
import moment from "moment";
import { Log } from "types/interface";
import { LogLine } from "./LogLine";
import styles from "./LogList.module.scss";
import { ObjectId } from "mongodb";

type GroupedLogs = { [key: string]: Log[] };

interface Props {
  logs: Log[]
  openUserModal?: (user: ObjectId | null) => void
  openContentModal?: (element: ObjectId | null, status: string | null) => void
  openStructureModal?: (element: ObjectId | null) => void
  openAnnuaire?: (id: ObjectId) => void
  openImprovementsModal?: () => void
  openNeedsModal?: () => void
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
        <div key={j}>
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
