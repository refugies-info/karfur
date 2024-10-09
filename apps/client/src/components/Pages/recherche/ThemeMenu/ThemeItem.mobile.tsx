import * as Accordion from "@radix-ui/react-accordion";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import AllNeedsItem from "~/components/Pages/recherche/ThemeMenu/AllNeedsItem";
import NeedItem from "~/components/Pages/recherche/ThemeMenu/NeedItem";
import { cls } from "~/lib/classname";
import { needsSelector } from "~/services/Needs/needs.selectors";
import styles from "./ThemeItem.mobile.module.scss";

interface Props {
  themeId: string;
  label: string;
  needCount: number;
  className?: string;
  color?: string;
}

const ThemeItemMobile: React.FC<Props> = ({ themeId, label, needCount, color }) => {
  const allNeeds = useSelector(needsSelector);

  const needs = useMemo(() => {
    return allNeeds.filter((need) => need.theme._id === themeId);
  }, [allNeeds, themeId]);

  return (
    <Accordion.Item value={themeId} className={styles.accordionItem}>
      <Accordion.Header asChild>
        <Accordion.Trigger className={styles.trigger} style={{ "--accordion-color": color } as React.CSSProperties}>
          <span className={styles.label}>
            {label}
            <b className={cls(styles.count, needCount > 0 && styles["count-visible"])} style={{ color: color }}>
              {needCount}
            </b>
            <i className={cls("fr-icon-arrow-down-s-line", styles.arrow)} />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className={styles.content}>
        <AllNeedsItem themeId={themeId} />
        {needs.map((need, i) => (
          <NeedItem key={i} need={need} />
        ))}
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default ThemeItemMobile;
