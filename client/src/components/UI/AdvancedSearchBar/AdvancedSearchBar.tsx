import React, { useState, useEffect, useRef, useCallback } from "react";
import { Event } from "lib/tracking";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styled from "styled-components";
import Highlighter from "react-highlight-words";
import debounce from "lodash.debounce";
import type { IDispositif } from "types/interface";
import * as themes from "data/synonym";
import Streamline from "assets/streamline";
import NoResultPlaceholder from "./NoResultPlaceholder";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";

import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useOutsideClick from "hooks/useOutsideClick";

import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import useRTL from "hooks/useRTL";
import { getPath } from "routes";
import { themesSelector } from "services/Themes/themes.selectors";

const SearchModalContainer = styled.div`
  position: fixed;
  width: 850px;
  background-color: #cdcdcd;
  border-radius: 12px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.25);
  padding: 8px;
  top: 100px;
  right: ${(props: {rtl: boolean}) => (props.rtl ? null : "100px")};
  left: ${(props: {rtl: boolean}) => (props.rtl ? "100px" : null)};
`;

const NoSearchModalContainer = styled.div`
  position: fixed;
  width: 390px;
  background-color: #cdcdcd;
  border-radius: 12px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.25);
  padding: 8px;
  top: 100px;
  right: ${(props: {rtl: boolean}) => (props.rtl ? null : "100px")};
  left: ${(props: {rtl: boolean}) => (props.rtl ? "100px" : null)};
`;

const SeeAllButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${(props: {black?: boolean}) => (props.black ? "#212121" : "#ffffff")};
  border-radius: 12px;
  padding: 8px;
  height: 65px;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  &:focus {
    outline: none !important;
  }
  border: 0px;
`;

const ResultSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  margin-right: ${(props: {mr?: boolean, ml?: boolean}) => (props.mr ? "8px" : "0px")};
  margin-left: ${(props: {mr?: boolean, ml?: boolean}) => (props.ml ? "8px" : null)};
  height: 280px;
  width: 50%;
  padding: 8px;
  overflow: scroll;
`;

const SectionTitle = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  color: #828282;
  margin-top: 10px;
  margin-left: 10px;
  line-height: 20px;
`;

interface SeeAllSectionTitleProps {
  white?: boolean
  rtl: boolean
}
const SeeAllSectionTitle = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  color: ${(props: SeeAllSectionTitleProps) => (props.white ? "#ffffff" : "#828282")};
  margin-left: ${(props: SeeAllSectionTitleProps) => (props.rtl ? null : "10px")};
  margin-right: ${(props: SeeAllSectionTitleProps) => (props.rtl ? "10px" : null)};
  margin-bottom: 0px;
  align-self: center;
`;
interface ThemeButtonProps {
  mr: boolean
  ml: boolean
  color: string
}
const ThemeButton = styled.div`
  background-color: ${(props: ThemeButtonProps) => props.color};
  display: flex;
  flex-direction: row;
  padding: 12px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-left: ${(props: ThemeButtonProps) => (props.ml ? "8px" : "0px")};
  margin-right: ${(props: ThemeButtonProps) => (props.mr ? "8px" : "0px")};
`;
const ThemeText = styled.p`
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-left: ${(props: {rtl: boolean}) => (props.rtl ? null : "8px")};
  margin-right: ${(props: {rtl: boolean}) => (props.rtl ? "8px" : null)};
`;

const ThemeActionText = styled.p`
  color: ${(props: {color: string}) => props.color};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0px;
`;

const ThemeDispositifText = styled.p`
  color: ${(props: {color: string}) => props.color};
  font-size: 18px;
  margin-bottom: 0px;
  text-align: left;
`;

const ThemeContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  background-color: white;
  outline: none;
  &:focus {
    outline: none !important;
  }
  &:hover {
    background-color: ${(props: {color?: string}) => (props.color ? props.color : "white")};
  }
  border: 0px;
