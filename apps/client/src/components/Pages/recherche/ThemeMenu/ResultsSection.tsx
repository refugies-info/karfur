import { useLocale } from "@/hooks";
import { GetNeedResponse, GetThemeResponse } from "@refugies-info/api-types";
import React from "react";
import NeedItem from "./NeedItem";
import styles from "./ResultsSection.module.css";

interface Props {
  theme: GetThemeResponse;
  needs: GetNeedResponse[];
}

const ResultsSection: React.FC<Props> = ({ theme, needs }) => {
  const locale = useLocale();

  return (
    <div className={styles.container}>
      <div className={styles.theme}>{theme.short[locale]}</div>
      <div className={styles.needs}>
        {needs.map((need, i) => (
          <NeedItem key={i} need={need} />
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
