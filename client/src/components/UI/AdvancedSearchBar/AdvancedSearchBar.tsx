import React, { useState, useEffect, useRef, useCallback } from "react";
import { initGA, Event } from "tracking/dispatch";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import styled from "styled-components";
import Highlighter from "react-highlight-words";
import { debounce } from "lodash";
import i18n from "i18n";
import type { IDispositif } from "types/interface";
import * as themes from "data/synonym";
import Streamline from "assets/streamline";
import NoResultPlaceholder from "./NoResultPlaceholder";
import { filtres } from "containers/Dispositif/data";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";

import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useOutsideClick from "hooks/useOutsideClick";

import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";

const SearchModalContainer = styled.div`
  position: fixed;
  width: 850px;
  background-color: #cdcdcd;
  border-radius: 12px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.25);
  padding: 8px;
  top: 100px;
  right: ${(props) => (props.rtl ? null : "100px")};
  left: ${(props) => (props.rtl ? "100px" : null)};
`;

const NoSearchModalContainer = styled.div`
  position: fixed;
  width: 390px;
  background-color: #cdcdcd;
  border-radius: 12px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.25);
  padding: 8px;
  top: 100px;
  right: ${(props) => (props.rtl ? null : "100px")};
  left: ${(props) => (props.rtl ? "100px" : null)};
`;

const SeeAllButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${(props) => (props.black ? "#212121" : "#ffffff")};
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
  margin-right: ${(props) => (props.mr ? "8px" : "0px")};
  margin-left: ${(props) => (props.ml ? "8px" : null)};
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

const SeeAllSectionTitle = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  color: ${(props) => (props.white ? "#ffffff" : "#828282")};
  margin-left: ${(props) => (props.rtl ? null : "10px")};
  margin-right: ${(props) => (props.rtl ? "10px" : null)};
  margin-bottom: 0px;
  align-self: center;
`;
const ThemeButton = styled.div`
  background-color: ${(props) => props.color};
  display: flex;
  flex-direction: row;
  padding: 12px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-left: ${(props) => (props.ml ? "8px" : "0px")};
  margin-right: ${(props) => (props.mr ? "8px" : "0px")};
`;
const ThemeText = styled.p`
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 0px;
  margin-left: ${(props) => (props.rtl ? null : "8px")};
  margin-right: ${(props) => (props.rtl ? "8px" : null)};
`;

const ThemeActionText = styled.p`
  color: ${(props) => props.color};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 0px;
`;

const ThemeDispositifText = styled.p`
  color: ${(props) => props.color};
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
    background-color: ${(props) => (props.color ? props.color : "white")};
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

  var wrapperRef: React.MutableRefObject<Element|undefined> = useRef();

  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

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
      themes[i18n.language === "ti-ER" ? "ti" : i18n.language]
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

    initGA();
    Event("USE_SEARCHBAR", value, "label");
  };

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
                if (router.pathname === "/advanced-search") {
                  router.replace("/advanced-search");
                  window.location.reload();
                } else {
                  router.push("/advanced-search");
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
                      const selectedTag = filtres.tags.find((tag) => tag.short === elem);
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
                                pathname: "/advanced-search",
                                search: selectedTag ? "?tag=" + selectedTag.name : "",
                              });
                              window.location.reload();
                            } else {
                              router.push({
                                pathname: "/advanced-search",
                                search: selectedTag ? "?tag=" + selectedTag.name : "",
                              });
                            }
                          }}
                          color={selectedTag ? selectedTag.lightColor : null}
                        >
                          <ThemeActionText
                            color={selectedTag ? selectedTag.darkColor : null}
                          >
                            {
                              selectedTag ? t(
                                "Tags." + selectedTag.name, selectedTag.name
                              )[0].toUpperCase() +
                              t("Tags." + selectedTag.name, selectedTag.name).slice(1)
                              : ""
                            }
                          </ThemeActionText>
                          <ThemeButton
                            ml={isRTL ? false : true}
                            mr={isRTL ? true : false}
                            color={selectedTag ? selectedTag.darkColor : null}
                          >
                            <Streamline
                              name={selectedTag ? selectedTag.icon : undefined}
                              stroke={"white"}
                              width={22}
                              height={22}
                            />
                            <ThemeText rtl={isRTL}>
                              {selectedTag
                                ? t(
                                    "Tags." + selectedTag.short,
                                    selectedTag.short
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
                    {searchDispositifs.map((elem, index) => {
                      var selectedTag = filtres.tags.find((tag) => (
                        elem.tags[0] ? tag.short === elem.tags[0].short : false
                      ));
                      return (
                        <ThemeContainer
                          key={"disp-" + index}
                          color={selectedTag ? selectedTag.lightColor : null}
                          onClick={() => {
                            setSearchText("");
                            router.push(
                              "/" +
                                (elem.typeContenu || "dispositif") +
                                (elem._id ? "/" + elem._id : "")
                            );
                          }}
                        >
                          <ThemeButton
                            color={selectedTag ? selectedTag.darkColor : null}
                            mr={isRTL ? false : true}
                            ml={isRTL ? true : false}
                          >
                            <Streamline
                              name={selectedTag ? selectedTag.icon : undefined}
                              stroke={"white"}
                              width={22}
                              height={22}
                            />
                          </ThemeButton>
                          <ThemeDispositifText
                            color={selectedTag ? selectedTag.darkColor : null}
                          >
                            <Highlighter
                              //highlightClassName="highlighter"
                              highlightStyle={{
                                fontWeight: "bold",
                                color: selectedTag
                                  ? selectedTag.darkColor
                                  : "black",
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
                                elem.titreInformatif.slice(0, 30) +
                                (elem.titreInformatif.length > 30 ? "..." : "")
                              }
                            />
                            {elem.titreMarque && " avec "}
                            {elem.titreMarque ? (
                              <Highlighter
                                //highlightClassName="highlighter"
                                highlightStyle={{
                                  fontWeight: "bold",
                                  color: selectedTag
                                    ? selectedTag.darkColor
                                    : "black",
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
                                  elem.titreMarque.slice(0, 25) +
                                  (elem.titreMarque.length > 25 ? "..." : "")
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
                if (router.pathname === "/advanced-search") {
                  router.replace("/advanced-search");
                  window.location.reload();
                } else {
                  router.push("/advanced-search");
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
