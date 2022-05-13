import React from "react";
import moment from "moment";
import { Log } from "types/interface";
import styles from "./LogLine.module.scss";


export const LogLine = (props: {
  log: Log
}) => {
  const {log} = props;
  return (
    <div className={styles.container}>
      <div className="mr-1">
        {moment(log.created_at).format("HH:mm")}
      </div>
      <div>{log.text}</div>
      {log.author && <div className="ml-auto">{log.author.username}</div>}
    </div>
  );
};
