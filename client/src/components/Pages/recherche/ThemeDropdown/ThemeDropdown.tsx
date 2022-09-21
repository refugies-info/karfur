import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import styles from "./ThemeDropdown.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import TagName from "components/UI/TagName";
import { ObjectId } from "mongodb";
import { needsSelector } from "services/Needs/needs.selectors";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import Checkbox from "components/UI/Checkbox";
import { cls } from "lib/classname";

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
`;

type ButtonNeedProps = {
  color100: string;
  color30: string;
  selected: boolean;
};
const ButtonNeed = styled.button`
  background-color: ${(props: ButtonNeedProps) => (props.selected ? props.color100 : "transparent")};
  color: ${(props: ButtonNeedProps) => (props.selected ? "white" : props.color100)};
  :hover {
    background-color: ${(props: ButtonNeedProps) => (props.selected ? props.color100 : props.color30)};
    border-color: ${(props: ButtonNeedProps) => props.color100};
  }
`;

interface Props {
  needsSelected: ObjectId[];
  setNeedsSelected: (value: React.SetStateAction<ObjectId[]>) => void;
  search: string;
}

const ThemeDropdown = (props: Props) => {
  const themes = useSelector(themesSelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const needs = useSelector(needsSelector);
  const [themeSelected, setThemeSelected] = useState<ObjectId | null>(null);
  const [nbDispositifsByNeed, setNbDispositifsByNeed] = useState<Record<string, number>>({});
  const [nbDispositifsByTheme, setNbDispositifsByTheme] = useState<Record<string, number>>({});
  const [nbNeedsSelectedByTheme, setNbNeedsSelectedByTheme] = useState<Record<string, number>>({});

  const colors = themes.find((t) => themeSelected === t._id)?.colors;

  useEffect(() => {
    // count initial dispositifs by need
    const nbDispositifsByNeed: Record<string, number> = {};
    for (const dispositif of dispositifs) {
      for (const needId of dispositif.needs || []) {
        nbDispositifsByNeed[needId.toString()] = (nbDispositifsByNeed[needId.toString()] || 0) + 1;
      }
      nbDispositifsByTheme[dispositif.theme._id.toString()] =
        (nbDispositifsByTheme[dispositif.theme._id.toString()] || 0) + 1;
      for (const theme of dispositif.secondaryThemes || []) {
        nbDispositifsByTheme[theme._id.toString()] = (nbDispositifsByTheme[theme._id.toString()] || 0) + 1;
      }
    }
    setNbDispositifsByNeed(nbDispositifsByNeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { needsSelected, setNeedsSelected } = props;

  useEffect(() => {
    // count nb needs selected by theme
    const nbNeedsSelectedByTheme: Record<string, number> = {};
    for (const needId of needsSelected) {
      const needThemeId = needs.find((n) => n._id === needId)?.theme._id.toString();
      if (needThemeId) {
        nbNeedsSelectedByTheme[needThemeId] = (nbNeedsSelectedByTheme[needThemeId] || 0) + 1;
      }
    }
    setNbNeedsSelectedByTheme(nbNeedsSelectedByTheme);
  }, [needsSelected, needs]);

  const selectNeed = (id: ObjectId) => {
    if (needsSelected.includes(id)) {
      setNeedsSelected((needs) => needs.filter((n) => n !== id));
    } else {
      setNeedsSelected((needs) => [...needs, id]);
    }
  };
  const selectAllNeeds = (ids: ObjectId[], allSelected: boolean) => {
    if (allSelected) {
      setNeedsSelected((needs) => needs.filter((n) => !ids.includes(n)));
    } else {
      setNeedsSelected((needs) => [...needs, ...ids]);
    }
  };

  const displayedNeeds = useMemo(() => {
    if (props.search) {
      return needs
        .filter((need) => need.fr.text.includes(props.search))
        .sort((a, b) => (a.theme.position > b.theme.position ? 1 : -1));
    }
    return needs
      .filter((need) => need.theme._id === themeSelected)
      .sort((a, b) => ((a.position || 0) > (b.position || 0) ? 1 : -1));
  }, [themeSelected, needs, props.search]);

  const isAllSelected = !displayedNeeds.find((need) => !needsSelected.includes(need._id));

  return (
    <div className={styles.container}>
      <div className={cls(styles.themes, props.search && styles.hidden)}>
        {themes.map((theme, i) => {
          const selected = themeSelected === theme._id;
          return (
            <ButtonTheme
              key={i}
              className={styles.btn}
              color100={theme.colors.color100}
              color30={theme.colors.color30}
              selected={selected}
              onClick={() => setThemeSelected(theme._id)}
            >
              <span className={styles.btn_content}>
                <TagName theme={theme} colored={themeSelected !== theme._id} size={20} />
                {themeSelected !== theme._id &&
                  nbNeedsSelectedByTheme[theme._id.toString()] &&
                  nbNeedsSelectedByTheme[theme._id.toString()] > 0 && (
                    <span style={{ backgroundColor: theme.colors.color100 }} className={styles.theme_badge}>
                      {nbNeedsSelectedByTheme[theme._id.toString()] || 0}
                    </span>
                  )}
              </span>
              {themeSelected === theme._id && <EVAIcon name="chevron-right-outline" fill="white" className="ml-2" />}
            </ButtonTheme>
          );
        })}
      </div>
      <div className={styles.needs}>
        {themeSelected && !props.search && (
          <ButtonNeed
            className={styles.btn}
            color100={colors?.color100 || "black"}
            color30={colors?.color30 || "gray"}
            selected={isAllSelected}
            onClick={() =>
              selectAllNeeds(
                displayedNeeds.map((n) => n._id),
                isAllSelected
              )
            }
          >
            <Checkbox checked={isAllSelected} color={!isAllSelected && colors ? colors.color100 : "white"}>
              <span className={styles.all}>
                <EVAIcon name="grid" fill={!isAllSelected && colors ? colors.color100 : "white"} />
                Tous
                <span
                  className={styles.badge}
                  style={{
                    backgroundColor: colors?.color30,
                    color: colors?.color100
                  }}
                >
                  {nbDispositifsByTheme[themeSelected.toString()] || 0}
                </span>
              </span>
            </Checkbox>
          </ButtonNeed>
        )}
        {displayedNeeds.map((need, i) => {
          const selected = needsSelected.includes(need._id);
          return (
            <span key={i}>
              {props.search &&
                // check if this need has a different theme from previous one
                (i === 0 || displayedNeeds[i - 1].theme._id !== need.theme._id) && (
                  <div className={styles.list_theme}>
                    <TagName theme={need.theme} colored={true} size={20} />
                  </div>
                )}
              <ButtonNeed
                className={styles.btn}
                color100={need.theme.colors.color100}
                color30={need.theme.colors.color30}
                selected={selected}
                onClick={() => selectNeed(need._id)}
              >
                <Checkbox checked={selected} color={selected ? "white" : need.theme.colors.color100}>
                  {need.fr.text}
                  <span
                    className={styles.badge}
                    style={{
                      backgroundColor: need.theme.colors.color30,
                      color: need.theme.colors.color100
                    }}
                  >
                    {nbDispositifsByNeed[need._id.toString()] || 0}
                  </span>
                </Checkbox>
              </ButtonNeed>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeDropdown;
