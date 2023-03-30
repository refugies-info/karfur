import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { ToolItem } from "@dataesr/react-dsfr";
import { hasTTSAvailable } from "data/activatedLanguages";
import { cls } from "lib/classname";
import { ttsActiveSelector, ttsLoadingSelector } from "services/Tts/tts.selector";
import { toggleTTSActionCreator } from "services/Tts/tts.actions";
import { AvailableLanguageI18nCode } from "types/interface";
import Tooltip from "components/UI/Tooltip";
import styles from "./SpeekToolItem.module.scss";

const SpeekToolItem = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ttsActive = useSelector(ttsActiveSelector);
  const ttsLoading = useSelector(ttsLoadingSelector);
  const enabled = !isMobile && hasTTSAvailable.includes((router.locale || "fr") as AvailableLanguageI18nCode);
  const toggleAudio = () => dispatch(toggleTTSActionCreator());

  const isEditionMode = useMemo(() => {
    return ["/dispositif", "/demarche", "/dispositif/[id]/edit", "/demarche/[id]/edit"].includes(router.pathname);
  }, [router.pathname]);

  if (!enabled) return null;

  return (
    <span id="speek-tool-item">
      <ToolItem
        className={cls(ttsActive && styles.speek_tool_item_active)}
        icon={ttsLoading ? "ri-loader-2-line" : "ri-play-circle-line"}
        onClick={!isEditionMode ? toggleAudio : undefined}
      >
        {t("Écouter", "Écouter")}
      </ToolItem>

      {isEditionMode && (
        <Tooltip target="speek-tool-item" placement="bottom">
          L'écoute du site est désactivée lorsque vous rédigez une fiche.
        </Tooltip>
      )}
    </span>
  );
};

SpeekToolItem.defaultProps = {
  __TYPE: "ToolItem",
};

export default SpeekToolItem;
