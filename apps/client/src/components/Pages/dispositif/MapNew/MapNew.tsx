"use client";

import type { GetThemeResponse, Poi } from "@refugies-info/api-types";
import { Map } from "@refugies-info/ui";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "~/services/rootReducer";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { allThemesSelector } from "~/services/Themes/themes.selectors";

interface MapNewProps {
  data: Poi[];
}

const MapNew = ({ data }: MapNewProps) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const dispositif = useSelector(selectedDispositifSelector);
  const allThemes = useSelector(allThemesSelector);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const themeId = dispositif?.theme;
  const secondaryThemeIds = dispositif?.secondaryThemes;

  const themeSelector = useMemo(() => {
    if (!themeId) return null;
    return allThemes.find((theme) => theme._id === themeId) || null;
  }, [themeId, allThemes]);

  const secondaryThemesSelector = useMemo(() => {
    if (!secondaryThemeIds) return [];
    return secondaryThemeIds
      .map((id) => allThemes.find((theme) => theme._id === id))
      .filter((t) => t !== undefined) as GetThemeResponse[];
  }, [secondaryThemeIds, allThemes]);

  const theme = themeSelector;
  const secondaryThemes = secondaryThemesSelector;

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

  if (!data || !title || !description) return null;

  return (
    <Map
      className="max-sm:px-8"
      mapData={data}
      title={title}
      description={isClient ? description : ""}
      defaultFocusedPoi={data.length === 1 ? data[0] : undefined}
    />
  );
};

export default MapNew;
