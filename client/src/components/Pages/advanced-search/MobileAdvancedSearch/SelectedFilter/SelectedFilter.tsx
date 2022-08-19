import React from "react";
import Streamline from "assets/streamline";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import { Theme } from "types/interface";
import { AvailableFilters } from "data/searchFilters";
import { cls } from "lib/classname";
import styles from "../MobileAdvancedSearch.module.scss";
import Language from "components/UI/Language";
import { getThemeName } from "lib/getThemeName";
import { useRouter } from "next/router";

interface Props {
  themeSelected?: Theme | null;
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
  const router = useRouter()

  if (props.type === "theme") {
    return (
      <button
        className={cls(
          styles.search_btn,
          !!props.themeSelected && styles.selected
        )}
        style={props.themeSelected ? {
          backgroundColor: props.themeSelected.colors.color100,
          borderColor: props.themeSelected.colors.color100
        } : {}}
        onClick={() => props.toggleShowModal(props.type)}
      >
        {props.themeSelected ? (
          <>
            {props.themeSelected?.icon ? (
              <Streamline
                name={props.themeSelected.icon}
                stroke={"white"}
                width={20}
                height={20}
              />
            ) : null}
            <div className={styles.theme_name}>
              {getThemeName(props.themeSelected, router.locale)}
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
            <Language i18nCode={props.otherFilterSelected} /> :
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
