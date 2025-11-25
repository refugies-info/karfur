import Button from "@codegouvfr/react-dsfr/Button";
import { cn, ThumbUpAnimated, ThumbUpAnimatedRef } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import React, { forwardRef, useEffect, useRef } from "react";

type AnnounceOptions = {
  priority?: "interrupt" | "normal";
  delay?: number;
};

type VoteLayoutStandardProps = {
  className?: string;
  vote?: boolean | null;
  handleClickYes: () => void;
  handleClickNo: () => void;
  hasVoted: boolean;
  thumbUpRef: React.RefObject<ThumbUpAnimatedRef>;
  onVoteAnnounce?: (message: string, options?: AnnounceOptions) => void;
};

const VoteLayoutStandard = forwardRef<HTMLDivElement, VoteLayoutStandardProps>(
  ({ className, vote, handleClickYes, handleClickNo, hasVoted, thumbUpRef, onVoteAnnounce }, ref) => {
    const { t } = useTranslation();
    const prevHasVoted = useRef(hasVoted);
    const prevHasVoted = useRef(hasVoted);

    useEffect(() => {
      if (hasVoted && onVoteAnnounce) {
        onVoteAnnounce(t("ui.northStar_thanks", "Merci pour votre retour"), { priority: "interrupt" });
      } else if (!hasVoted && prevHasVoted.current && onVoteAnnounce) {
        onVoteAnnounce(t("ui.northStar_vote_cancelled", "Votre vote a été retiré"), { priority: "interrupt" });
        onVoteAnnounce(t("ui.northStar_thanks", "Merci pour votre retour"), { priority: "interrupt" });
      } else if (!hasVoted && prevHasVoted.current && onVoteAnnounce) {
        onVoteAnnounce(t("ui.northStar_vote_cancelled", "Votre vote a été retiré"), { priority: "interrupt" });
      }
      prevHasVoted.current = hasVoted;
    }, [hasVoted, onVoteAnnounce, t]);

    return (
      <div ref={ref} className={cn("mb-4 flex flex-col gap-2 rounded-sm bg-white p-4 shadow-lg", className)}>
        <p className="mb-2 text-xl font-bold">
          {t("ui.northStar_title", "Cette page vous a-t-elle été utile ?")} <span aria-hidden="true">✨</span>
        </p>
        <p className="mb-2 text-xl font-bold">
          {t("ui.northStar_title", "Cette page vous a-t-elle été utile ?")} <span aria-hidden="true">✨</span>
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleClickYes}
            priority={vote === true ? "primary" : "secondary"}
            className={cn("flex h-[1.7rem] w-full items-end gap-2 transition-all")}
            size="small"
          >
            <div className="relative" aria-hidden="true">
              <span
                aria-hidden="true"
                className={cn("fr-icon-thumb-up-line", vote === true ? "opacity-0" : "opacity-100")}
              ></span>
            <div className="relative" aria-hidden="true">
              <span
                aria-hidden="true"
                className={cn("fr-icon-thumb-up-line", vote === true ? "opacity-0" : "opacity-100")}
              ></span>
              <ThumbUpAnimated
                ref={thumbUpRef as React.RefObject<ThumbUpAnimatedRef>}
                className={cn("absolute bottom-0", vote === true ? "opacity-100" : "opacity-0")}
                themeId="light"
              />
            </div>

            {t("ui.northStar_yes", "Oui")}
          </Button>
          <Button
            priority={vote === false ? "primary" : "secondary"}
            onClick={handleClickNo}
            className={cn("flex h-[1.7rem] w-full items-end gap-2 transition-all")}
            size="small"
          >
            <span className="fr-icon-thumb-down-line" aria-hidden="true"></span> {t("ui.northStar_no", "Non")}
          </Button>
        </div>
        <p
          className={cn(
            "m-0 overflow-hidden text-sm transition-[max-height] delay-200 duration-500",
            hasVoted ? "max-h-[1000px]" : "max-h-0",
            vote === true && "delay-1000",
          )}
          aria-hidden="true"
          aria-hidden="true"
        >
          {t("ui.northStar_thanks", "Merci pour votre retour")} ☺️
          {t("ui.northStar_thanks", "Merci pour votre retour")} ☺️
        </p>
      </div>
    );
  },
);

VoteLayoutStandard.displayName = "VoteLayoutStandard";

export default VoteLayoutStandard;
