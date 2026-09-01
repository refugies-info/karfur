import type { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import Image from "next/image";
import React from "react";

type MetaDataItemProps = {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  state?: "valid" | "invalid";
  /**
   * Balise du conteneur d'enfants. "p" par défaut, "ul" quand les enfants sont une énumération
   * (RGAA 9.3 : un <ul> ne peut pas vivre dans un <p>). En "ul" le conteneur perd puce, retrait
   * et marges, et reçoit role="list" : sans ce rôle explicite, VoiceOver n'annonce plus la nature
   * de liste ni le décompte dès que la puce est masquée (mesuré Safari + VoiceOver, 27/08).
   * C'est la justification de tous les role="list" et role="listitem" posés sur les listes nues
   * du dépôt.
   */
  contentAs?: "p" | "ul";
  /** Classes ajoutées au conteneur d'enfants, pour les cas où sa disposition doit changer. */
  contentClassName?: string;
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
  contentAs = "p",
  contentClassName,
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
          <i className={cn(icon, "[&::before]:![--icon-size:1.5rem]")} />
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
        {children &&
          React.createElement(
            contentAs,
            {
              role: contentAs === "ul" ? "list" : undefined,
              className: cn(
                "md:text-corps-sm relative mb-0 flex h-full flex-wrap gap-2 max-sm:inline [&_a]:inline",
                "before:content-[''] before:bg-border-default-grey before:absolute before:block before:h-full lg:before:w-px ltr:before:-left-5.25 rtl:before:-right-5.25",
                "md:[&_a]:text-sm",
                onClick && "[&_a]:pointer-events-none",
                contentAs === "ul" && "m-0 list-none p-0 [&>li]:p-0",
                contentClassName,
              ),
            },
            children,
          )}
      </div>
      {onClick && (
        <span className="ml-auto flex items-center">
          {state === "invalid" && (
            <i className="fr-icon-warning-fill text-action-high-red-marianne inline-block translate-x-1 scale-75 p-1" />
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
