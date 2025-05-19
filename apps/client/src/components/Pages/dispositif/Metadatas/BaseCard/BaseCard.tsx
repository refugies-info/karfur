import { fr } from "@codegouvfr/react-dsfr";
import isUndefined from "lodash/isUndefined";
import React, { useContext, useMemo } from "react";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import Tooltip from "~/components/UI/Tooltip";
import { useUniqueId } from "~/hooks";
import { cn } from "~/lib/classname";
import PageContext from "~/utils/pageContext";

type BaseCardStatus = "done" | "error";

interface Item {
  label?: string;
  icon: React.ReactNode;
  content: string | React.ReactNode | undefined | null;
  defaultValue?: string | React.ReactNode;
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
      <div className="">
        <div className="">
          <span className="">Non pertinent pour mon action</span>
        </div>
      </div>
    );
  }

  // items contents
  return (items || []).map((item, i) => {
    let content = item.content;
    if (!item.content && !editMode && !item.defaultValue) return null; // view mode, no content
    const infoNotUseful = editMode && item.content === null;
    const infoMissing = editMode && item.content === undefined;
    const hasDefault = !editMode && !item.content && !!item.defaultValue;
    if (infoNotUseful) content = "Non pertinent pour mon action";
    if (infoMissing) content = "Info manquante";
    if (hasDefault) content = item.defaultValue;

    return (
      <div key={i} className="mb-4 flex gap-2">
        {item.icon && item.icon}
        <div className="flex flex-col ltr:text-left rtl:text-right">
          <h4 className="text-corps-sm mb-0">{item.label}</h4>
          <span
            className={cn(
              "text-corps-sm relative h-full [&_a]:inline",
              "before:content before:bg-border-default-grey before:absolute before:-left-4.75 before:block before:h-full before:w-px",
            )}
          >
            {content}
          </span>
        </div>
      </div>
    );
  });
};

/**
 * Base component of the left sidebar card. Can be used in VIEW or EDIT mode.
 */
const BaseCard = ({ id, title, items, onClick }: Props) => {
  const pageContext = useContext(PageContext);
  const tooltipId = useUniqueId("tooltip_card_");

  const noContent = useMemo(() => {
    return pageContext.mode === "view" && !(items || []).find((item) => !isUndefined(item.content));
  }, [items, pageContext.mode]);

  const status = useMemo(() => getStatus(items, pageContext.mode === "edit"), [pageContext.mode, items]);

  const cardContent = useMemo(
    () =>
      !noContent ? (
        <>
          <h3 className="text-title-xxs font-bold">
            {title}
            {status === "done" && (
              <>
                <EVAIcon name="checkmark-circle-2" fill={fr.colors.decisions.background.actionHigh.blueFrance.active} />
                <EVAIcon name="edit-2" fill={fr.colors.decisions.text.actionHigh.blueFrance.default} />
              </>
            )}
            {status === "error" && (
              <EVAIcon name="alert-triangle" fill={fr.colors.decisions.background.actionHigh.error.default} />
            )}
          </h3>
          {getContent(items, pageContext.mode === "edit")}
        </>
      ) : null,
    [title, items, status, noContent, pageContext.mode],
  );

  if (noContent) return null;
  return onClick ? (
    <button
      id={tooltipId}
      // className={cn(styles.card, styles.btn, status === "error" && styles.error)}
      onClick={(e: any) => {
        e.preventDefault();
        onClick();
      }}
    >
      {cardContent}

      {tooltipId && (
        <Tooltip target={tooltipId} placement="right">
          Modifier
        </Tooltip>
      )}
    </button>
  ) : (
    <div
      id={id}
      className={cn(
        "bg-alt-blue-france border-default-grey mb-4 border p-4 md:mb-0 md:border-0 md:bg-white/50 md:backdrop-blur-[30px]",
        // status === "error" && styles.error,
      )}
    >
      {cardContent}
    </div>
  );
};

export default BaseCard;
