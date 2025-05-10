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
        className="!text-disabled-grey m-0 [&::before]:!mr-0"
        priority="tertiary no outline"
        size="small"
        title={t("Dispositif.react")}
      />

      <Tooltip target={tooltipId} placement="right">
        {t("Dispositif.react")}
      </Tooltip>

      {ttsEnabled && (
        <Button
          iconId={!isPlaying ? "ri-play-fill" : isLoadingTts ? "fr-icon-refresh-line" : "ri-pause-fill"}
          className={cn(
            "rounded-full",
            "!min-h-6 !w-6 !px-1.5 !py-0 !text-white",
            "[&::before]:!mr-0 [&::before]:![--icon-size:0.75rem]",
            isLoadingTts && "animate-spin",
          )}
          onClick={isPlaying ? pause : startReading}
          size="small"
          title={t("listen")}
        />
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
