import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import type { Id } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import React, { useContext, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { useLocale, useSearchEventName } from "~/hooks";
import { getNeedsFromThemes, getThemesFromNeeds } from "~/lib/recherche/getThemesFromNeeds";
import { Event } from "~/lib/tracking";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { allThemesSelector } from "~/services/Themes/themes.selectors";
import NeedItem from "./NeedItem";
import styles from "./Needs.module.css";
import { ThemeMenuContext } from "./ThemeMenuContext";

const Needs = React.forwardRef<HTMLDivElement | null, {}>((props, ref) => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const { search, selectedThemeId, nbDispositifsByNeed, nbDispositifsByTheme } =
    useContext(ThemeMenuContext);
  const needs = useSelector(needsSelector);
  const allNeeds = useSelector(needsSelector);
  const themes = useSelector(allThemesSelector);
  const { t } = useTranslation();
  const needsContainerRef = useRef<HTMLDivElement | null>(null);
  const eventName = useSearchEventName();
  const announce = useAnnounce();

  const displayedNeeds = useMemo(() => {
    if (search) {
      return needs
        .filter((need) => (need[locale]?.text || "").includes(search))
        .sort((a, b) => (a.theme.position > b.theme.position ? 1 : -1));
    }
    return needs
      .filter((need) => need.theme._id === selectedThemeId)
      .sort((a, b) => ((a.position || 0) > (b.position || 0) ? 1 : -1));
  }, [selectedThemeId, needs, search, locale]);

  const needsFromCurrentTheme = useMemo(
    () => allNeeds.filter((need) => need.theme._id === selectedThemeId).map((need) => need._id),
    [selectedThemeId, allNeeds],
  );

  const allSelectedNeeds: Id[] = useMemo(
    () => [...query.needs, ...getNeedsFromThemes(query.themes, allNeeds)],
    [query.needs, query.themes, allNeeds],
  );

  const currentlySelectedNeedsFromTheme = useMemo(
    () => allSelectedNeeds.filter((id) => needsFromCurrentTheme.includes(id)),
    [allSelectedNeeds, needsFromCurrentTheme],
  );

  const allNeedsSelected = currentlySelectedNeedsFromTheme.length === needsFromCurrentTheme.length;

  const selectedTheme = useMemo(
    () => themes.find((theme) => theme._id === selectedThemeId),
    [themes, selectedThemeId],
  );

  const toggleAllNeeds = () => {
    let updatedSelectedNeeds: Id[] = [
      ...query.needs,
      ...getNeedsFromThemes(query.themes, allNeeds),
    ];

    if (allNeedsSelected) {
      updatedSelectedNeeds = updatedSelectedNeeds.filter(
        (id) => !needsFromCurrentTheme.includes(id),
      );
    } else {
      updatedSelectedNeeds = [...new Set([...updatedSelectedNeeds, ...needsFromCurrentTheme])];
      Event(eventName, "use theme filter", "select all needs");
    }

    const res = getThemesFromNeeds(updatedSelectedNeeds, allNeeds);
    dispatch(
      addToQueryActionCreator({
        needs: res.needs,
        themes: res.themes,
      }),
    );

    // Announce filter change — actual count arrives when server responds
    announce(t("Recherche.updatingResults", "Mise \u00e0 jour des r\u00e9sultats..."));
  };

  const selectNeed = (id: Id) => {
    let allSelectedNeeds: Id[] = [...query.needs, ...getNeedsFromThemes(query.themes, allNeeds)];

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

    // Announce filter change — actual count arrives when server responds
    announce(t("Recherche.updatingResults", "Mise \u00e0 jour des r\u00e9sultats..."));
  };

  return (
    <div
      className={styles.container}
      ref={ref}
      role="tabpanel"
      id={selectedThemeId ? `tabpanel-${selectedThemeId}` : undefined}
    >
      <div
        className={cn("w-full px-2 [&_div]:m-0 [&_fieldset]:m-0 [&_fieldset]:w-full", styles.needs)}
        ref={needsContainerRef}
      >
        <Checkbox
          className="[&_.fr-checkbox-group:first-child]:border-default-grey [&_.fr-checkbox-group:first-child]:border-b"
          options={[
            {
              label: (
                <NeedItem
                  label={t("Recherche.all", "Tous")}
                  count={selectedThemeId ? nbDispositifsByTheme[selectedThemeId.toString()] : ""}
                />
              ),
              nativeInputProps: {
                checked: allNeedsSelected,
                onChange: toggleAllNeeds,
                className: "!border",
                "aria-label": `${t("Recherche.all", "Tous")} ${selectedThemeId ? nbDispositifsByTheme[selectedThemeId.toString()] : ""} ${t("Recherche.fiches", "fiches")}`,
              },
            },
            ...displayedNeeds.map((need) => {
              const selected =
                query.needs.includes(need._id) || query.themes.includes(need.theme._id);

              return {
                label: <NeedItem need={need} />,
                nativeInputProps: {
                  checked: selected,
                  onChange: () => selectNeed(need._id),
                  className: "!border",
                  "aria-label": `${need[locale]?.text || ""} ${nbDispositifsByNeed[need._id.toString()] || 0} ${t("Recherche.fiches", "fiches")}`,
                },
              };
            }),
          ]}
        />
      </div>
    </div>
  );
});

Needs.displayName = "Needs";

export default Needs;
