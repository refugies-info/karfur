import { GetNeedResponse, GetThemeResponse } from "@refugies-info/api-types";
import { useLocale } from "hooks";
import React from "react";
import styles from "./ResultsSection.module.css";

interface Props {
  theme: GetThemeResponse;
  needs: GetNeedResponse[];
}

const ResultsSection: React.FC<Props> = ({ theme, needs }) => {
  const locale = useLocale();

  return (
    <div className={styles.container}>
      <div>{theme.short[locale]}</div>
      {needs.map((need, i) => (
        <div key={i}>{need[locale].text}</div>
      ))}
    </div>
  );
};

export default ResultsSection;
