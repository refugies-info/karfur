import React from "react";
import { Spinner } from "reactstrap";
import { useTranslation } from "react-i18next";
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
      <div
        className={
          styles.audio_btn + " mr-10 " + (props.ttsActive ? styles.pressed : "")
        }
        onClick={props.toggleAudio}
      >
        {props.ttsLoading ? (
          <Spinner color="light" className="ml-15" />
        ) : (
          <EVAIcon
            name={"volume-up" + (props.ttsActive ? "" : "-outline")}
            fill={props.ttsActive ? "#FFFFFF" : colors.noir}
            id="audioBtn"
            className={styles.icon}
          />
        )}
        <div className={styles.text}>{t("Écouter", "Écouter")}</div>
      </div>
    );
  }
  return null;
};

export default AudioBtn;
