import React from "react";
import { Modal } from "reactstrap";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Theme } from "types/interface";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { useRouter } from "next/router";
import { getThemeName } from "lib/getThemeName";
import ThemeIcon from "components/UI/ThemeIcon";
import styles from "./MobileTagsModal.module.scss";

interface ThemeButtonProps {
  theme: Theme;
  onClick: () => void;
}
const ThemeButton = (props: ThemeButtonProps) => {
  const router = useRouter();
  return (
    <button
      onClick={props.onClick}
      className={`${styles.filter_btn} ${styles.theme}`}
      style={{ backgroundColor: props.theme.colors.color100 }}
    >
      {getThemeName(props.theme, router.locale)}
      <ThemeIcon theme={props.theme} />
    </button>
  );
};

interface Props {
  selectOption: (id: string) => void;
  toggle: () => void;
  show: boolean;
}

export const MobileTagsModal = (props: Props) => {
  const { t } = useTranslation();

  const themes = useSelector(themesSelector);

  const selectOption = (item: string) => {
    props.selectOption(item);
    props.toggle();
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <div className={styles.title}>
        <p className={styles.title_text}> {t("Homepage.need", "J'ai besoin de")}</p>
        <button className={styles.title_btn} onClick={props.toggle}>
          {t("Homepage.theme", "thème")}
          <EVAIcon name="close" fill="#FFFFFF" size="large" />
        </button>
      </div>
      {themes.map((theme, index: number) => (
        <div key={index}>
          <ThemeButton theme={theme} onClick={() => selectOption(theme._id.toString())} />
        </div>
      ))}
    </Modal>
  );
};
