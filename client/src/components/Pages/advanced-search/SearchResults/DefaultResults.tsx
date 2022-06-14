import useRTL from "hooks/useRTL";
import { DispositifsFilteredState } from "lib/filterContents";
import { useTranslation } from "next-i18next";
import { IDispositif, IUserFavorite, Language, Tag } from "types/interface";
import NoResultPlaceholder from "../NoResultPlaceholder";
import SearchResultCard from "../SearchResultCard";
import styles from "./SearchResults.module.scss";

interface Props {
  langueCode: string;
  filterLanguage: Language | null;
  currentLanguage: Language | null;
  queryResults: DispositifsFilteredState;
  embed: boolean;
  pin?: (e: any, dispositif: IDispositif | IUserFavorite)  => void;
  pinnedList?: string[];
  restart?: () => void;
  writeNew?: () => void;
  isLoading: boolean
}

export const DefaultResults = (props: Props) => {
  const { t } = useTranslation();
  const isRTL = useRTL();

  const {
    langueCode,
    filterLanguage,
    currentLanguage,
  } = props;

  const {
    dispositifs,
    nonTranslated
  } = props.queryResults;


  return (
    <div className={styles.theme_container}>
      {langueCode !== "fr" || filterLanguage ? (
        <>
          <div className={styles.header}>
            <p className={styles.title}>
              <>
                {t("AdvancedSearch.Résultats disponibles en") + " "}
                <i
                  className={
                    "flag-icon flag-icon-" +
                    (filterLanguage
                      ? filterLanguage.langueCode
                      : langueCode)
                  }
                  title={
                    filterLanguage
                      ? filterLanguage.langueCode
                      : langueCode
                  }
                  id={
                    filterLanguage
                      ? filterLanguage.langueCode
                      : langueCode
                  }
                />
                <span
                  className={
                    "language-name " + (isRTL ? "mr-10" : "ml-10")
                  }
                >
                  {(filterLanguage
                    ? filterLanguage.langueFr
                    : currentLanguage?.langueFr) || "Langue"}
                </span>
              </>
            </p>
          </div>
          <div className={styles.theme_grid}>
            {dispositifs.length > 0 ? (
              dispositifs.map((dispositif, index: number) => {
                return (
                  <div key={index}>
                    <SearchResultCard
                      pin={props.pin}
                      pinnedList={props.pinnedList}
                      dispositif={dispositif}
                      showPinned={!props.embed}
                      linkBlank={props.embed}
                    />
                  </div>
                );
              })
            ) : (
              <NoResultPlaceholder
                restart={props.restart}
                writeNew={props.writeNew}
              />
            )}
          </div>
          <div className={styles.header}>
            <p className={styles.title}>
              <>
                {t("AdvancedSearch.Résultats non disponibles en") + " "}
                <i
                  className={
                    "flag-icon flag-icon-" +
                    (filterLanguage
                      ? filterLanguage.langueCode
                      : langueCode)
                  }
                  title={
                    filterLanguage
                      ? filterLanguage.langueCode
                      : langueCode
                  }
                  id={
                    filterLanguage
                      ? filterLanguage.langueCode
                      : langueCode
                  }
                />
                <span
                  className={
                    "language-name " + (isRTL ? "mr-10" : "ml-10")
                  }
                >
                  {(filterLanguage
                    ? filterLanguage.langueFr
                    : currentLanguage?.langueFr) || "Langue"}
                </span>
              </>
            </p>
          </div>
          <div className={styles.theme_grid}>
            {nonTranslated.length > 0 ? (
              nonTranslated.map((dispositif, index: number) => {
                return (
                  <div key={index}>
                    <SearchResultCard
                      pin={props.pin}
                      pinnedList={props.pinnedList}
                      dispositif={dispositif}
                      showPinned={!props.embed}
                      linkBlank={props.embed}
                    />
                  </div>
                );
              })
            ) : (
              <NoResultPlaceholder
                restart={props.restart}
                writeNew={props.writeNew}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.header} />
          <div className={styles.theme_grid}>
            {dispositifs.map((dispositif, index: number) => {
              return (
                <div key={index}>
                  <SearchResultCard
                    pin={props.pin}
                      pinnedList={props.pinnedList}
                      dispositif={dispositif}
                      showPinned={!props.embed}
                      linkBlank={props.embed}
                  />
                </div>
              );
            })}
              {props.isLoading && dispositifs.length === 0 &&
                <NoResultPlaceholder
                restart={props.restart}
                writeNew={props.writeNew}
                />
              }
          </div>
        </>
      )}
    </div>
  )
}
