import { GetNeedResponse, Id } from "@refugies-info/api-types";
import Checkbox from "components/UI/Checkbox";
import { useLocale } from "hooks";
import { getNeedsFromThemes, getThemesFromNeeds } from "lib/recherche/getThemesFromNeeds";
import { Event } from "lib/tracking";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { needsSelector } from "services/Needs/needs.selectors";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import styles from "./NeedItem.module.css";

interface Props {
  need: GetNeedResponse;
}

const NeedItem: React.FC<Props> = ({ need }) => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const allNeeds = useSelector(needsSelector);

  const selectNeed = (id: Id) => {
    let allSelectedNeeds: Id[] = [...query.needs, ...getNeedsFromThemes(query.themes, allNeeds)];

    if (allSelectedNeeds.includes(id)) {
      // if need selected, remove
      allSelectedNeeds = allSelectedNeeds.filter((n) => n !== id);
    } else {
      // if not selected, add
      allSelectedNeeds = [...allSelectedNeeds, id];
      Event("USE_SEARCH", "use theme filter", "select one need");
    }

    const res = getThemesFromNeeds(allSelectedNeeds, allNeeds);
    dispatch(
      addToQueryActionCreator({
        needs: res.needs,
        themes: res.themes,
      }),
    );
  };

  const selected = query.needs.includes(need._id) || query.themes.includes(need.theme._id);

  return (
    <Checkbox checked={selected} onChange={() => selectNeed(need._id)}>
      <span className={styles.label}>{need[locale]?.text || ""}</span>
      <div className={styles.countContainer}>
        <div className={styles.count}>{133}</div>
      </div>
    </Checkbox>
  );
};

export default NeedItem;
