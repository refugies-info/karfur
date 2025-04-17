import { useSelector } from "react-redux";
import { getPath } from "routes";
import SearchThemeButton from "~/components/UI/SearchThemeButton";
import { useLocale } from "~/hooks";
import { jsUcfirst } from "~/lib";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import { Event } from "~/lib/tracking";
import { dispositifNeedsSelector } from "~/services/Needs/needs.selectors";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector, themesSelector } from "~/services/Themes/themes.selectors";

/* {need[locale]?.text || need.fr.text} */

const LinkedThemes = () => {
  const locale = useLocale();
  const themes = useSelector(themesSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  return (
    <div className="flex flex-wrap gap-2">
      {theme && (
        <SearchThemeButton
          theme={theme}
          href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
          value={jsUcfirst(theme.short[locale] || "")}
          onClick={() => Event("DISPO_VIEW", "click theme", "Linked themes")}
        />
      )}
      {secondaryThemes.map((theme, i) => (
        <SearchThemeButton
          key={i}
          theme={theme}
          href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
          value={jsUcfirst(theme.short[locale] || "")}
          onClick={() => Event("DISPO_VIEW", "click theme", "Linked themes")}
        />
      ))}
      {needs.map((need, i) => {
        const theme = themes.find((t) => t._id === need.theme._id);
        return (
          <SearchThemeButton
            key={i}
            theme={theme!}
            href={getPath("/recherche", "fr", `?${buildUrlQuery({ needs: [need._id] })}`)}
            value={need[locale]?.text || need.fr.text}
            onClick={() => Event("DISPO_VIEW", "click need", "Linked themes")}
          />
        );
      })}
    </div>
  );
};

export default LinkedThemes;
