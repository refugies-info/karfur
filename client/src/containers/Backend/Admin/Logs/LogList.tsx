import React, { useEffect, useState } from "react";
import moment from "moment";
import { Log } from "types/interface";
import { LogLine } from "./LogLine";
import styles from "./LogList.module.scss";

type GroupedLogs = { [key: string]: Log[] };

export const LogList = (props: { logs: Log[] }) => {
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
      {Object.entries(groupedLogs).map((group) => (
        <>
          <p className={styles.date}>{group[0]}</p>
          {group[1].map((log, i) => (
            <LogLine key={i} log={log} />
          ))}
        </>
      ))}
    </div>
  );
};
