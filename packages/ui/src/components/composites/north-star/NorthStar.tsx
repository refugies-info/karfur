import { Button as ButtonOriginal } from "@codegouvfr/react-dsfr/Button";
import { ThumbUpAnimated, ThumbUpAnimatedRef } from "@refugies-info/ui";
import { cn } from "@refugies-info/ui/lib/cn";
import { useTranslation } from "next-i18next";
import { useRef } from "react";

// Type assertion to fix compatibility issues with React 18.3.1
const Button = ButtonOriginal as React.ComponentType<any>;

type NorthStarProps = {
  className?: string;
};

export const NorthStar = ({ className }: NorthStarProps) => {
  const { t } = useTranslation();
  const thumbUpRef = useRef<ThumbUpAnimatedRef>(null);

  const handleClick = () => {
    console.log("handleClick");
    if (thumbUpRef.current) {
      console.log(thumbUpRef.current);
      thumbUpRef.current.stop();
      thumbUpRef.current.play();
    }
  };

  return (
    <div className={cn(className)}>
      {t("northStar.title")}
      <Button onClick={handleClick} className="flex h-[2.5rem] items-end gap-2">
        <ThumbUpAnimated ref={thumbUpRef} className="" />
        {/* <div className="relative">
          <span className="fr-icon-thumb-up-line opacity-30" aria-hidden="true"></span>{" "}
        </div> */}
        Oui
      </Button>
    </div>
  );
};

NorthStar.displayName = "NorthStar";
