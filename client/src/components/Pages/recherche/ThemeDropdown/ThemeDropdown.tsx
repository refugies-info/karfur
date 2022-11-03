import React, { useEffect, useMemo, useState, memo } from "react";
import styled from "styled-components";
import { Collapse } from "reactstrap";
import { ObjectId } from "mongodb";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { needsSelector } from "services/Needs/needs.selectors";
import { cls } from "lib/classname";
import { sortThemes } from "lib/sortThemes";
import useLocale from "hooks/useLocale";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import TagName from "components/UI/TagName";
import NeedsList from "./NeedsList";
import styles from "./ThemeDropdown.module.scss";

type ButtonThemeProps = {
  color100: string;
  color30: string;
  selected: boolean;
};
const ButtonTheme = styled.button`
  background-color: ${(props: ButtonThemeProps) => (props.selected ? props.color100 : "transparent")};
  :hover {
    background-color: ${(props: ButtonThemeProps) => (props.selected ? props.color100 : props.color30)};
    border-color: ${(props: ButtonThemeProps) => props.color100};
    color: ${(props: ButtonThemeProps) => props.color100};
  }

  @media screen and (max-width: 767px) {
    background-color: ${(props: ButtonThemeProps) => (props.selected ? props.color100 : "transparent")} !important;
    color: white !important;
    ${(props: ButtonThemeProps) => (props.selected ? "border-color: white !important;" : "")}

    :hover {
      background-color: transparent;
    }
  }
`;
interface Props {
  needsSelected: ObjectId[];
  setNeedsSelected: (value: React.SetStateAction<ObjectId[]>) => void;
  themesSelected: ObjectId[];
  setThemesSelected: (value: React.SetStateAction<ObjectId[]>) => void;
  search: string;
  mobile: boolean;
}

const ThemeDropdown = (props: Props) => {
  const locale = useLocale();
  const themes = useSelector(themesSelector);
  const sortedThemes = themes.sort(sortThemes);
  const needs = useSelector(needsSelector);
  const [themeSelected, setThemeSelected] = useState<ObjectId | null>(sortedThemes[0]._id);
  const [nbNeedsSelectedByTheme, setNbNeedsSelectedByTheme] = useState<Record<string, number>>({});

  const {
    needsSelected,
    setNeedsSelected,
    themesSelected,
    setThemesSelected
  } = props;

  useEffect(() => {
    // count nb needs selected by theme
    const nbNeedsSelectedByTheme: Record<string, number> = {};
    for (const needId of needsSelected) {
      const needThemeId = needs.find((n) => n._id === needId)?.theme._id.toString();
      if (needThemeId) {
        nbNeedsSelectedByTheme[needThemeId] = (nbNeedsSelectedByTheme[needThemeId] || 0) + 1;
      }
    }
    for (const themeId of themesSelected) {
      const theme = themes.find((t) => t._id === themeId);
      if (theme) {
        nbNeedsSelectedByTheme[themeId.toString()] = needs.filter(need => need.theme._id === themeId).length;
      }
    }
    setNbNeedsSelectedByTheme(nbNeedsSelectedByTheme);
  }, [needsSelected, themesSelected, themes, needs]);

  const displayedNeeds = useMemo(() => {
    if (props.search) {
      return needs
        .filter((need) => (need[locale]?.text || "").includes(props.search))
        .sort((a, b) => (a.theme.position > b.theme.position ? 1 : -1));
    }
    return needs
      .filter((need) => need.theme._id === themeSelected)
      .sort((a, b) => ((a.position || 0) > (b.position || 0) ? 1 : -1));
  }, [themeSelected, needs, props.search, locale]);

  return (
    <div className={styles.container}>
      <div className={cls(styles.themes, props.search && styles.hidden)}>
        {sortedThemes.map((theme, i) => {
          const selected = themeSelected === theme._id;
          return (
            <div key={i}>
              <ButtonTheme
                className={styles.btn}
                color100={theme.colors.color100}
                color30={theme.colors.color30}
                selected={selected}
                onClick={() =>
                  setThemeSelected((old) => {
                    if (old === theme._id) return null;
                    return theme._id;
                  })
                }
              >
                <span className={styles.btn_content}>
                  <TagName theme={theme} colored={themeSelected !== theme._id} size={20} />
                  {nbNeedsSelectedByTheme[theme._id.toString()] &&
                    nbNeedsSelectedByTheme[theme._id.toString()] > 0 && (
                    <span
                      style={{
                        backgroundColor: themeSelected !== theme._id ? theme.colors.color100 : "white",
                        color: themeSelected !== theme._id ? "white" : theme.colors.color100
                      }}
                      className={styles.theme_badge}
                    >
                        {nbNeedsSelectedByTheme[theme._id.toString()] || 0}
                      </span>
                    )}
                </span>
                {(props.mobile || themeSelected === theme._id) && (
                  <EVAIcon
                    name={!props.mobile ? "chevron-right-outline" : (themeSelected === theme._id ? "chevron-up-outline" : "chevron-down-outline")}
                    fill={themeSelected === theme._id ? "white" : theme.colors.color100}
                    className="ml-2"
                  />
                )}
              </ButtonTheme>

              {props.mobile && (
                <Collapse isOpen={selected}>
                  <NeedsList
                    needsSelected={needsSelected}
                    setNeedsSelected={setNeedsSelected}
                    themesSelected={themesSelected}
                    setThemesSelected={setThemesSelected}
                    search={props.search}
                    displayedNeeds={displayedNeeds}
                    themeSelected={themeSelected}
                  />
                </Collapse>
              )}
            </div>
          );
        })}
      </div>
      {(!props.mobile || props.search) && (
        <NeedsList
          needsSelected={needsSelected}
          setNeedsSelected={setNeedsSelected}
          themesSelected={themesSelected}
          setThemesSelected={setThemesSelected}
          search={props.search}
          displayedNeeds={displayedNeeds}
          themeSelected={themeSelected}
        />
      )}
    </div>
  );
};

export default memo(ThemeDropdown);
