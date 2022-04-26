import React from "react";
import Streamline from "assets/streamline";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import { Tag } from "types/interface";
import { AvailableFilters } from "data/searchFilters";
import { cls } from "lib/classname";
import styles from "../MobileAdvancedSearch.module.scss";
import Language from "components/UI/Language";

interface Props {
  tagSelected?: Tag | null;
  otherFilterSelected?: string | null;
  toggleShowModal: (a: AvailableFilters) => void;
  type: AvailableFilters;
  title: string;
  defaultTitle: string;
  setState?: any;
  removeFromQuery: () => void;
}

export const SelectedFilter = (props: Props) => {
  const { t } = useTranslation();

  if (props.type === "theme") {
    return (
      <button
        className={cls(
          styles.search_btn,
          !!props.tagSelected && styles.selected
        )}
        style={props.tagSelected ? {
          backgroundColor: props.tagSelected.darkColor,
          borderColor: props.tagSelected.darkColor
        } : {}}
        onClick={() => props.toggleShowModal(props.type)}
      >
        {props.tagSelected ? (
          <>
            {props.tagSelected?.icon ? (
              <Streamline
                name={props.tagSelected.icon}
                stroke={"white"}
                width={20}
                height={20}
              />
            ) : null}
            <div className={styles.theme_name}>
              {t("Tags." + props.tagSelected.name, props.tagSelected.name)}
            </div>
            <span
              onClick={(e: any) => {
                e.stopPropagation();
                props.setState(null);
                props.removeFromQuery();
              }}
            >
              <EVAIcon name="close" fill={colors.gray10} size="medium" />
            </span>
          </>
        ) : (
          <>
            {t(props.title, props.defaultTitle)}
            <EVAIcon name="chevron-down" fill="#212121" size="medium" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      className={cls(
        styles.search_btn,
        !!props.otherFilterSelected && styles.selected
      )}
      onClick={() => props.toggleShowModal(props.type)}
    >
      {props.otherFilterSelected ? (
        <>
          {props.type === "langue" ?
            <Language langueCode={props.otherFilterSelected} /> :
            t("Tags." + props.otherFilterSelected, props.otherFilterSelected)
          }
          <span
            onClick={(e: any) => {
              e.stopPropagation();
              props.setState(null);
              props.removeFromQuery();
            }}
          >
            <EVAIcon name="close" fill={colors.gray10} size="medium" />
          </span>
        </>
      ) : (
        <>
          {t(props.title, props.defaultTitle)}
          <EVAIcon name="chevron-down" fill={colors.gray90} size="medium" />
        </>
      )}
    </button>
  );
};
