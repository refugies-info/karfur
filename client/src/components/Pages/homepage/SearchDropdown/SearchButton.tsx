import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import EVAIcon from "components/UI/EVAIcon";
import { cls } from "lib/classname";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SearchButton.module.css";

interface Props {
  open: boolean;
  icon: string;
  label: string;
  values: string[];
}

const SearchButton: React.FC<Props> = ({ icon, label, open, values }) => {
  const { t } = useTranslation();

  const active = useMemo(() => {
    return open || values.length > 0;
  }, [open, values]);

  const iconColor = useMemo(() => {
    return active ? "white" : "black";
  }, [active]);

  return (
    <DropdownMenu.Trigger asChild>
      <div className={styles.container}>
        <div className={cls(styles.iconContainer, active && styles.iconContainerActive)}>
          <EVAIcon name={icon} fill={iconColor} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>{label}</span>
          <span className={styles.values}>{values.length > 0 ? values.join(", ") : t("Recherche.all", "Tous")}</span>
        </div>
      </div>
    </DropdownMenu.Trigger>
  );
};

export default SearchButton;
