import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import type { GetNeedResponse, GetThemeResponse, Id } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { useLocale, useSearchEventName } from "~/hooks";
import { getNeedsFromThemes, getThemesFromNeeds } from "~/lib/recherche/getThemesFromNeeds";
import { queryDispositifs } from "~/lib/recherche/queryContents";
import { Event } from "~/lib/tracking";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import NeedItem from "./NeedItem";
import styles from "./ResultsSection.module.css";
import { ThemeMenuContext } from "./ThemeMenuContext";

interface Props {
  theme: GetThemeResponse;
  needs: GetNeedResponse[];
}

const ResultsSection: React.FC<Props> = ({ theme, needs }) => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const allNeeds = useSelector(needsSelector);
  const eventName = useSearchEventName();
  const { t } = useTranslation();
  const announce = useAnnounce();
  const dispositifs = useSelector(activeDispositifsSelector);
  const { nbDispositifsByNeed } = useContext(ThemeMenuContext);

  const selectNeed = (id: Id) => {
    let allSelectedNeeds: Id[] = [...query.needs, ...getNeedsFromThemes(query.themes, allNeeds)];

    const isSelecting = !allSelectedNeeds.includes(id);
    const selectedNeed = needs.find((n) => n._id === id);

    if (allSelectedNeeds.includes(id)) {
      allSelectedNeeds = allSelectedNeeds.filter((n) => n !== id);
    } else {
      allSelectedNeeds = [...allSelectedNeeds, id];
      Event(eventName, "use theme filter", "select one need");
    }

    const res = getThemesFromNeeds(allSelectedNeeds, allNeeds);
    dispatch(
      addToQueryActionCreator({
        needs: res.needs,
        themes: res.themes,
      }),
    );

    if (selectedNeed) {
      // Calculate count using the updated query (after selection/deselection)
      const updatedQuery = { ...query, needs: res.needs, themes: res.themes };
      const results = queryDispositifs(updatedQuery, dispositifs, allNeeds);
      announce(t("Recherche.updatedFilters", { count: results.matches.length }));
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={cn(
          "w-full px-2 [&_div]:m-0 [&_fieldset]:m-0 [&_fieldset]:w-full [&_fieldset_legend]:px-0 [&_fieldset_legend]:py-4 [&_fieldset_legend]:pb-2",
          styles.needs,
          needs.length === 0 && styles.needsEmpty,
        )}
      >
        <Checkbox
          legend={theme.short[locale]}
          options={needs.map((need) => {
            const selected =
              query.needs.includes(need._id) || query.themes.includes(need.theme._id);

            return {
              label: <NeedItem need={need} />,
              nativeInputProps: {
                checked: selected,
                onChange: () => selectNeed(need._id),
                "aria-label": `${need[locale]?.text || ""} ${nbDispositifsByNeed[need._id.toString()] || 0} ${t("Recherche.fiches", "fiches")}`,
              },
            };
          })}
        />
      </div>
    </div>
  );
};

export default ResultsSection;
