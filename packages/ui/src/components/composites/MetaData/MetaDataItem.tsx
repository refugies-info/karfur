import { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import Image from "next/image";
import React from "react";

type MetaDataItemProps = {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  onClick?: () => void;
} & (
  | { icon: FrIconClassName | RiIconClassName; logoImage?: never }
  | { icon?: never; logoImage: { url: string; alt?: string } }
  | { icon?: never; logoImage?: never }
);
export const MetaDataItem = ({ icon, logoImage, className, title, children, onClick }: MetaDataItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={cn("relative mb-4 flex items-start gap-2", onClick && "cursor-pointer", className)}
    >
      {icon && (typeof icon === "string" ? <i className={cn(icon, "[&::before]:![--icon-size:1.36rem]")} /> : icon)}
      {logoImage && (
        <Image src={logoImage.url} width={32} height={32} className="w-6 object-contain" alt={logoImage?.alt || ""} />
      )}
      <div className="flex flex-col ltr:text-left rtl:text-right">
        {title && <h3 className="text-corps-sm mb-0">{title}</h3>}
        {children && (
          <div
            className={cn(
              "text-corps-sm relative mb-0 h-full [&_a]:inline",
              "before:content before:bg-border-default-grey before:absolute before:block before:h-full lg:before:w-px ltr:before:-left-4.75 rtl:before:-right-4.75",
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
          className="ml-auto flex-none self-start p-2"
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
