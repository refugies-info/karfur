import { cn } from "@refugies-info/ui";
import React from "react";

type MetaDataCardProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};
export const MetaDataCard = ({ title, className, children }: MetaDataCardProps) => {
  return (
    <div
      className={cn(
        "bg-alt-blue-france border-default-grey mb-4 border p-4 md:mb-0 md:border-0 md:bg-white/50 md:backdrop-blur-[30px]",
        className,
      )}
    >
      {title && <h3 className="text-title-xxs font-bold">{title}</h3>}
      {children}
    </div>
  );
};

MetaDataCard.displayName = "MetaDataCard";
