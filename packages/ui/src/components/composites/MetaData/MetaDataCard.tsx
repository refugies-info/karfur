import Button from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import React, { HTMLAttributes } from "react";

type MetaDataCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  onDelete?: () => void;
  state?: "valid" | "invalid";
  mode?: "edit" | "view";
};
export const MetaDataCard = ({
  title,
  className,
  children,
  onClick,
  onDelete,
  state,
  mode,
  ...props
}: MetaDataCardProps) => {
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
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        {title && <h2 className="text-title-xxs font-bold">{title}</h2>}
        {(onClick || onDelete) && (
          <span className="ml-auto flex self-start">
            {onClick && (
              <Button
                iconId="fr-icon-edit-line"
                priority="tertiary no outline"
                size="small"
                aria-label="Modifier"
                title="Modifier"
                onClick={handleClick}
              />
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
      {children}
    </div>
  );
};

MetaDataCard.displayName = "MetaDataCard";
