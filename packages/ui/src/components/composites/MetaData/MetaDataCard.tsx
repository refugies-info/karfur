import { cn } from "@refugies-info/ui";
import React, { HTMLAttributes } from "react";

type MetaDataCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  state?: "valid" | "invalid";
  mode?: "edit" | "view";
};
export const MetaDataCard = ({ title, className, children, onClick, state, mode, ...props }: MetaDataCardProps) => {
  return (
    <div
      className={cn(
        "bg-alt-blue-france border-default-grey mb-4 border p-4 md:mb-0 md:border-0 md:bg-white/50 md:backdrop-blur-[30px]",
        onClick && "hover:cursor-pointer",
        mode || state ? "relative" : "",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {/* <span className="absolute top-0 left-0 h-full w-full">
        {state === "valid" && <i className="fr-icon-check-line" />}
        {state === "invalid" && <i className="fr-icon-exclamation-line" />}
      </span> */}

      {title && <h3 className="text-title-xxs font-bold">{title}</h3>}
      {children}
    </div>
  );
};

MetaDataCard.displayName = "MetaDataCard";
