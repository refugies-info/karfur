"use client";
import { InfoSection } from "@refugies-info/api-types";
import { hasTTSAvailable } from "data/activatedLanguages";
import { useTranslation } from "next-i18next";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "~/components/UI/Toast";
import Tooltip from "~/components/UI/Tooltip";
import { useLocale } from "~/hooks";
import { pauseAudio, readAudio, resumeAudio } from "~/lib/readAudio";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { getTextToRead } from "./functions";
import ReactionModal from "./ReactionModal";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { useWindowSize } from "~/hooks";
import { cn } from "~/lib/classname";

interface Props {
  id: string;
  content: InfoSection | string;
  className?: string;
}

/**
 * Suggestion and TTS buttons
 */
const SectionButtons = ({ id, content, className }: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { isMobile } = useWindowSize();

  // tts
  const [showTtsButtons, setShowTtsButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingTts, setIsLoadingTts] = useState(false);

  const startReading = useCallback(() => {
    if (!showTtsButtons) {
      // start
      readAudio(
        getTextToRead(content),
        locale,
        () => setIsPlaying(false),
        true,
        (val: boolean) => setIsLoadingTts(val),
      );
      setShowTtsButtons(true);
      Event("VOICEOVER", "click section button", "Dispo View");
    } else {
      // resume
      resumeAudio();
    }
    setIsPlaying(true);
  }, [locale, content, showTtsButtons]);

  const pause = useCallback(() => {
    pauseAudio();
    setIsPlaying(false);
  }, []);

  // reactions
  const dispositif = useSelector(selectedDispositifSelector);
  const [showToast, setShowToast] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const tooltipId = `section_${id.replace(".", "_")}`;
  const ttsEnabled = useMemo(() => hasTTSAvailable.includes(locale), [locale]);

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        id={tooltipId}
        iconId="ri-message-2-line"
        onClick={() => setShowReactionModal(true)}
        className="!text-disabled-grey m-0 max-sm:hidden [&::before]:!mr-0"
        priority="tertiary no outline"
        size="small"
        title={t("Dispositif.react")}
      />

      <Tooltip target={tooltipId} placement="right">
        {t("Dispositif.react")}
      </Tooltip>

      {ttsEnabled && (
        <Button
          className={cn(
            "max-sm:border-default-grey text-normal gap-2 rounded-full max-sm:flex max-sm:gap-2 max-sm:border max-sm:bg-white/60 max-sm:p-1 max-sm:pe-2 md:p-0",
          )}
          onClick={isPlaying ? pause : startReading}
          size="small"
          priority="tertiary no outline"
          title={t("listen")}
        >
          <i
            className={cn(
              "bg-action-high-blue-france rounded-full px-2 py-2 text-white md:px-1.5 md:py-0",
              "md:[&::before]:![--icon-size:0.75rem]",
              isLoadingTts ? "fr-icon-refresh-line animate-spin" : isPlaying ? "ri-pause-fill" : "ri-play-fill",
            )}
          />
          {isMobile && t("listen")}
        </Button>
      )}

      {showReactionModal && (
        <ReactionModal
          sectionKey={id}
          toggle={() => setShowReactionModal((o) => !o)}
          dispositifId={dispositif?._id}
          callback={() => setShowToast(true)}
        />
      )}
      <Toast open={showToast} closeCallback={() => setShowToast(false)}>
        {t("Dispositif.reactFeedbackMessage")}
      </Toast>
    </div>
  );
};

export default SectionButtons;
