import { Button } from "@codegouvfr/react-dsfr/Button";
import { ThumbUpAnimated, ThumbUpAnimatedRef } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";

import { cn } from "@refugies-info/ui";

type VoteProps = {
  className?: string;
  onVoteYes?: () => void;
  onVoteNo?: () => void;
  onCancelYes?: () => void;
  onCancelNo?: () => void;
  onVoteUpdate?: (vote: "yes" | "no") => void;
  isFixed?: boolean;
};

export const Vote = ({
  className,
  onVoteYes,
  onVoteNo,
  onCancelYes,
  onCancelNo,
  onVoteUpdate,
  isFixed = true,
}: VoteProps) => {
  const { t } = useTranslation();

  const [hasVoted, setHasVoted] = useState(false);
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  const thumbUpRef = useRef<ThumbUpAnimatedRef>(null);

  const handleClickYes = () => {
    if (vote === "yes") {
      // already voted
      setHasVoted(false);
      setVote(null);
      if (onCancelYes) {
        onCancelYes();
      }
      return;
    }

    setVote("yes");

    if (hasVoted && onVoteUpdate) {
      onVoteUpdate("yes");
      return;
    }
    if (onVoteYes) {
      onVoteYes();
    }

    setHasVoted(false);
    if (thumbUpRef.current) {
      thumbUpRef.current.stop();
      thumbUpRef.current.play();
    }

    setHasVoted(true);
  };

  const handleClickNo = () => {
    if (vote === "no") {
      // already voted
      setHasVoted(false);
      setVote(null);
      if (onCancelNo) {
        onCancelNo();
      }
      return;
    }

    setHasVoted(false);
    setVote("no");
    setHasVoted(true);

    if (onVoteNo) {
      onVoteNo();
    }
  };

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-2 bg-white p-4 shadow-lg",
        isFixed && "max-sm:fixed max-sm:right-0 max-sm:bottom-0 max-sm:left-0",
        className,
      )}
    >
      <p className="mb-2">{t("ui.northStar_title", "Cette page vous a-t-elle été utile ? ✨")}</p>

      <div className="flex gap-2">
        <Button
          onClick={handleClickYes}
          priority={vote === "yes" ? "primary" : "secondary"}
          className={cn("flex h-[2.5rem] items-end gap-2 transition-all")}
        >
          <div className="relative">
            <span className={cn("fr-icon-thumb-up-line", vote === "yes" ? "opacity-0" : "opacity-100")}></span>
            <ThumbUpAnimated
              ref={thumbUpRef}
              className={cn("absolute bottom-0", vote === "yes" ? "opacity-100" : "opacity-0")}
            />
          </div>

          {t("ui.northStar_yes", "Oui")}
        </Button>
        <Button
          priority={vote === "no" ? "primary" : "secondary"}
          onClick={handleClickNo}
          className={cn("flex h-[2.5rem] items-end gap-2 transition-all")}
        >
          <span className="fr-icon-thumb-down-line" aria-hidden="true"></span> {t("ui.northStar_no", "Non")}
        </Button>
      </div>
      <p
        className={cn(
          "m-0 overflow-hidden transition-[max-height] delay-200 duration-500",
          hasVoted ? "max-h-[1000px]" : "max-h-0",
          vote === "yes" && "delay-1000",
        )}
        aria-hidden={hasVoted ? false : true}
        aria-live={hasVoted ? "assertive" : "off"}
      >
        {vote === "yes" && t("ui.northStar_thanks", "Merci pour votre retour 😊")}
        {vote === "no" && t("ui.northStar_sorry", "Nous sommes navrés... 😞")}
      </p>
    </div>
  );
};

Vote.displayName = "Vote";
