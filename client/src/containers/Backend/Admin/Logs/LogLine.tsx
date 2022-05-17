import React from "react";
import moment from "moment";
import { Log } from "types/interface";
import styles from "./LogLine.module.scss";
import { getLogText } from "./functions";
import { ObjectId } from "mongodb";
import { cls } from "lib/classname";

interface Props {
  log: Log
  openUserModal?: (user: ObjectId | null) => void
  openContentModal?: (element: ObjectId | null, status: string | null) => void
  openStructureModal?: (element: ObjectId | null) => void
  openAnnuaire?: (id: ObjectId) => void
  openImprovementsModal?: () => void
  openNeedsModal?: () => void
}

export const LogLine = (props: Props) => {
  const { log } = props;

  const handleClick = () => {
    if (!log.link) return;
    switch (log.link.next) {
      case "ModalContenu":
        props.openContentModal ? props.openContentModal(log.link.id, null) : () => {}
        return;
      case "ModalImprovements":
        props.openImprovementsModal ? props.openImprovementsModal() : () => {}
        return;
      case "ModalNeeds":
        props.openNeedsModal ? props.openNeedsModal() : () => {}
        return;
      case "ModalReaction":
        return;
      case "ModalStructure":
        props.openStructureModal ? props.openStructureModal(log.link.id) : () => {}
        return;
      case "ModalUser":
        props.openUserModal ? props.openUserModal(log.link.id) : () => {}
        return;
      case "PageAnnuaire":
        props.openAnnuaire ? props.openAnnuaire(log.link.id) : () => {}
        return;
      default:
        return;
    }
  }

  return (
    <div
      className={cls(styles.container, log.link && styles.clickable)}
      onClick={handleClick}
    >
      <div className="mr-1">
        {moment(log.created_at).format("HH:mm")}
      </div>
      {getLogText(log)}
      {log.author && <div className="ml-auto">{log.author.username}</div>}
    </div>
  );
};
