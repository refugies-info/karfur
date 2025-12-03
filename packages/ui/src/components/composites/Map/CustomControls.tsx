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
  const { t, i18n } = useTranslation();
  const isRTL = useRTL(i18n.language);
  const [message, setMessage] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setMessage(
      t("map.fullscreen_status", { status: isFullscreen ? t("map.enabled") : t("map.disabled") }),
    );
  }, [isFullscreen]);

  useEffect(() => {
    const onZoom = () => {
      setMessage(t("map.zoom_level", { level: map.getZoom().toString() }));
    };
    map.on("zoom", onZoom);

    return () => {
      map.off("zoom", onZoom);
    };
  }, [map]);

  return (
    <div className={cn("absolute top-2 z-[1000] flex flex-col", isRTL ? "left-2" : "right-2")}>
      <Button
        iconId="fr-icon-add-line"
        priority="tertiary"
        size="small"
        title="Zoom in"
        aria-label={t("map.zoom_in")}
        onClick={() => map.zoomIn()}
        className="!min-h-0 !min-w-0 bg-white !p-2"
      />
      <Button
        iconId="fr-icon-subtract-line"
        priority="tertiary"
        size="small"
        title="Zoom out"
        aria-label={t("map.zoom_out")}
        onClick={() => map.zoomOut()}
        className="!min-h-0 !min-w-0 border-t-0 bg-white !p-2"
      />
      <Button
        iconId="fr-icon-fullscreen-line"
        priority="tertiary"
        size="small"
        title={isFullscreen ? t("map.exit_fullscreen") : t("map.enter_fullscreen")}
        aria-label={isFullscreen ? t("map.exit_fullscreen") : t("map.enter_fullscreen")}
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
