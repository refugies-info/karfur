import React, { useContext, useMemo, useState } from "react";
import { cls } from "lib/classname";
import PageContext from "utils/pageContext";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./BaseCard.module.scss";
import { uniqueId } from "lodash";
import Tooltip from "components/UI/Tooltip";

type BaseCardStatus = "done" | "error";

interface Item {
  label?: string;
  icon: React.ReactNode;
  content: string | React.ReactNode | undefined | null;
}

interface Props {
  id?: string;
  title: string | React.ReactNode;
  color?: string;
  items: Item[] | null;
  status?: BaseCardStatus;
  onClick?: () => void;
}

const getStatus = (items: Item[] | null, editMode: boolean): BaseCardStatus | undefined => {
  if (!editMode) return undefined;
  if (items === null) return "done"; // null = not useful
  if (items.find((item) => item.content === undefined)) return "error"; // one item undefined = info not set yet
  return "done";
};
const getContent = (items: Item[] | null, editMode: boolean) => {
  const infoNotUseful = editMode && items === null;
  // all card content
  if (infoNotUseful) {
    return (
      <div className={styles.item}>
        <div className={cls(styles.details, "ms-0")}>
          <span className={styles.content}>Non pertinent pour mon action</span>
        </div>
      </div>
    );
  }

  // items contents
  return (items || []).map((item, i) => {
    let content = item.content;
    if (!item.content && !editMode) return null; // view mode, no content
    const infoNotUseful = editMode && item.content === null;
    const infoMissing = editMode && item.content === undefined;
    if (infoNotUseful) content = "Non pertinent pour mon action";
    if (infoMissing) content = "Info manquante";

    return (
      <div key={i} className={cls(styles.item, infoMissing && styles.missing)}>
        {item.icon && <div className={styles.icon}>{item.icon}</div>}
        <div className={cls(styles.details, !item.icon && styles.no_icon)}>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.content}>{content}</span>
        </div>
      </div>
    );
  });
};

/**
 * Base component of the left sidebar card. Can be used in VIEW or EDIT mode.
 */
const BaseCard = ({ id, title, items, color, onClick }: Props) => {
  const pageContext = useContext(PageContext);
  const [tooltipId] = useState(uniqueId("tooltip_card_"));

  const noContent = useMemo(() => {
    return pageContext.mode === "view" && !(items || []).find((item) => !!item.content);
  }, [items, pageContext.mode]);

  const status = useMemo(() => getStatus(items, pageContext.mode === "edit"), [pageContext.mode, items]);

  const cardContent = useMemo(
    () =>
      !noContent ? (
        <>
          <p className={styles.title} style={{ color }}>
            {title}
            {status === "done" && (
              <>
                <EVAIcon
                  name="checkmark-circle-2"
                  fill={styles.lightPrimaryBlueFranceSun}
                  className={cls(styles.status, styles.done)}
                />
                <EVAIcon
                  name="edit-2"
                  fill={styles.lightTextActionHighBlueFrance}
                  className={cls(styles.status, styles.edit)}
                />
              </>
            )}
            {status === "error" && (
              <EVAIcon name="alert-triangle" fill={styles.lightTextDefaultError} className={cls(styles.status)} />
            )}
          </p>
          {getContent(items, pageContext.mode === "edit")}
        </>
      ) : null,
    [title, items, color, status, noContent, pageContext.mode],
  );

  if (noContent) return null;
  return onClick ? (
    <button
      id={tooltipId}
      className={cls(styles.card, styles.btn, status === "error" && styles.error)}
      onClick={(e: any) => {
        e.preventDefault();
        onClick();
      }}
    >
      {cardContent}

      <Tooltip target={tooltipId} placement="right">
        Modifier
      </Tooltip>
    </button>
  ) : (
    <div id={id} className={cls(styles.card, status === "error" && styles.error)}>
      {cardContent}
    </div>
  );
};

export default BaseCard;
