import Button from "@codegouvfr/react-dsfr/Button";
import { cn, useRTL, useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { useMapContext } from "./MapContext";

export default function CustomControls() {
  const map = useMap();
  const { isFullscreen, setIsFullscreen } = useMapContext();
  const { isMobile, isTablet } = useWindowSize();
  const { i18n } = useTranslation();
  const isRTL = useRTL(i18n.language);
  const [message, setMessage] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setMessage(`Mode plein écran: ${isFullscreen ? "Activé" : "Désactivé"}`);
  }, [isFullscreen]);

  useEffect(() => {
    map.on("zoom", () => {
      setMessage(`Niveau de zoom: ${map.getZoom().toString()}`);
    });
  }, [map]);

  return (
    <div className={cn("absolute top-2 z-[1000] flex flex-col", isRTL ? "left-2" : "right-2")}>
      <Button
        iconId="fr-icon-add-line"
        priority="tertiary"
        size="small"
        title="Zoom in"
        aria-label="Zoomer"
        onClick={() => map.zoomIn()}
        className="!min-h-0 !min-w-0 bg-white !p-2"
      />
      <Button
        iconId="fr-icon-subtract-line"
        priority="tertiary"
        size="small"
        title="Zoom out"
        aria-label="Dézoomer"
        onClick={() => map.zoomOut()}
        className="!min-h-0 !min-w-0 border-t-0 bg-white !p-2"
      />
      <Button
        iconId="fr-icon-fullscreen-line"
        priority="tertiary"
        size="small"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-label={isFullscreen ? "Quitter le plein écran" : "Passer en plein écran"}
        onClick={() => setIsFullscreen(!isFullscreen)}
        aria-hidden={isMobile || isTablet}
        className="hidden !min-h-0 !min-w-0 border-t-0 bg-white !p-2 lg:block"
      />
      <span aria-live="assertive" className="sr-only">
        {message ? message : ""}
      </span>
    </div>
  );
}
