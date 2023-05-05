import { useMemo } from "react";
import { ContentType } from "api-types";
import styles from "./AccordionBadge.module.scss";

interface Props {
  index: number;
  sectionKey: string;
  contentType: ContentType;
  color100: string;
}

/**
 * Displays the badge of the Demarche accordion if needed
 */
const AccordionBadge = ({ sectionKey, index, contentType, color100 }: Props) => {
  const withNumber = useMemo(
    () => contentType === ContentType.DEMARCHE && sectionKey.includes("how"),
    [contentType, sectionKey],
  );

  return withNumber ? (
    <span className={styles.badge} style={{ backgroundColor: color100 }}>
      {index}
    </span>
  ) : null;
};

export default AccordionBadge;
