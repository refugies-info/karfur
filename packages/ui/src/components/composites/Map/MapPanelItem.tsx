import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import type { Poi } from "@refugies-info/api-types";
import { cn, useRTL } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { memo, useState } from "react";
import AdressContent from "./AdressContent";
import { useMapContext } from "./MapContext";

type MapPanelItemProps = {
  id: string;
  poi: Poi;
  className?: string;
};

const AccordionLabel = ({ title, city }: { title: string; city?: string | null }) => {
  return (
    <div className="w-full">
      <span className="text-title-xs mb-2 font-semibold">{title}</span>
      {city && (
        <p className="text-default-grey text-corps-sm mb-0 print:hidden">
          <i className="fr-icon-building-line before:scale-75" aria-hidden="true" />
          {city}
        </p>
      )}
    </div>
  );
};

function MapPanelItem({ id, poi, className }: MapPanelItemProps) {
  const { focusLocation, focusedPoi } = useMapContext();
  const { i18n } = useTranslation();
  const isRTL = useRTL(i18n.language);
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion
      id={id}
      className={cn(
        "border-default-grey h-full w-full cursor-pointer border text-left hover:bg-gray-100 [&:before]:h-0",
        focusedPoi?.title === poi.title && "bg-action-low-blue-france border-default-blue-france",
        isRTL ? "text-right" : "text-left",
        "[&_.fr-collapse]:m-0 [&_.fr-collapse]:p-0",
        className,
      )}
      onExpandedChange={(value) => {
        setExpanded(value);
        if (value) {
          focusLocation?.(poi);
        }
      }}
      expanded={expanded}
      label={<AccordionLabel title={poi.title} city={poi?.city} />}
    >
      <AdressContent poi={poi} />
    </Accordion>
  );
}

export default memo(MapPanelItem);
