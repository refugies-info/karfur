"use client";

import { Poi } from "@refugies-info/api-types";
import { Map } from "@refugies-info/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "~/services/Themes/themes.selectors";

interface MapNewProps {
  data: Poi[];
}

export default function MapNew({ data }: MapNewProps) {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const mapItems = dispositif?.map;
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
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
