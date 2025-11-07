import Button from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import React, { HTMLAttributes, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

type MetaDataCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  onDelete?: () => void;
  state?: "valid" | "invalid";
  mode?: "edit" | "view";
  titleAs?: "p" | "span" | "h2" | "h3" | "h4" | "h5" | "h6";
};
export const MetaDataCard = ({
  title,
  className,
  children,
  onClick,
  onDelete,
  state,
  mode,
  titleAs = "h2",
  ...props
}: MetaDataCardProps) => {
  const uuid = useMemo(() => uuidv4(), []);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete?.();
  };

  return (
    <div
      className={cn(
        "bg-alt-blue-france border-default-grey @container mb-4 border p-4 lg:mb-0 lg:border-0 lg:bg-white/50 lg:backdrop-blur-[30px]",
        onClick && "hover:cursor-pointer",
        mode || state ? "relative" : "",
        onClick && state === "invalid" && "[&_*]:!text-action-high-red-marianne",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        {title &&
          React.createElement(
            titleAs,
            { id: `metadata-title-${uuid}`, className: "text-title-md md:text-title-xxs font-bold" },
            title,
          )}
        {(onClick || onDelete) && (
          <span className="ml-auto flex self-start">
            {onClick && (
              <>
                {state === "invalid" && (
                  <i className="fr-icon-warning-fill text-action-high-red-marianne inline-block translate-x-1 scale-75 p-1" />
                )}
                <Button
                  iconId="fr-icon-edit-line"
                  priority="tertiary no outline"
                  size="small"
                  aria-label="Modifier"
                  title="Modifier"
                  onClick={handleClick}
                />
                <button
                  onClick={handleClick}
                  className="absolute inset-0 z-1 bg-transparent"
                  aria-label="Modifier"
                ></button>
              </>
            )}
            {onDelete && (
              <Button
                iconId="fr-icon-delete-bin-line"
                priority="tertiary no outline"
                size="small"
                onClick={handleDelete}
                title="Supprimer"
              />
            )}
          </span>
        )}
      </div>
      <ul className="list-none p-0" aria-labelledby={`metadata-title-${uuid}`}>
        {children}
      </ul>
    </div>
  );
};

MetaDataCard.displayName = "MetaDataCard";
