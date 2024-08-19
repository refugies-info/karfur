import React, { useMemo } from "react";
import { DispositifStatus } from "@refugies-info/api-types";
import Badge from "components/UI/Badge";
import { getStatus } from "./functions";
import styles from "./Status.module.scss";

interface Props {
  status: DispositifStatus | undefined;
  hasDraftVersion: boolean;
  isAdmin: boolean;
  text?: string;
  className?: string;
}

const Status = (props: Props) => {
  const status = useMemo(
    () => getStatus(props.status, props.hasDraftVersion, props.isAdmin),
    [props.status, props.hasDraftVersion, props.isAdmin],
  );

  if (!status) return null;
  return (
    <Badge severity={status.type} icon={status.icon} className={props.className}>
      {props.text || status.text}
    </Badge>
  );
};

export default Status;
