import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import styles from "./DropdownButton.module.scss";

interface Props {
  label: string;
  value: string[];
  onClick: () => void;
  isOpen: boolean;
  onClear: () => void;
}

export const DropdownButton = ({ label, value, onClick, isOpen, onClear }: Props) => {
  const { t } = useTranslation();
  return (
    <span className={styles.container}>
      <button
        onClick={onClick}
        className={cls(styles.button, isOpen && styles.open, value.length > 0 && styles.values)}
      >
        {value[0] || label}
        {value.length > 1 && (
          <span className={styles.plus}>
            <span>+</span> {value.length - 1}
          </span>
        )}
        {value.length === 0 && <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>}
      </button>

      {value.length > 0 && (
        <button className={styles.clear} onClick={onClear} title={t("Recherche.resetButton")}>
          <i className="ri-close-circle-fill"></i>
        </button>
      )}
    </span>
  );
};
