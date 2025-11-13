import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import SearchThemeButton from "~/components/UI/SearchThemeButton";
import { useLocale } from "~/hooks";
import { jsUcfirst } from "~/lib";
import { cn } from "~/lib/classname";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import { Event } from "~/lib/tracking";
import { dispositifNeedsSelector } from "~/services/Needs/needs.selectors";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector, themesSelector } from "~/services/Themes/themes.selectors";

const LinkedThemes = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const themes = useSelector(themesSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  return (
    <ul className={cn("flex list-none flex-wrap gap-2", className)} aria-label={t("Dispositif.linkedThemes")}>
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
      {secondaryThemes.map((theme, i) => (
        <li key={i} className="">
          <SearchThemeButton
            theme={theme}
            href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
            value={jsUcfirst(theme.short[locale] || "")}
            onClick={() => Event("DISPO_VIEW", "click theme", "Linked themes")}
          />
        </li>
      ))}
      {needs.map((need, i) => {
        const theme = themes.find((t) => t._id === need.theme._id);
        return (
          <li key={i}>
            <SearchThemeButton
              theme={theme!}
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
