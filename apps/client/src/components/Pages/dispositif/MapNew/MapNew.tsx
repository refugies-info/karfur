"use client";

import { GetThemeResponse, Poi } from "@refugies-info/api-types";
import { Map } from "@refugies-info/ui";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { RootState } from "~/services/rootReducer";

interface MapNewProps {
  data: Poi[];
}

export default function MapNew({ data }: MapNewProps) {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const mapItems = dispositif?.map;

  // Memoize the theme ID to prevent selector recreation on every render
  const themeId = dispositif?.theme;
  const secondaryThemeIds = dispositif?.secondaryThemes;

  // Use memoized selectors
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Only update if we have the necessary data
    if (theme || secondaryThemes.length > 0) {
      setTitle(t("Dispositif.mapTitle", "Lieu d'accueil"));

      const isFormation = theme?.short?.fr === "Formation" || secondaryThemes?.some((t) => t.short?.fr === "Formation");
      if (isFormation) {
        setDescription(
          t("Dispositif.mapDescriptionFormation", "C'est le lieu où vous devrez vous rendre pour la formation."),
        );
      } else {
        setDescription(
          t("Dispositif.mapDescriptionDispositif", "C'est le lieu où vous devrez vous rendre pour le dispositif."),
        );
      }
    }
  }, [t, theme, secondaryThemes]);

  if (!mapItems || !title || !description) return null;

  return (
    <Map
      mapData={mapItems}
      title={title}
      description={description}
      defaultFocusedPoi={mapItems.length === 1 ? mapItems[0] : undefined}
    />
  );
}
