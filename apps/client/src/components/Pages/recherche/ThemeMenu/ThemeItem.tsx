import React, { useContext } from "react";
import styles from "./ThemeItem.module.css";
import { ThemeMenuContext } from "./ThemeMenuContext";

interface Props {
  color: string;
  id: string;
  label: string;
  needCount: number;
  selected: boolean;
}

const ThemeItem: React.FC<Props> = ({ color, id, label, needCount, selected }) => {
  const { setSelectedThemeId } = useContext(ThemeMenuContext);

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
    >
      <div className={styles.zone}>
        <span className={styles.label}>{label}</span>
        {needCount && needCount > 0 && (
          <div className={styles.countContainer}>
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
