import Streamline from "assets/streamline";
import useRTL from "hooks/useRTL";
import { cls } from "lib/classname";
import { DispositifsFilteredState } from "lib/filterContents";
import { useTranslation } from "next-i18next";
import { SearchQuery } from "pages/recherche";
import { useState } from "react";
import { IDispositif, IUserFavorite, Language, Tag } from "types/interface";
import NoResultPlaceholder from "../NoResultPlaceholder";
import SearchResultCard from "../SearchResultCard";
import SeeMoreCard from "../SeeMoreCard";
import styles from "./SearchResults.module.scss";

interface Props {
  queryResults: DispositifsFilteredState;
  pin?: (e: any, dispositif: IDispositif | IUserFavorite)  => void;
  pinnedList?: string[];
  addToQuery: (query: Partial<SearchQuery>) => void
}

export const OrderThemeResults = (props: Props) => {
  const { t } = useTranslation();
  const isRTL = useRTL();

  const {
    themesObject
  } = props.queryResults;

  return (
    <div style={{ width: "100%" }}>
    {themesObject.map((theme, index: number) => {
      return (
        <div
          className={styles.theme_container}
          key={index}
          style={{backgroundColor: theme.tag.lightColor}}
        >
          <div className={styles.header}>
            <div
              className={styles.button}
              style={{
                backgroundColor: theme.tag.darkColor,
                marginLeft: isRTL ? 20 : 0
              }}
            >
              <Streamline
                name={theme.tag.icon}
                stroke={"white"}
                width={22}
                height={22}
              />
              <p className={styles.text}>
                {t(
                  "Tags." + theme.tag.short,
                  theme.tag.short
                )}
              </p>
            </div>
            <p
              className={styles.title}
              style={{color: theme.tag.darkColor}}
            >
              {t(
                "Tags." + theme.tag.name,
                theme.tag.name
              )[0].toUpperCase() +
                t(
                  "Tags." + theme.tag.name,
                  theme.tag.name
                ).slice(1)}
            </p>
          </div>
          <div className={styles.theme_grid}>
            {theme.dispositifs.slice(0, 4)
              .map((dispositif, index) => {
                return (
                  <SearchResultCard
                    key={index}
                    pin={props.pin}
                    pinnedList={props.pinnedList}
                    dispositif={dispositif}
                    showPinned={true}
                  />
                );
              })
            }
            <SeeMoreCard
              seeMore={() => props.addToQuery({theme: [theme.tag.name]})}
              theme={theme.tag}
              isRTL={isRTL}
            />
          </div>
        </div>
      );
    })}
  </div>
  );
};
