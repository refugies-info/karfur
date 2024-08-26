import { cls } from "@/lib/classname";
import { toggleTTSActionCreator } from "@/services/Tts/tts.actions";
import { ttsActiveSelector, ttsLoadingSelector } from "@/services/Tts/tts.selector";
import { AvailableLanguageI18nCode } from "@/types/interface";
import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { hasTTSAvailable } from "data/activatedLanguages";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SpeekToolItem.module.scss";

const useSpeekToolItem = (): HeaderProps.QuickAccessItem | null => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ttsActive = useSelector(ttsActiveSelector);
  const ttsLoading = useSelector(ttsLoadingSelector);
  const enabled = hasTTSAvailable.includes((router.locale || "fr") as AvailableLanguageI18nCode);
  const toggleAudio = () => dispatch(toggleTTSActionCreator());

  if (!enabled) return null;

  return {
    buttonProps: {
      onClick: toggleAudio,
      className: cls(ttsActive && styles.speek_tool_item_active),
    },
    iconId: ttsLoading ? "ri-loader-2-line" : "fr-icon-play-circle-line",
    text: t("listen", "Écouter"),
  };
};

export default useSpeekToolItem;
