"use client";

import type { GetThemeResponse, Poi } from "@refugies-info/api-types";
import { Map } from "@refugies-info/ui";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "~/services/rootReducer";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";

interface MapNewProps {
  data: Poi[];
}

const MapNew = ({ data }: MapNewProps) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const dispositif = useSelector(selectedDispositifSelector);
  const mapItems = dispositif?.map;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const themeId = dispositif?.theme;
  const secondaryThemeIds = dispositif?.secondaryThemes;

  const themeSelector = useMemo(() => {
    return (state: RootState) => {
      if (!themeId) return null;
      return state.themes.activeThemes.find((theme) => theme._id === themeId) || null;
    };
  }, [themeId]);

  const secondaryThemesSelector = useMemo(() => {
    return (state: RootState) => {
      if (!secondaryThemeIds) return [];
      return secondaryThemeIds
        .map((id) => state.themes.activeThemes.find((theme) => theme._id === id))
        .filter((t) => t !== undefined) as GetThemeResponse[];
    };
  }, [secondaryThemeIds]);

  const theme = useSelector(themeSelector);
  const secondaryThemes = useSelector(secondaryThemesSelector);

  let title = "";
  let description = "";

  if (theme || secondaryThemes.length > 0) {
    title = t("Dispositif.mapTitle", "Lieu d'accueil");

    const isFormation =
      theme?.short?.fr === "Formation" || secondaryThemes?.some((t) => t.short?.fr === "Formation");
    if (isFormation) {
      description = t(
        "Dispositif.mapDescriptionFormation",
        "C'est le lieu où vous devrez vous rendre pour la formation.",
      );
    } else {
      description = t(
        "Dispositif.mapDescriptionDispositif",
        "C'est le lieu où vous devrez vous rendre pour le dispositif.",
      );
    }
  }

  if (!mapItems || !title || !description) return null;

  return (
    <Map
      className="max-sm:px-8"
      mapData={mapItems}
      title={title}
      description={isClient ? description : ""}
      defaultFocusedPoi={mapItems.length === 1 ? mapItems[0] : undefined}
    />
  );
};

export default MapNew;
