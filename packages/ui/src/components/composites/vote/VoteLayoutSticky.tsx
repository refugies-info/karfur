import Button from "@codegouvfr/react-dsfr/Button";
import { cn, ThumbUpAnimated, type ThumbUpAnimatedRef } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import React, { forwardRef } from "react";

type AnnounceOptions = {
  priority?: "interrupt" | "normal";
  delay?: number;
};

type VoteLayoutStickyProps = {
  className?: string;
  vote?: boolean | null;
  handleClickYes: () => void;
  handleClickNo: () => void;
  hasVoted: boolean;
  thumbUpRef: React.RefObject<ThumbUpAnimatedRef | null>;
  onVoteAnnounce?: (message: string, options?: AnnounceOptions) => void;
};

const VoteLayoutSticky = forwardRef<HTMLDivElement, VoteLayoutStickyProps>(
  (
    { className, vote, handleClickYes, handleClickNo, hasVoted, thumbUpRef, onVoteAnnounce },
    ref,
  ) => {
    const { t } = useTranslation();
    const prevHasVoted = React.useRef(hasVoted);

    React.useEffect(() => {
      if (hasVoted && onVoteAnnounce) {
        onVoteAnnounce(t("ui.northStar_thanks", "Merci pour votre retour"), {
          priority: "interrupt",
        });
      } else if (!hasVoted && prevHasVoted.current && onVoteAnnounce) {
        onVoteAnnounce(t("ui.northStar_vote_cancelled", "Votre vote a été retiré"), {
          priority: "interrupt",
        });
      }
      prevHasVoted.current = hasVoted;
    }, [hasVoted, onVoteAnnounce, t]);

    return (
      <div
        ref={ref}
        className={cn(
          "sticky right-0 bottom-6 left-0 z-[9999] m-auto mt-4 w-fit border-1 border-white",
          "border-default-grey mb-4 flex flex-col rounded-[50rem] bg-white shadow-lg",
          className,
        )}
      >
        <div className="flex items-center">
          <Button
            onClick={handleClickYes}
            priority={vote === true ? "primary" : "secondary"}
            className={cn(
              "flex h-[2.5rem] items-end gap-2 rounded-s-[50rem] shadow-none transition-all",
              vote === false && "text-disabled-grey",
            )}
          >
            <div className="relative">
              <span
                className={cn("fr-icon-thumb-up-line", vote === true ? "opacity-0" : "opacity-100")}
              ></span>
              <ThumbUpAnimated
                ref={thumbUpRef as React.RefObject<ThumbUpAnimatedRef>}
                className={cn("absolute bottom-0", vote === true ? "opacity-100" : "opacity-0")}
                themeId="light"
              />
            </div>
            <span>
              {t("ui.northStar_useful", "C'est utile ?")} <span aria-hidden="true">✨</span>
            </span>
          </Button>
          <hr className="h-[1rem] w-px bg-gray-300" />
          <Button
            priority={vote === false ? "primary" : "secondary"}
            onClick={handleClickNo}
            className={cn(
              "flex h-[2.5rem] items-end gap-2 rounded-e-[50rem] shadow-none transition-all",
              vote === true && "text-disabled-grey",
            )}
          >
            <span className="fr-icon-thumb-down-line" aria-hidden="true"></span>
            {t("ui.northStar_notUseful", "Pas utile")}
          </Button>
        </div>
      </div>
    );
  },
);

VoteLayoutSticky.displayName = "VoteLayoutSticky";

export default VoteLayoutSticky;
