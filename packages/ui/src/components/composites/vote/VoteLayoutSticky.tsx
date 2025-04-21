import Button from "@codegouvfr/react-dsfr/Button";
import { cn, ThumbUpAnimated, ThumbUpAnimatedRef } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import React, { forwardRef } from "react";

type VoteLayoutStickyProps = {
  className?: string;
  vote?: boolean | null;
  handleClickYes: () => void;
  handleClickNo: () => void;
  thumbUpRef: React.RefObject<ThumbUpAnimatedRef>;
};

const VoteLayoutSticky = forwardRef<HTMLDivElement, VoteLayoutStickyProps>(
  ({ className, vote, handleClickYes, handleClickNo, thumbUpRef }, ref) => {
    const { t } = useTranslation();

    return (
      <div
        ref={ref}
        className={cn(
          "sticky right-0 bottom-0 left-0 z-[9999] m-auto w-fit",
          "mb-4 flex flex-col gap-2 rounded-[50rem] bg-white py-1 shadow-lg",
          "fixed",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={handleClickYes}
            priority="tertiary no outline"
            className={cn(
              "flex h-[2.5rem] items-end gap-2 !bg-transparent transition-all",
              vote === false && "text-disabled-grey",
            )}
          >
            <div className="relative">
              <span className={cn("fr-icon-thumb-up-line", vote === true ? "opacity-0" : "opacity-100")}></span>
              <ThumbUpAnimated
                ref={thumbUpRef}
                className={cn("absolute bottom-0", vote === true ? "opacity-100" : "opacity-0")}
              />
            </div>

            {t("ui.northStar_useful", "C'est utile ? ✨")}
          </Button>
          <hr className="h-[1rem] w-px bg-gray-300" />
          <Button
            priority="tertiary no outline"
            onClick={handleClickNo}
            className={cn("flex h-[2.5rem] items-end gap-2 transition-all", vote === true && "text-disabled-grey")}
          >
            <span className="fr-icon-thumb-down-line" aria-hidden="true"></span>
            {t("ui.northStar_notTseful", "Pas utile")}
          </Button>
        </div>
      </div>
    );
  },
);

VoteLayoutSticky.displayName = "VoteLayoutSticky";

export default VoteLayoutSticky;
