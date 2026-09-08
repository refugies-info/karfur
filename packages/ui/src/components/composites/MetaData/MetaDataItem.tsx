import type { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import Image from "next/image";
import type React from "react";

type MetaDataItemProps = {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  state?: "valid" | "invalid";
} & (
  | { icon: FrIconClassName | RiIconClassName; logoImage?: never }
  | { icon?: never; logoImage: { url: string; alt?: string } }
  | { icon?: never; logoImage?: never }
);
export const MetaDataItem = ({
  icon,
  logoImage,
  className,
  title,
  children,
  onClick,
  state,
}: MetaDataItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <li
      onClick={onClick && handleClick}
      className={cn(
        "relative mb-4 flex items-start gap-2",
        onClick && "cursor-pointer",
        state === "invalid" && "[&_*]:!text-action-high-red-marianne",
        className,
      )}
    >
      {icon &&
        (typeof icon === "string" ? (
          <i className={cn(icon, "[&::before]:![--icon-size:1.5rem]")} aria-hidden="true" />
        ) : (
          icon
        ))}
      {logoImage && (
        <Image src={logoImage.url} width={32} height={32} className="w-6 object-contain" alt="" />
      )}
      <div className="md:flex md:flex-col ltr:text-left rtl:text-right">
        {title && (
          <h3 className="text-corps-md md:text-corps-sm mb-0 max-sm:float-left max-sm:mr-1 max-sm:inline max-sm:w-fit max-sm:after:content-['_:']">
            {title}
          </h3>
        )}
        {children && (
          <p
            className={cn(
              "md:text-corps-sm relative mb-0 flex h-full flex-wrap gap-2 max-sm:inline [&_a]:inline",
              "before:content-[''] before:bg-border-default-grey before:absolute before:block before:h-full lg:before:w-px ltr:before:-left-5.25 rtl:before:-right-5.25",
              "md:[&_a]:text-sm",
              onClick && "[&_a]:pointer-events-none",
            )}
          >
            {children}
          </p>
        )}
      </div>
      {onClick && (
        <span className="ml-auto flex items-center">
          {state === "invalid" && (
            <i
              className="fr-icon-warning-fill text-action-high-red-marianne inline-block translate-x-1 scale-75 p-1"
              aria-hidden="true"
            />
          )}
          <Button
            iconId="fr-icon-edit-line"
            priority="tertiary no outline"
            size="small"
            className="min-h-0 flex-none p-1 before:m-0"
            aria-label="Modifier"
            title="Modifier"
            onClick={onClick}
          />
        </span>
      )}
    </li>
  );
};

MetaDataItem.displayName = "MetaDataItem";
