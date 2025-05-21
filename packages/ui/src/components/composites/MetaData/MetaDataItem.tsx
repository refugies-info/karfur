import { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import React from "react";

type MetaDataItemProps = {
  icon?: FrIconClassName | RiIconClassName;
  className?: string;
  title?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};
export const MetaDataItem = ({ icon, className, title, children, onClick }: MetaDataItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <div onClick={handleClick} className={cn("relative mb-4 flex gap-2", onClick && "cursor-pointer", className)}>
      {icon && (typeof icon === "string" ? <i className={cn(icon, "[&::before]:![--icon-size:1.36rem]")} /> : icon)}
      <div className="flex flex-col ltr:text-left rtl:text-right">
        {title && <h4 className="text-corps-sm mb-0">{title}</h4>}
        {children && (
          <div
            className={cn(
              "text-corps-sm relative mb-0 h-full [&_a]:inline",
              "before:content before:bg-border-default-grey before:absolute before:-left-4.75 before:block before:h-full before:w-px",
              onClick && "[&_a]:pointer-events-none",
            )}
          >
            {children}
          </div>
        )}
      </div>
      {onClick && (
        <Button
          iconId="fr-icon-edit-line"
          className="ml-auto self-start p-2"
          priority="tertiary no outline"
          size="small"
          aria-label="Modifier"
          title="Modifier"
        />
      )}
    </div>
  );
};

MetaDataItem.displayName = "MetaDataItem";
