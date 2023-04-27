import React, { useCallback, useContext, useMemo, useState } from "react";
import { cls } from "lib/classname";
import { useUniqueId } from "hooks";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Tooltip from "components/UI/Tooltip";
import DeleteContentModal from "./DeleteContentModal";
import styles from "./AddContentButton.module.scss";

interface Props {
  children: string | React.ReactNode;
  content?: string | React.ReactNode;
  onClick: () => void;
  onDelete?: (() => void) | false; // false shows the button but disable it
  size?: "md" | "lg" | "xl";
  contentSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
  hasError?: boolean;
}

/**
 * Button which shows an editable section.
 * Shows the value of the section if the content attribute is set.
 */
const AddContentButton = (props: Props) => {
  const tooltipDeleteId = useUniqueId("tooltip_delete_");
  const tooltipId = useUniqueId("tooltip_");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleDeleteModal = useCallback(() => setShowDeleteModal((o) => !o), []);
  const { showMissingSteps } = useContext(PageContext);

  const hasContent = useMemo(() => !!props.content, [props.content]);
  const hasErrorStatus = useMemo(
    () => props.hasError || (showMissingSteps && !hasContent),
    [props.hasError, showMissingSteps, hasContent],
  );
  const errorIcon = useMemo(
    () => <EVAIcon name="alert-triangle" fill={styles.lightTextDefaultError} className={cls(styles.icon, styles.ok)} />,
    [],
  );
  return (
    <Button
      tertiary
      className={cls(
        styles.btn,
        hasContent && styles.has_content,
        hasErrorStatus && styles.has_error,
        props.size && styles[props.size],
        props.className,
      )}
      onClick={(e: any) => {
        e.preventDefault();
        props.onClick();
      }}
      id={tooltipId}
    >
      {hasContent ? (
        <>
          {typeof props.content === "string" ? (
            <span
              className={cls(props.contentSize && styles[props.contentSize])}
              dangerouslySetInnerHTML={{
                __html: props.content,
              }}
            />
          ) : (
            props.content
          )}
          <div className={styles.icons}>
            {!hasErrorStatus ? (
              <EVAIcon
                name="checkmark-circle-2"
                fill={styles.lightPrimaryBlueFranceSun}
                className={cls(styles.icon, styles.ok)}
              />
            ) : (
              errorIcon
            )}
            <EVAIcon
              name="edit-2"
              fill={styles.lightTextActionHighBlueFrance}
              className={cls(styles.icon, styles.edit)}
            />
            {props.onDelete !== undefined && (
              <>
                <EVAIcon
                  name="trash-2-outline"
                  fill={props.onDelete ? styles.lightTextActionHighBlueFrance : styles.lightTextDisabledGrey}
                  className={cls(styles.icon, styles.delete, !props.onDelete && styles.disabled)}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    props.onDelete && setShowDeleteModal(true);
                  }}
                  id={tooltipDeleteId}
                />
                {props.onDelete === false && tooltipDeleteId && (
                  <Tooltip target={tooltipDeleteId} placement="right">
                    Vous ne pouvez pas supprimer cet élément : il en faut au moins trois pour valider la fiche.
                  </Tooltip>
                )}
                <DeleteContentModal
                  show={showDeleteModal}
                  toggle={toggleDeleteModal}
                  onValidate={() => props.onDelete && props.onDelete()}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <span className={styles.empty}>{props.children}</span>
          {!hasErrorStatus ? (
            <EVAIcon name="plus-circle" size={24} fill={styles.lightTextMentionGrey} className={styles.icon} />
          ) : (
            errorIcon
          )}
        </>
      )}

      {tooltipId && (
        <Tooltip target={tooltipId} placement="right">
          {!hasContent ? "Ajouter" : "Modifier"}
        </Tooltip>
      )}
    </Button>
  );
};

export default AddContentButton;
