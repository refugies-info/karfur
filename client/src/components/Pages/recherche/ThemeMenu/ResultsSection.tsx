import { GetNeedResponse, GetThemeResponse } from "@refugies-info/api-types";
import Checkbox from "components/UI/Checkbox";
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
      <div className={styles.theme}>{theme.short[locale]}</div>
      <div className={styles.needs}>
        {needs.map((need, i) => (
          <Checkbox key={i}>{need[locale].text}</Checkbox>
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