`;

interface Props {
  visible: boolean
  scroll: boolean
}

const AdvancedSearchBar = (props: Props) => {
  const [searchThemes, setSearchThemes] = useState<string[]>([]);
  const [searchDispositifs, setSearchDispositifs] = useState<IDispositif[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchModalVisible, toggleSearchModal] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  var wrapperRef: React.MutableRefObject<any> = useRef();

  const isRTL = useRTL();

  useOutsideClick(wrapperRef, () => {
    toggleSearchModal(false);
    setSearchText("");
  });

  useEffect(() => {
    if (searchText !== "" && (props.visible || !props.scroll)) {
      toggleSearchModal(true);
    } else {
      toggleSearchModal(false);
    }
  }, [searchText, props.visible, props.scroll]);

  const normalize = useCallback((val) => (
    val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  ), []);

  const themes = useSelector(themesSelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const search = (value: string) => {
    const text = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
    const themesMatchedArray: string[] = [];
    for (const [key, theme] of Object.entries(
      //@ts-ignore
      themes[router.locale || "fr"]
    )) {
      for (const synonym of theme as string[]) {
        if (
          normalize(synonym).includes(text) &&
          !themesMatchedArray.includes(key)
        ) {
          themesMatchedArray.push(key);
        }
      }
    }
    setSearchThemes(themesMatchedArray);
    setSearchDispositifs(dispositifs.filter(elem =>
      (elem.titreInformatif && normalize(elem.titreInformatif).includes(text))
      || (elem.titreMarque && normalize(elem.titreMarque).includes(text))
    ));

    Event("USE_SEARCHBAR", value, "label");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(
    debounce((q: string) => search(q), 500),
    [dispositifs]
  );
  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return
    setSearchText(e.target.value);
    delayedSearch(e.target.value);
  };

  return (
    <>
      <CustomSearchBar
        value={searchText}
        placeholder={t("Rechercher2", "Rechercher...")}
        onChange={onTextChange}
        withMargin={true}
      />
      {isSearchModalVisible &&
        (searchThemes.length === 0 && searchDispositifs.length === 0 ? (
          <NoSearchModalContainer rtl={isRTL} ref={wrapperRef}>
            <NoResultPlaceholder />
            <SeeAllButton
              black
              onClick={() => {
                setSearchText("");
                if (router.pathname === "/recherche") {
                  router.replace(getPath("/recherche", router.locale));
                  window.location.reload();
                } else {
                  router.push(getPath("/recherche", router.locale));
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Streamline
                  width={25}
                  height={25}
                  name={"menu"}
                  stroke={"#ffffff"}
                />
                <SeeAllSectionTitle rtl={isRTL} white>
                  {t(
                    "AdvancedSearch.Voir les fiches",
                    "Voir toutes les fiches"
                  )}
                </SeeAllSectionTitle>
              </div>
              <div style={{}}>
                {isRTL ? (
                  <EVAIcon
                    name="arrow-back-outline"
                    fill={"#ffffff"}
                    size={"large"}
                  />
                ) : (
                  <EVAIcon
                    name="arrow-forward-outline"
                    fill={"#ffffff"}
                    size={"large"}
                  />
                )}
              </div>
            </SeeAllButton>
          </NoSearchModalContainer>
        ) : (
          <SearchModalContainer rtl={isRTL} ref={wrapperRef}>
            <div />
            <div style={{ display: "flex", flexDirection: "row" }}>
              <ResultSection
                mr={isRTL ? false : true}
                ml={isRTL ? true : false}
              >
                {searchThemes.length > 0 ? (
                  <>
                    <SectionTitle>Thèmes</SectionTitle>
                    {searchThemes.map((elem, index) => {
                      const selectedTheme = themes.find((theme) => theme.short.fr === elem);
                      return (
                        <ThemeContainer
                          key={"theme-" + index}
                          onClick={() => {
                            setSearchText("");
                            if (
                              router.pathname.includes(
                                "/advanced-search"
                              )
                            ) {
                              router.push({
                                pathname: getPath("/recherche", router.locale),
                                search: selectedTheme ? "?tag=" + selectedTheme.name.fr : "",
                              });
                              window.location.reload();
                            } else {
                              router.push({
                                pathname: getPath("/recherche", router.locale),
                                search: selectedTheme ? "?tag=" + selectedTheme.name.fr : "",
                              });
                            }
                          }}
                          color={selectedTheme ? selectedTheme.colors.color30 : ""}
                        >
                          <ThemeActionText
                            color={selectedTheme ? selectedTheme.colors.color100 : ""}
                          >
                            { // TODO : translate
                              selectedTheme ? t(
                                "Tags." + selectedTheme.name.fr, selectedTheme.name.fr
                              )[0].toUpperCase() +
                              t("Tags." + selectedTheme.name.fr, selectedTheme.name.fr).slice(1)
                              : ""
                            }
                          </ThemeActionText>
                          <ThemeButton
                            ml={isRTL ? false : true}
                            mr={isRTL ? true : false}
                            color={selectedTheme ? selectedTheme.colors.color100 : ""}
                          >
                            <Streamline
                              name={selectedTheme ? selectedTheme.icon : undefined}
                              stroke={"white"}
                              width={22}
                              height={22}
                            />
                            <ThemeText rtl={isRTL}>
                              {selectedTheme
                                ? t(
                                    "Tags." + selectedTheme.short,
                                    selectedTheme.short
                                  )
                                : null}
                            </ThemeText>
                          </ThemeButton>
                        </ThemeContainer>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <SectionTitle>Thèmes</SectionTitle>
                    <NoResultPlaceholder />
                  </>
                )}
              </ResultSection>
              <ResultSection>
                {searchDispositifs.length > 0 ? (
                  <>
                    <SectionTitle>Fiches</SectionTitle>
                    {searchDispositifs.map((dispositif, index) => {
                      return (
                        <ThemeContainer
                          key={"disp-" + index}
                          color={dispositif.theme.colors.color30 || ""}
                          onClick={() => {
                            setSearchText("");
                            const route = dispositif.typeContenu === "demarche"
                              ? "/demarche/[id]" : "/dispositif/[id]";
                            router.push({
                              pathname: getPath(route, router.locale),
                              query: {id: dispositif._id.toString() || ""}});
                            }}
                        >
                          <ThemeButton
                            color={dispositif.theme.colors.color100 || ""}
                            mr={isRTL ? false : true}
                            ml={isRTL ? true : false}
                          >
                            <Streamline
                              name={dispositif.theme.icon || undefined}
                              stroke={"white"}
                              width={22}
                              height={22}
                            />
                          </ThemeButton>
                          <ThemeDispositifText
                            color={dispositif.theme.colors.color100 || ""}
                          >
                            <Highlighter
                              //highlightClassName="highlighter"
                              highlightStyle={{
                                fontWeight: "bold",
                                color: dispositif.theme.colors.color100 || "black",
                                backgroundColor: "white",
                                padding: "0px",
                              }}
                              searchWords={[searchText]}
                              autoEscape={true}
                              sanitize={(text: string) =>
                                text
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, "")
                                  .trim()
                                  .toLowerCase()
                              }
                              textToHighlight={
                                dispositif.titreInformatif.slice(0, 30) +
                                (dispositif.titreInformatif.length > 30 ? "..." : "")
                              }
                            />
                            {dispositif.titreMarque && " avec "}
                            {dispositif.titreMarque ? (
                              <Highlighter
                                //highlightClassName="highlighter"
                                highlightStyle={{
                                  fontWeight: "bold",
                                  color: dispositif.theme.colors.color100 || "black",
                                  backgroundColor: "white",
                                  padding: "0px",
                                }}
                                searchWords={[searchText]}
                                autoEscape={true}
                                sanitize={(text: string) =>
                                  text
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .trim()
                                    .toLowerCase()
                                }
                                textToHighlight={
                                  dispositif.titreMarque.slice(0, 25) +
                                  (dispositif.titreMarque.length > 25 ? "..." : "")
                                }
                              />
                            ) : null}
                          </ThemeDispositifText>
                        </ThemeContainer>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <SectionTitle>Fiches</SectionTitle>
                    <NoResultPlaceholder />
                  </>
                )}
              </ResultSection>
            </div>
            <SeeAllButton
              onClick={() => {
                setSearchText("");
                if (router.pathname === "/recherche") {
                  router.replace(getPath("/recherche", router.locale));
                  window.location.reload();
                } else {
                  router.push(getPath("/recherche", router.locale));
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Streamline
                  width={25}
                  height={25}
                  name={"menu"}
                  stroke={"#828282"}
                />
                <SeeAllSectionTitle rtl={isRTL}>
                  {t(
                    "AdvancedSearch.Voir les fiches",
                    "Voir toutes les fiches"
                  )}
                </SeeAllSectionTitle>
              </div>
              <div style={{}}>
                {isRTL ? (
                  <EVAIcon
                    name="arrow-back-outline"
                    fill={"#828282"}
                    size={"large"}
                  />
                ) : (
                  <EVAIcon
                    name="arrow-forward-outline"
                    fill={"#828282"}
                    size={"large"}
                  />
                )}
              </div>
            </SeeAllButton>
          </SearchModalContainer>
        ))}
    </>
  );
};

export default AdvancedSearchBar;
