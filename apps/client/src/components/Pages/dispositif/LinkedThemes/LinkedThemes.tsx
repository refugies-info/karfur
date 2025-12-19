import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import SearchThemeButton from "~/components/UI/SearchThemeButton";
import { useLocale } from "~/hooks";
import { jsUcfirst } from "~/lib";
import { cn } from "~/lib/classname";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import { Event } from "~/lib/tracking";
import { makeDispositifNeedsSelector } from "~/services/Needs/needs.selectors";
import type { RootState } from "~/services/rootReducer";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import {
  allThemesSelector,
  makeSecondaryThemesSelector,
  makeThemeSelector,
} from "~/services/Themes/themes.selectors";

const LinkedThemes = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const themes = useSelector(allThemesSelector);
  const dispositif = useSelector(selectedDispositifSelector);

  // Create stable selector instances using useMemo
  const selectTheme = useMemo(makeThemeSelector, []);
  const selectSecondaryThemes = useMemo(makeSecondaryThemesSelector, []);
  const selectDispositifNeeds = useMemo(makeDispositifNeedsSelector, []);

  // Use the stable selectors with the required parameters
  const theme = useSelector((state: RootState) => selectTheme(state, dispositif?.theme));
  const secondaryThemes = useSelector((state: RootState) =>
    selectSecondaryThemes(state, dispositif?.secondaryThemes),
  );
  const needs = useSelector((state: RootState) => selectDispositifNeeds(state, dispositif?.needs));

  return (
    <ul
      className={cn("flex list-none flex-wrap gap-2", className)}
      aria-label={t("Dispositif.linkedThemes")}
    >
      {theme && (
        <li>
          <SearchThemeButton
            theme={theme}
            href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
            value={jsUcfirst(theme.short[locale] || "")}
            onClick={() => Event("DISPO_VIEW", "click theme", "Linked themes")}
          />
        </li>
      )}
      {Array.isArray(secondaryThemes) &&
        secondaryThemes.map((theme, i) => (
          <li key={i} className="">
            <SearchThemeButton
              theme={theme}
              href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
              value={jsUcfirst(theme.short[locale] || "")}
              onClick={() => Event("DISPO_VIEW", "click theme", "Linked themes")}
            />
          </li>
        ))}
      {Array.isArray(needs) &&
        needs.map((need, i) => {
          const theme = themes.find((t) => t._id === need.theme._id);
          if (!theme) return null;
          return (
            <li key={i}>
              <SearchThemeButton
                theme={theme}
                href={getPath("/recherche", "fr", `?${buildUrlQuery({ needs: [need._id] })}`)}
                value={need[locale]?.text || need.fr.text}
                onClick={() => Event("DISPO_VIEW", "click need", "Linked themes")}
              />
            </li>
          );
        })}
    </ul>
  );
};

export default LinkedThemes;
