import { ThemeMenuContext } from "@/components/Pages/recherche/ThemeMenu/ThemeMenuContext";
import Checkbox from "@/components/UI/Checkbox";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "./AllNeedsItem.module.css";

const AllNeedsItem: React.FC = () => {
  const { t } = useTranslation();
  const { selectedThemeId, nbDispositifsByTheme } = useContext(ThemeMenuContext);

  return (
    <Checkbox>
      <span className={styles.container}>
        <span className={styles.label}>{t("Recherche.all", "Tous")}</span>
        <span className={styles.count}>{selectedThemeId ? nbDispositifsByTheme[selectedThemeId.toString()] : ""}</span>
      </span>
    </Checkbox>
  );
};

export default AllNeedsItem;
