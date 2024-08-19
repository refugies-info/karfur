import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import EVAIcon from "components/UI/EVAIcon";
import { cls } from "lib/classname";
import { onEnterOrSpace } from "lib/onEnterOrSpace";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SearchButton.module.css";

interface Props {
  open: boolean;
  icon: string;
  label: string;
  values: string[];
  onClickCross: () => void;
}

const SearchButton: React.FC<Props> = ({ icon, label, open, values, onClickCross }) => {
  const { t } = useTranslation();

  const active = useMemo(() => {
    return open || values.length > 0;
  }, [open, values]);

  const iconColor = useMemo(() => {
    return active ? "white" : "black";
  }, [active]);

  const [handleCloseButton, setHandleCloseButton] = React.useState(false);

  return (
    <DropdownMenu.Trigger asChild>
      <div className={styles.container} onPointerDown={(e) => handleCloseButton && e.preventDefault()}>
        <div className={styles.zone}>
          <div className={cls(styles.iconContainer, active && styles.iconContainerActive)}>
            <EVAIcon name={icon} fill={iconColor} />
          </div>
          <div className={styles.content}>
            <span className={styles.label}>{label}</span>
            <div className={styles.valuesContainer}>
              <span className={cls(styles.values, values.length > 0 && styles.bold)}>
                {values.length > 0 ? values.join(", ") : t("Recherche.all", "Tous")}
              </span>
              {values.length > 0 && (
                <div
                  className={styles.closeButton}
                  role="button"
                  tabIndex={0}
                  onFocus={() => setHandleCloseButton(true)}
                  onBlur={() => setHandleCloseButton(false)}
                  onMouseEnter={() => setHandleCloseButton(true)}
                  onMouseLeave={() => setHandleCloseButton(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHandleCloseButton(false);
                    onClickCross();
                  }}
                  onKeyDown={(e) =>
                    onEnterOrSpace(e, () => {
                      e.stopPropagation();
                      setHandleCloseButton(false);
                      onClickCross();
                    })
                  }
                >
                  <EVAIcon name="close-outline" fill="dark" size={20} className={styles.closeButtonIcon} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DropdownMenu.Trigger>
  );
};

export default SearchButton;
