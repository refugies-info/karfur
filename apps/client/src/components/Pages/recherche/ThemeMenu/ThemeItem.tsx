import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ThemeItem.module.css";
import { ThemeMenuContext } from "./ThemeMenuContext";

type ThemeItemProps = {
  color: string;
  id: string;
  label: string;
  needCount: number;
  selected: boolean;
  isFirst: boolean;
};

const ThemeItem: React.FC<ThemeItemProps> = ({ color, id, label, needCount, selected, isFirst }) => {
  const { setSelectedThemeId } = useContext(ThemeMenuContext);
  const { t } = useTranslation();

  const ariaLabel = needCount ? `${label} ${t("Recherche.selectedFiltersCount", { count: needCount })}` : label;

  return (
    <button
      className={styles.container}
      style={
        selected
          ? {
              backgroundColor: color,
            }
          : undefined
      }
      onClick={() => setSelectedThemeId(id)}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={`tabpanel-${id}`}
      id={`tab-${id}`}
      tabIndex={selected ? 0 : isFirst ? 0 : -1}
      aria-label={ariaLabel}
    >
      <div className={styles.zone}>
        <span className={styles.label}>{label}</span>
        {needCount && needCount > 0 && (
          <div className={styles.countContainer} aria-hidden="true">
            <span
              style={{
                color: selected ? color : "white",
              }}
              className={styles.count}
            >
              {needCount || 0}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default ThemeItem;
