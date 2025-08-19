import { GetNeedResponse, Id } from "@refugies-info/api-types";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeMenuContext } from "~/components/Pages/recherche/ThemeMenu/ThemeMenuContext";
import Checkbox from "~/components/UI/Checkbox";
import { useLocale, useSearchEventName } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { getNeedsFromThemes, getThemesFromNeeds } from "~/lib/recherche/getThemesFromNeeds";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import { Event } from "~/lib/tracking";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./NeedItem.module.css";

interface Props {
  need: GetNeedResponse;
}

const NeedItem: React.FC<Props> = ({ need }) => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const allNeeds = useSelector(needsSelector);
  const { nbDispositifsByNeed } = useContext(ThemeMenuContext);
  const eventName = useSearchEventName();
  const stylesDisabled = useStylesDisabled();
  const action = () => selectNeed(need._id);

  const selectNeed = (id: Id) => {
    let allSelectedNeeds: Id[] = [...query.needs, ...getNeedsFromThemes(query.themes, allNeeds)];

    if (allSelectedNeeds.includes(id)) {
      // if need selected, remove
      allSelectedNeeds = allSelectedNeeds.filter((n) => n !== id);
    } else {
      // if not selected, add
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
  };

  const selected = query.needs.includes(need._id) || query.themes.includes(need.theme._id);

  return stylesDisabled ? (
    <div
      className={styles.container}
      onClick={action}
      onKeyDown={(e) => onEnterOrSpace(e, action)}
      role="button"
      tabIndex={0}
    >
      <span className={styles.label}>
        {selected ? "[x]" : "[ ]"} {need[locale]?.text || ""}
      </span>{" "}
      <span className={styles.count}>{nbDispositifsByNeed[need._id.toString()]}</span>
    </div>
  ) : (
    <Checkbox
      checked={selected}
      onChange={action}
      className={styles.container}
      labelClassName={styles.labelWrapper}
    >
      <span className={styles.label}>{need[locale]?.text || ""}</span>{" "}
      <span className={styles.count}>{nbDispositifsByNeed[need._id.toString()]}</span>
    </Checkbox>
  );
};

export default NeedItem;
