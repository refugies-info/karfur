import { Poi } from "@refugies-info/api-types";
import { cn, useRTL } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { memo } from "react";
import { useMapContext } from "./MapContext";

type MapPanelItemProps = {
  id: string;
  poi: Poi;
  className?: string;
};

function MapPanelItem({ id, poi, className }: MapPanelItemProps) {
  const { focusLocation, focusedPoi } = useMapContext();
  const { i18n } = useTranslation();
  const isRTL = useRTL(i18n.language);

  return (
    <button
      id={id}
      className={cn(
        "border-default-grey w-full cursor-pointer border p-4 text-left hover:bg-gray-100",
        focusedPoi?.title === poi.title && "bg-action-low-blue-france border-default-blue-france",
        isRTL ? "text-right" : "text-left",
        className,
      )}
      onClick={() => {
        focusLocation?.(poi);
      }}
    >
      <h3 className="text-title-xs mb-2">{poi.title}</h3>
      {poi.city && (
        <p className="text-default-grey text-corps-sm mb-0 print:hidden">
          <i className="fr-icon-building-line before:scale-75" />
          {poi.city}
        </p>
      )}
      {poi.address && (
        <p className="hidden print:block" aria-hidden="true">
          {poi.address}
        </p>
      )}
    </button>
  );
}

export default memo(MapPanelItem);
