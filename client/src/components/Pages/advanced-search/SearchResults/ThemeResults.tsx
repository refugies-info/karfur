import Streamline from "assets/streamline";
import useRTL from "hooks/useRTL";
import { cls } from "lib/classname";
import { DispositifsFilteredState } from "lib/filterContents";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { IDispositif, IUserFavorite, Language, Tag } from "types/interface";
import NoResultPlaceholder from "../NoResultPlaceholder";
import SearchResultCard from "../SearchResultCard";
import styles from "./SearchResults.module.scss";

interface Props {
  langueCode: string;
  flagIconCode: string;
  selectedTag: Tag | null;
  filterLanguage: Language | null;
  currentLanguage: Language | null;
  queryResults: DispositifsFilteredState;
  embed: boolean;
  pin?: (e: any, dispositif: IDispositif | IUserFavorite) => void;
  pinnedList?: string[];
  restart?: () => void;
  writeNew?: () => void;
}

export const ThemeResults = (props: Props) => {
  const { t } = useTranslation();
  const isRTL = useRTL();

  const [showGeolocFullFrancePrincipal, setShowGeolocFullFrancePrincipal] =
    useState(false);
  const [showGeolocFullFranceSecondary, setShowGeolocFullFranceSecondary] =
    useState(false);

  const {
    langueCode,
    filterLanguage,
    currentLanguage,
    flagIconCode,
    selectedTag,
  } = props;

  const {
    filterVille,
    principalThemeList,
    secondaryThemeList,
    principalThemeListFullFrance,
    secondaryThemeListFullFrance,
  } = props.queryResults;

  return (
    <div className={styles.theme_container}>
      <div className={styles.header}>
        <p className={styles.title}>
          {langueCode !== "fr" || filterLanguage !== null ? (
            <>
              {t("AdvancedSearch.Résultats disponibles en") + " "}
              <i
                className={"flag-icon flag-icon-" + flagIconCode}
                title={flagIconCode}
                id={flagIconCode}
              />
              <span className={"language-name " + (isRTL ? "mr-10" : "ml-10")}>
                {(filterLanguage
                  ? filterLanguage.langueFr
                  : currentLanguage?.langueFr) || "Langue"}
              </span>
              {" " + t("AdvancedSearch.avec le thème")}
            </>
          ) : (
            t("AdvancedSearch.fiches avec le thème")[0].toUpperCase() +
            t("AdvancedSearch.fiches avec le thème").slice(1)
          )}
          <span
            className={cls(styles.button, styles.inline_button)}
            style={selectedTag ? { backgroundColor: selectedTag.darkColor } : {}}
          >
            <Streamline
              name={selectedTag ? selectedTag.icon : undefined}
              stroke={"white"}
              width={22}
              height={22}
            />
            <p className={styles.text}>
              {selectedTag
                ? t("Tags." + selectedTag.short, selectedTag.short)
                : null}
            </p>
          </span>
          {filterVille ? (
            <span className={styles.title}>{" disponibles à "}</span>
          ) : null}
          {filterVille ? (
            <span
              className={cls(styles.button, styles.inline_button)}
            >
              <p className={styles.text_alone}>{filterVille}</p>
            </span>
          ) : null}
        </p>
      </div>
      <div className={styles.theme_grid}>
        {principalThemeList.length > 0 ? (
          principalThemeList.map((dispositif, index: number) => {
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
      <div className={styles.buttons}>
        {filterVille && !showGeolocFullFrancePrincipal ? (
          <div
            className={styles.france_btn}
            onClick={() => setShowGeolocFullFrancePrincipal(true)}
          >
            {t(
              "AdvancedSearch.Afficher aussi les résultats disponibles dans",
              "Afficher aussi les résultats disponibles dans"
            )}
            <span style={{ marginLeft: "4px" }}>
              <b>{t("AdvancedSearch.toute la France")}</b>
            </span>
          </div>
        ) : filterVille && showGeolocFullFrancePrincipal ? (
          <div
            className={cls(styles.france_btn, styles.active)}
            onClick={() => setShowGeolocFullFrancePrincipal(false)}
          >
            {t("AdvancedSearch.Masquer les résultats disponibles dans")}
            <span style={{ marginLeft: "4px" }}>
              <b>{t("AdvancedSearch.toute la France")}</b>
            </span>
          </div>
        ) : null}
      </div>
      {filterVille && showGeolocFullFrancePrincipal ? (
        <div className={styles.theme_grid}>
          {principalThemeListFullFrance.length > 0 ? (
            principalThemeListFullFrance.map((dispositif, index: number) => {
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
      ) : null}
      <div className={styles.header}>
        <p className={styles.title}>
          {langueCode !== "fr" || filterLanguage ? (
            <>
              {t("AdvancedSearch.Autres fiches traduites en") + " "}
              <i
                className={"flag-icon flag-icon-" + flagIconCode}
                title={flagIconCode}
                id={flagIconCode}
              />
              <span className={"language-name " + (isRTL ? "mr-10" : "ml-10")}>
                {(filterLanguage
                  ? filterLanguage.langueFr
                  : currentLanguage?.langueFr) || "Langue"}
              </span>
              {" " + t("AdvancedSearch.avec le thème")}
            </>
          ) : (
            t("AdvancedSearch.autres fiches avec le thème")[0].toUpperCase() +
            t("AdvancedSearch.autres fiches avec le thème").slice(1)
          )}
          <span
            className={cls(styles.button, styles.inline_button)}
            style={selectedTag ? { backgroundColor: selectedTag.darkColor } : {}}
          >
            <Streamline
              name={selectedTag ? selectedTag.icon : undefined}
              stroke={"white"}
              width={22}
              height={22}
            />
            <p className={styles.text}>
              {selectedTag
                ? t("Tags." + selectedTag.short, selectedTag.short)
                : null}
            </p>
          </span>
          {filterVille ? (
            <span className={styles.title}>{" disponibles à "}</span>
          ) : null}
          {filterVille ? (
            <span
              className={cls(styles.button, styles.inline_button)}
            >
              <p className={styles.text_alone}>{filterVille}</p>
            </span>
          ) : null}
        </p>
      </div>
      <div className={styles.theme_grid}>
        {secondaryThemeList.length > 0 ? (
          secondaryThemeList.map((dispositif, index: number) => {
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
      <div className={styles.buttons}>
        {filterVille && !showGeolocFullFranceSecondary ? (
          <div
            className={styles.france_btn}
            onClick={() => setShowGeolocFullFranceSecondary(true)}
          >
            {t(
              "AdvancedSearch.Afficher aussi les autres fiches disponibles dans",
              "Afficher aussi les autres fiches disponibles dans"
            )}
            <span style={{ marginLeft: "4px" }}>
              <b>{t("AdvancedSearch.toute la France")}</b>
            </span>
          </div>
        ) : filterVille && showGeolocFullFranceSecondary ? (
          <div
            className={cls(styles.france_btn, styles.active)}
            onClick={() => setShowGeolocFullFranceSecondary(false)}
          >
            {t(
              "AdvancedSearch.Masquer les autres fiches disponibles dans",
              "Masquer les autres fiches disponibles dans"
            )}
            <span style={{ marginLeft: "4px" }}>
              <b>{t("AdvancedSearch.toute la France")}</b>
            </span>
          </div>
        ) : null}
      </div>
      {filterVille && showGeolocFullFranceSecondary ? (
        <div className={styles.theme_grid}>
          {secondaryThemeListFullFrance.length > 0 ? (
            secondaryThemeListFullFrance.map((dispositif, index: number) => {
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
      ) : null}
    </div>
  );
};
