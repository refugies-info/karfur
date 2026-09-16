import * as Accordion from "@radix-ui/react-accordion";
import type { Id } from "@refugies-info/api-types";
import type React from "react";
import Needs from "~/components/Pages/recherche/ThemeMenu/Needs";
import { cls } from "~/lib/classname";
import styles from "./ThemeItem.mobile.module.scss";

interface Props {
  themeId: Id;
  label: string;
  needCount: number;
  className?: string;
  color?: string;
}

const ThemeItemMobile: React.FC<Props> = ({ themeId, label, needCount, color }) => {
  return (
    <Accordion.Item value={themeId.toString()} className={styles.accordionItem}>
      <Accordion.Header asChild>
        <Accordion.Trigger
          className={styles.trigger}
          style={{ "--accordion-color": color } as React.CSSProperties}
        >
          <span className={styles.label}>
            {label}
            <b
              className={cls(styles.count, needCount > 0 && styles["count-visible"])}
              style={{ color: color }}
            >
              {needCount}
            </b>
            <i className={cls("fr-icon-arrow-down-s-line", styles.arrow)} aria-hidden="true" />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className={styles.content}>
        <Needs themeId={themeId} />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default ThemeItemMobile;
