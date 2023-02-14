import React, { memo } from "react";
import styled from "styled-components";
import { ObjectId } from "mongodb";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { themesSelector } from "services/Themes/themes.selectors";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { needsSelector } from "services/Needs/needs.selectors";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import useLocale from "hooks/useLocale";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import TagName from "components/UI/TagName";
import Checkbox from "components/UI/Checkbox";
import { getNeedsFromThemes, getThemesFromNeeds } from "lib/recherche/getThemesFromNeeds";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import styles from "./ThemeDropdown.module.scss";
import { GetNeedResponse, GetThemeResponse, Id } from "api-types";

type ButtonNeedProps = {
  color100: string;
  color30: string;
  selected: boolean;
};
const ButtonNeed = styled.button`
  background-color: ${(props: ButtonNeedProps) => (props.selected ? props.color30 : "transparent")};
  color: ${(props: ButtonNeedProps) => props.color100};
  :hover {
    background-color: ${(props: ButtonNeedProps) => props.color30};
  }
`;

interface Props {
  search: string;
  displayedNeeds: GetNeedResponse[];
  themeSelected: Id | null;
  nbDispositifsByNeed: Record<string, number>;
  nbDispositifsByTheme: Record<string, number>;
}

const NeedsList = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const dispatch = useDispatch();

  const themes = useSelector(themesSelector);
  const allNeeds = useSelector(needsSelector);
  const query = useSelector(searchQuerySelector);

  const colors = themes.find((t) => props.themeSelected === t._id)?.colors;

  const isThemeSelected = !!(props.themeSelected && query.themes.includes(props.themeSelected));

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
        themes: res.themes
      })
    );
  };

  const selectTheme = (id: Id | null) => {
    if (!id) return;
    if (query.themes.includes(id)) {
      dispatch(
        addToQueryActionCreator({
          themes: query.themes.filter((n) => n !== id)
        })
      );
    } else {
      const newNeeds = allNeeds
        .filter((n) => {
          return query.needs.includes(n._id) && n.theme._id !== id;
        })
        .map((n) => n._id);

      dispatch(
        addToQueryActionCreator({
          needs: newNeeds,
          themes: [...query.themes, id]
        })
      );
      Event("USE_SEARCH", "use theme filter", "select all needs");
    }
  };

  return (
    <div className={styles.needs}>
      {props.themeSelected && !props.search && (
        <ButtonNeed
          className={cls(styles.btn, styles.need)}
          color100={colors?.color100 || "black"}
          color30={colors?.color30 || "gray"}
          selected={isThemeSelected}
          onClick={() => selectTheme(props.themeSelected)}
        >
          <Checkbox checked={isThemeSelected} color={colors?.color100 || "black"}>
            <span className={styles.all}>
              <EVAIcon name="grid" fill={colors?.color100 || "black"} />
              {t("Recherche.all", "Tous")}
              <span
                className={styles.badge}
                style={{
                  backgroundColor: colors?.color30,
                  color: colors?.color100
                }}
              >
                {props.nbDispositifsByTheme[props.themeSelected.toString()] || 0}
              </span>
            </span>
          </Checkbox>
        </ButtonNeed>
      )}
      {props.displayedNeeds.map((need, i) => {
        const selected = query.needs.includes(need._id) || query.themes.includes(need.theme._id);
        if (!props.nbDispositifsByNeed[need._id.toString()]) return null;
        return (
          <span key={i}>
            {props.search &&
              // check if this need has a different theme from previous one
              (i === 0 || props.displayedNeeds[i - 1].theme._id !== need.theme._id) && (
                <div className={styles.list_theme}>
                  <TagName theme={need.theme as GetThemeResponse} colored={true} size={20} />
                  {/* TODO: comment gérer les nested imports */}
                </div>
              )}
            <ButtonNeed
              className={cls(styles.btn, styles.need, selected && styles.selected)}
              color100={need.theme.colors.color100}
              color30={need.theme.colors.color30}
              selected={selected}
              onClick={() => selectNeed(need._id)}
            >
              <Checkbox checked={selected} color={need.theme.colors.color100 || "black"}>
                {need[locale]?.text || ""}
                <span
                  className={styles.badge}
                  style={{
                    backgroundColor: need.theme.colors.color30,
                    color: need.theme.colors.color100
                  }}
                >
                  {props.nbDispositifsByNeed[need._id.toString()] || 0}
                </span>
              </Checkbox>
            </ButtonNeed>
          </span>
        );
      })}
    </div>
  );
};

export default memo(NeedsList);
