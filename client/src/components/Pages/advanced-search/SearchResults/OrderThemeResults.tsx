import Streamline from "assets/streamline";
import useRTL from "hooks/useRTL";
import { DispositifsFilteredState } from "lib/filterContents";
import { getThemeName } from "lib/getThemeName";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { SearchQuery } from "pages/recherche";
import { IDispositif, IUserFavorite } from "types/interface";
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
  const router = useRouter();

  const {
    themesObject
  } = props.queryResults;

  return (
    <div style={{ width: "100%" }}>
    {themesObject.map((object, index: number) => {
      return (
        <div
          className={styles.theme_container}
          key={index}
          style={{backgroundColor: object.theme.colors.color30}}
        >
          <div className={styles.header}>
            <div
              className={styles.button}
              style={{
                backgroundColor: object.theme.colors.color100,
                marginLeft: isRTL ? 20 : 0
              }}
            >
              <Streamline
                name={object.theme.icon}
                stroke={"white"}
                width={22}
                height={22}
              />
              <p className={styles.text}>
                {getThemeName(object.theme, router.locale, "short")}
              </p>
            </div>
            <p
              className={styles.title}
              style={{color: object.theme.colors.color100}}
            >
              {
                getThemeName(object.theme, router.locale)[0].toUpperCase() +
                getThemeName(object.theme, router.locale).slice(1)
              }
            </p>
          </div>
          <div className={styles.theme_grid}>
            {object.dispositifs.slice(0, 4)
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
              seeMore={() => props.addToQuery({theme: [object.theme.name.fr]})}
              theme={object.theme}
              isRTL={isRTL}
            />
          </div>
        </div>
      );
    })}
  </div>
  );
};
