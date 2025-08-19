import { Id } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeMenuContext } from "~/components/Pages/recherche/ThemeMenu/ThemeMenuContext";
import Checkbox from "~/components/UI/Checkbox";
import { useSearchEventName } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import { getNeedsFromThemes, getThemesFromNeeds } from "~/lib/recherche/getThemesFromNeeds";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import { Event } from "~/lib/tracking";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./AllNeedsItem.module.css";

type Props = {
  themeId: string;
};

const AllNeedsItem: React.FC<Props> = ({ themeId }) => {
  const { t } = useTranslation();
  const { selectedThemeId, nbDispositifsByTheme } = useContext(ThemeMenuContext);
  const query = useSelector(searchQuerySelector);
  const dispatch = useDispatch();
  const allNeeds = useSelector(needsSelector);
  const eventName = useSearchEventName();
  const stylesDisabled = useStylesDisabled();

  let allSelectedNeeds: Id[] = [...query.needs, ...getNeedsFromThemes(query.themes, allNeeds)];
  const needsFromCurrentTheme = useMemo(
    () => allNeeds.filter((need) => need.theme._id === themeId).map((need) => need._id),
    [themeId, allNeeds],
  );
  const currentlySelectedNeedsFromTheme = allSelectedNeeds.filter((id) => needsFromCurrentTheme.includes(id));
  const [selected, setSelected] = useState(currentlySelectedNeedsFromTheme.length === needsFromCurrentTheme.length);

  const toggleNeeds = () => {
    if (selected) {
      // if need selected, remove
      allSelectedNeeds = allSelectedNeeds.filter((id) => !needsFromCurrentTheme.includes(id));
      setSelected(false);
    } else {
      // if not selected, add
      allSelectedNeeds = [...new Set([...allSelectedNeeds, ...needsFromCurrentTheme])];
      setSelected(true);
      Event(eventName, "use theme filter", "select all needs");
    }

    const res = getThemesFromNeeds(allSelectedNeeds, allNeeds);
    dispatch(
      addToQueryActionCreator({
        needs: res.needs,
        themes: res.themes,
      }),
    );
  };

  useEffect(() => {
    setSelected(currentlySelectedNeedsFromTheme.length === needsFromCurrentTheme.length);
  }, [query.needs, themeId, currentlySelectedNeedsFromTheme, needsFromCurrentTheme]);

  return (
    <div className={cls(styles.container)}>
      {stylesDisabled ? (
        <span
          onClick={toggleNeeds}
          onKeyDown={(e) => onEnterOrSpace(e, toggleNeeds)}
          role="button"
          tabIndex={0}
          className={styles.label}
        >
          {selected ? "[x]" : "[ ]"} {t("Recherche.all", "Tous")}
          <span className={styles.count}>{selectedThemeId ? nbDispositifsByTheme[selectedThemeId.toString()] : ""}</span>
        </span>
      ) : (
        <Checkbox checked={selected} onChange={toggleNeeds}>
          <span className={styles.label}>{t("Recherche.all", "Tous")}</span>
          <span className={styles.count}>{selectedThemeId ? nbDispositifsByTheme[selectedThemeId.toString()] : ""}</span>
        </Checkbox>
      )}
    </div>
  );
};

export default AllNeedsItem;
