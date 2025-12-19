"use client";
import Button from "@codegouvfr/react-dsfr/Button";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { InfoSection } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import { hasTTSAvailable } from "data/activatedLanguages";
import { useTranslation } from "next-i18next";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "~/components/UI/Toast";
import { useLocale } from "~/hooks";
import { cn } from "~/lib/classname";
import { pauseAudio, readAudio, resumeAudio } from "~/lib/readAudio";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { getTextToRead } from "./functions";
import ReactionModal from "./ReactionModal";

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
  const { isMobile, isTablet, isDesktop } = useWindowSize();

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
  const reactionButtonRef = useRef<HTMLButtonElement>(null);
  const tooltipId = `section_${id.replace(".", "_")}`;
  const ttsEnabled = useMemo(() => hasTTSAvailable.includes(locale), [locale]);

  const handleModalCallBack = () => {
    setShowToast(true);
    // Focus is now handled by Radix's onCloseAutoFocus
    // Announcement is now handled inside ReactionModal before closing
  };

  return (
    <div className={cn("flex items-center print:hidden", className)}>
      <Tooltip kind="hover" title={t("Dispositif.react")}>
        <Button
          ref={reactionButtonRef}
          id={tooltipId}
          iconId="ri-message-2-line"
          onClick={() => setShowReactionModal(true)}
          className="!text-disabled-grey m-0 max-lg:hidden [&::before]:!mr-0"
          priority="tertiary no outline"
          size="small"
          title={t("Dispositif.react")}
        />
      </Tooltip>

      {ttsEnabled ? (
        <Tooltip kind="hover" title={t("listen")}>
          <Button
            className={cn(
              "max-lg:border-default-grey text-normal gap-2 rounded-full max-lg:flex max-lg:border max-lg:bg-white/60 max-lg:p-1 max-lg:pe-2 xl:p-0",
            )}
            onClick={isPlaying ? pause : startReading}
            size="small"
            priority="tertiary no outline"
            title={t("listen")}
          >
            <i
              className={cn(
                "bg-action-high-blue-france rounded-full px-1 py-1 text-white lg:px-1.5 lg:py-0",
                "lg:[&::before]:![--icon-size:0.75rem]",
                isLoadingTts ? "fr-icon-refresh-line animate-spin" : isPlaying ? "ri-pause-fill" : "ri-play-fill",
              )}
            />
            {isMobile || isTablet ? t("listen") : ""}
          </Button>
        </Tooltip>
      ) : null}

      <ReactionModal
        open={showReactionModal}
        sectionKey={id}
        onOpenChange={setShowReactionModal}
        dispositifId={dispositif?._id}
        callback={handleModalCallBack}
        triggerRef={reactionButtonRef}
      />
      <Toast open={showToast} closeCallback={() => setShowToast(false)}>
        {t("Dispositif.reactFeedbackMessage")}
      </Toast>
    </div>
  );
};

export default SectionButtons;
