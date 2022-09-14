import React, { useMemo, useState } from "react";
import styled from "styled-components";
import styles from "./ThemeDropdown.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import TagName from "components/UI/TagName";
import { ObjectId } from "mongodb";
import { needsSelector } from "services/Needs/needs.selectors";
import Checkbox from "components/UI/Checkbox";

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

interface Props {}

const ThemeDropdown = (props: Props) => {
  const themes = useSelector(themesSelector);
  const needs = useSelector(needsSelector);
  const [themeSelected, setThemeSelected] = useState<ObjectId | null>(null);
  const [needsSelected, setNeedsSelected] = useState<ObjectId[]>([]);

  const colors = themes.find((t) => themeSelected === t._id)?.colors;

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
    return needs.filter((need) => need.theme._id === themeSelected)
  }, [themeSelected, needs]);

  const isAllSelected = !displayedNeeds.find(need => !needsSelected.includes(need._id));

  return (
    <div className={styles.container}>
      <div className={styles.themes}>
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
              <TagName theme={theme} colored={themeSelected !== theme._id} />
              {themeSelected === theme._id && <EVAIcon name="chevron-right-outline" fill="white" className="ml-2" />}
            </ButtonTheme>
          );
        })}
      </div>
      <div className={styles.needs}>
        {themeSelected && (
          <ButtonNeed
            className={styles.btn}
            color100={colors?.color100 || "black"}
            color30={colors?.color30 || "gray"}
            selected={isAllSelected}
            onClick={() => selectAllNeeds(displayedNeeds.map(n => n._id), isAllSelected)}
          >
            <Checkbox checked={isAllSelected} color={!isAllSelected && colors ? colors.color100 : "white"}>
              <span className={styles.all}>
                <EVAIcon
                  name="grid"
                  fill={!isAllSelected && colors ? colors.color100 : "white"}
                />
                Tous
              </span>
            </Checkbox>
          </ButtonNeed>
        )}
        {displayedNeeds.map((need, i) => {
            const selected = needsSelected.includes(need._id);
            return (
              <ButtonNeed
                key={i}
                className={styles.btn}
                color100={need.theme.colors.color100}
                color30={need.theme.colors.color30}
                selected={selected}
                onClick={() => selectNeed(need._id)}
              >
                <Checkbox checked={selected} color={selected ? "white" : need.theme.colors.color100}>
                  {need.fr.text}
                </Checkbox>
              </ButtonNeed>
            );
          })}
      </div>
    </div>
  );
};

export default ThemeDropdown;
