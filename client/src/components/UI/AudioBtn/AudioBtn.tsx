import React from "react";
import { Spinner } from "reactstrap";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import styles from "./AudioBtn.module.scss";

interface Props {
  toggleAudio: any;
  enabled: boolean;
  ttsActive: boolean;
  ttsLoading: boolean;
}

const AudioBtn = (props: Props) => {
  const { t } = useTranslation();

  if (props.enabled) {
    return (
      <button
        className={styles.audio_btn + " me-2 " + (props.ttsActive ? styles.pressed : "")}
        onClick={props.toggleAudio}
      >
        {props.ttsLoading ? (
          <Spinner color="light" className="ms-4" />
        ) : (
          <EVAIcon
            name={"volume-up" + (props.ttsActive ? "" : "-outline")}
            fill={props.ttsActive ? "#FFFFFF" : colors.gray90}
            id="audioBtn"
            className={styles.icon}
          />
        )}
        <div className={styles.text}>{t("Écouter", "Écouter")}</div>
      </button>
    );
  }
  return null;
};

export default AudioBtn;
