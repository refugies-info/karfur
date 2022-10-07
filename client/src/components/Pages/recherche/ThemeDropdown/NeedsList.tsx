import React, { useEffect, useState, memo } from "react";
import styled from "styled-components";
import { ObjectId } from "mongodb";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { themesSelector } from "services/Themes/themes.selectors";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { Need } from "types/interface";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import TagName from "components/UI/TagName";
import Checkbox from "components/UI/Checkbox";
import styles from "./ThemeDropdown.module.scss";
import { needsSelector } from "services/Needs/needs.selectors";
import { getNeedsFromThemes, getThemesFromNeeds } from "lib/recherche/getThemesFromNeeds";

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
  themesSelected: ObjectId[];
  setThemesSelected: (value: React.SetStateAction<ObjectId[]>) => void;
  search: string;
  displayedNeeds: Need[];
  themeSelected: ObjectId | null;
}

const NeedsList = (props: Props) => {
  const { t } = useTranslation();
  const themes = useSelector(themesSelector);
  const allNeeds = useSelector(needsSelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const [nbDispositifsByNeed, setNbDispositifsByNeed] = useState<Record<string, number>>({});
  const [nbDispositifsByTheme, setNbDispositifsByTheme] = useState<Record<string, number>>({});

  const colors = themes.find((t) => props.themeSelected === t._id)?.colors;

  useEffect(() => {
    // TODO : here x14 -> should be x1
    // count initial dispositifs by need
    const newNbDispositifsByNeed: Record<string, number> = {};
    const newNbDispositifsByTheme: Record<string, number> = {};

    for (const dispositif of dispositifs) {
      for (const needId of dispositif.needs || []) {
        newNbDispositifsByNeed[needId.toString()] = (newNbDispositifsByNeed[needId.toString()] || 0) + 1;
      }

      const themeId = dispositif.theme.toString();
      newNbDispositifsByTheme[themeId] = (newNbDispositifsByTheme[themeId] || 0) + 1;
      for (const theme of dispositif.secondaryThemes || []) {
        newNbDispositifsByTheme[theme.toString()] = (newNbDispositifsByTheme[theme.toString()] || 0) + 1;
      }
    }

    setNbDispositifsByTheme(newNbDispositifsByTheme);
    setNbDispositifsByNeed(newNbDispositifsByNeed);
  }, [dispositifs]);

  const {
    needsSelected,
    setNeedsSelected,
    themesSelected,
    setThemesSelected
  } = props;

  const isThemeSelected = !!(props.themeSelected && themesSelected.includes(props.themeSelected));

  const selectNeed = (id: ObjectId) => {
    let allSelectedNeeds: ObjectId[] = [
      ...needsSelected,
      ...getNeedsFromThemes(themesSelected, allNeeds)
    ];

    if (allSelectedNeeds.includes(id)) { // if need selected, remove
      allSelectedNeeds = allSelectedNeeds.filter((n) => n !== id);
    } else { // if not selected, add
      allSelectedNeeds = [...allSelectedNeeds, id]
    }

    const res = getThemesFromNeeds(allSelectedNeeds, allNeeds);
    setNeedsSelected(res.needs);
    setThemesSelected(res.themes);
  }

  const selectTheme = (id: ObjectId | null) => {
    if (!id) return;
    if (themesSelected.includes(id)) {
      setThemesSelected((themes) => themes.filter((n) => n !== id));
    } else {
      const newNeeds = allNeeds.filter(n => {
        return needsSelected.includes(n._id) && n.theme._id !== id
      }).map(n => n._id);
      setThemesSelected((themes) => [...themes, id]);
      setNeedsSelected(newNeeds);
    }
  };

  return (
    <div className={styles.needs}>
      {props.themeSelected && !props.search && (
        <ButtonNeed
          className={styles.btn}
          color100={colors?.color100 || "black"}
          color30={colors?.color30 || "gray"}
          selected={isThemeSelected}
          onClick={() => selectTheme(props.themeSelected)}
        >
          <Checkbox checked={isThemeSelected} color={!isThemeSelected && colors ? colors.color100 : "white"}>
            <span className={styles.all}>
              <EVAIcon name="grid" fill={!isThemeSelected && colors ? colors.color100 : "white"} />
              {t("Recherche.all", "Tous")}
              <span
                className={styles.badge}
                style={{
                  backgroundColor: colors?.color30,
                  color: colors?.color100
                }}
              >
                {nbDispositifsByTheme[props.themeSelected.toString()] || 0}
              </span>
            </span>
          </Checkbox>
        </ButtonNeed>
      )}
      {props.displayedNeeds.map((need, i) => {
        const selected = needsSelected.includes(need._id) || themesSelected.includes(need.theme._id);
        return (
          <span key={i}>
            {props.search &&
              // check if this need has a different theme from previous one
              (i === 0 || props.displayedNeeds[i - 1].theme._id !== need.theme._id) && (
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
  );
};

export default memo(NeedsList);
