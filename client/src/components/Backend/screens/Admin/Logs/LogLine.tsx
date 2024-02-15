import React from "react";
import moment from "moment";
import styles from "./LogLine.module.scss";
import { getLogText } from "./functions";
import { cls } from "lib/classname";
import { GetLogResponse, Id } from "@refugies-info/api-types";

interface Props {
  log: GetLogResponse;
  openUserModal?: (user: Id | null) => void;
  openContentModal?: (element: Id | null, status: string | null) => void;
  openStructureModal?: (element: Id | null) => void;
  openAnnuaire?: (id: Id) => void;
  openImprovementsModal?: () => void;
  openNeedsModal?: () => void;
}

export const LogLine = (props: Props) => {
  const { log } = props;

  const handleClick = () => {
    if (!log.link) return;
    switch (log.link.next) {
      case "ModalContenu":
        props.openContentModal ? props.openContentModal(log.link.id, null) : () => {};
        return;
      case "ModalImprovements":
        props.openImprovementsModal ? props.openImprovementsModal() : () => {};
        return;
      case "ModalNeeds":
        props.openNeedsModal ? props.openNeedsModal() : () => {};
        return;
      case "ModalReaction":
        return;
      case "ModalStructure":
        props.openStructureModal ? props.openStructureModal(log.link.id) : () => {};
        return;
      case "ModalUser":
        props.openUserModal ? props.openUserModal(log.link.id) : () => {};
        return;
      case "PageAnnuaire":
        props.openAnnuaire ? props.openAnnuaire(log.link.id) : () => {};
        return;
      default:
        return;
    }
  };

  return (
    <div className={cls(styles.container, !!log.link && styles.clickable)} onClick={handleClick}>
      <div className="me-1">{moment(log.created_at).format("HH:mm")}</div>
      {getLogText(log)}
      {log.author && <div className="ms-auto">{log.author.username}</div>}
    </div>
  );
};
