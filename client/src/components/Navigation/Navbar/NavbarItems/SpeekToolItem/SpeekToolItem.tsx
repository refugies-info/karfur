import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { hasTTSAvailable } from "data/activatedLanguages";
import { ttsActiveSelector, ttsLoadingSelector } from "services/Tts/tts.selector";
import { toggleTTSActionCreator } from "services/Tts/tts.actions";
import { AvailableLanguageI18nCode } from "types/interface";
import { ToolItem } from "@dataesr/react-dsfr";
import { useTranslation } from "react-i18next";

import styles from "./SpeekToolItem.module.scss";
import { isMobile } from "react-device-detect";

const SpeekToolItem = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ttsActive = useSelector(ttsActiveSelector);
  const ttsLoading = useSelector(ttsLoadingSelector);
  const enabled = !isMobile && hasTTSAvailable.includes((router.locale || "fr") as AvailableLanguageI18nCode);
  const toggleAudio = () => dispatch(toggleTTSActionCreator());

  if (!enabled) return null;

  return (
    <ToolItem
      className={ttsActive ? styles.speek_tool_item_active : ""}
      icon={ttsLoading ? "ri-loader-2-line" : "ri-play-circle-line"}
      onClick={toggleAudio}
    >
      {t("Écouter", "Écouter")}
    </ToolItem>
  );
};

SpeekToolItem.defaultProps = {
  __TYPE: "ToolItem"
};

export default SpeekToolItem;
