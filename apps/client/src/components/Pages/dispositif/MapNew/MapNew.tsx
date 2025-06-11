import { Poi } from "@refugies-info/api-types";
import { Map } from "@refugies-info/ui";
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
  const title = t("Dispositif.mapTitle", "Lieu d'accueil");
  const description =
    theme?.short?.fr === "Formation" || secondaryThemes?.some((t) => t.short?.fr === "Formation")
      ? t("Dispositif.mapDescriptionFormation")
      : t("Dispositif.mapDescriptionDispositif");

  return mapItems ? (
    <Map
      mapData={mapItems}
      title={title}
      description={description}
      defaultFocusedPoi={mapItems.length === 1 ? mapItems[0] : undefined}
    />
  ) : null;
}
