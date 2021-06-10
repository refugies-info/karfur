import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import Highlighter from "react-highlight-words";
import * as themes from "./data";
import Streamline from "../../../assets/streamline";
import NoResultPlaceholder from "./NoResultPlaceholder";
import { filtres } from "../../Dispositif/data";

import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import useOutsideClick from "./useOutsideClick";
import i18n from "../../../i18n";

import "./AdvancedSearchBar.scss";
import { CustomSearchBar } from "../../../components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";

/* const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${NoResultsBackgroundImage});
  width: 256px;
  height: 174px;
  margin-right: 0px;
`; */

const SearchModalContainer = styled.div`
  position: fixed;
  width: 850px;
  // height: 350px;
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
  // height: 350px;
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
    //color: transparent;
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
    //color: transparent;
    outline: none !important;
  }
  &:hover {
    background-color: ${(props) => (props.color ? props.color : "white")};
  }
  border: 0px;
`;

const AdvancedSearchBar = (props) => {
  const [searchThemes, setSearchThemes] = useState([]);
  const [searchDispositifs, setSearchDispositifs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchModalVisible, toggleSearchModal] = useState(false);

  var wrapperRef = useRef();

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

  const onTextChange = (e) => {
    setSearchText(e.target.value);
    const text = e.target.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
    const dispositifsMatchedArray = [];
    const themesMatchedArray = [];
    props.dispositifs.map((elem) => {
      if (
        (elem.titreInformatif &&
          elem.titreInformatif
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(text)) ||
        (elem.titreMarque &&
          elem.titreMarque
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(text))
      ) {
        dispositifsMatchedArray.push(elem);
      }
    });
    for (const [key, value] of Object.entries(
      themes[i18n.language === "ti-ER" ? "ti" : i18n.language]
    )) {
      value.map((theme) => {
        if (
          theme
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(text) &&
          !themesMatchedArray.includes(key)
        ) {
          themesMatchedArray.push(key);
        }
      });
    }
    setSearchThemes(themesMatchedArray);
    setSearchDispositifs(dispositifsMatchedArray);
  };

  return (
    <>
      <CustomSearchBar
        value={searchText}
        placeholder={props.t("Rechercher...", "Rechercher...")}
        onChange={onTextChange}
        withMargin={true}
        screenWidth={props.screenWidth}
      />
      {isSearchModalVisible &&
        (searchThemes.length === 0 && searchDispositifs.length === 0 ? (
          <NoSearchModalContainer rtl={isRTL} ref={wrapperRef}>
            <NoResultPlaceholder />
            <SeeAllButton
              black
              onClick={() => {
                setSearchText("");
                if (props.location.pathname === "/advanced-search") {
                  props.history.replace("/advanced-search");
                  window.location.reload();
                } else {
                  props.history.push("/advanced-search");
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
                  {props.t(
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
                      var selectedTag = filtres.tags.find((tag) => {
                        return tag.short === elem;
                      });
                      return (
                        <ThemeContainer
                          key={"theme-" + index}
                          onClick={() => {
                            setSearchText("");
                            if (
                              props.location.pathname.includes(
                                "/advanced-search"
                              )
                            ) {
                              props.history.push({
                                pathname: "/advanced-search",
                                search: "?tag=" + selectedTag.name,
                              });
                              window.location.reload();
                            } else {
                              props.history.push({
                                pathname: "/advanced-search",
                                search: "?tag=" + selectedTag.name,
                              });
                            }
                          }}
                          color={selectedTag ? selectedTag.lightColor : null}
                        >
                          <ThemeActionText
                            color={selectedTag ? selectedTag.darkColor : null}
                          >
                            {props
                              .t(
                                "Tags." + selectedTag.name,
                                selectedTag.name
                              )[0]
                              .toUpperCase() +
                              props
                                .t("Tags." + selectedTag.name, selectedTag.name)
                                .slice(1)}
                          </ThemeActionText>
                          <ThemeButton
                            ml={isRTL ? false : true}
                            mr={isRTL ? true : false}
                            color={selectedTag ? selectedTag.darkColor : null}
                          >
                            <Streamline
                              name={selectedTag ? selectedTag.icon : null}
                              stroke={"white"}
                              width={22}
                              height={22}
                            />
                            <ThemeText rtl={isRTL}>
                              {selectedTag
                                ? props.t(
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
                      var selectedTag = filtres.tags.find((tag) => {
                        if (elem.tags[0]) {
                          return tag.short === elem.tags[0].short;
                        }
                      });
                      return (
                        <ThemeContainer
                          key={"disp-" + index}
                          color={selectedTag ? selectedTag.lightColor : null}
                          onClick={() => {
                            setSearchText("");
                            props.history.push(
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
                              name={selectedTag ? selectedTag.icon : null}
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
                              sanitize={(text) =>
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
                                sanitize={(text) =>
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
                if (props.location.pathname === "/advanced-search") {
                  props.history.replace("/advanced-search");
                  window.location.reload();
                } else {
                  props.history.push("/advanced-search");
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
                  {props.t(
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

const mapStateToProps = (state) => {
  return {
    dispositifs: state.activeDispositifs,
  };
};

export default withRouter(
  connect(mapStateToProps)(withTranslation()(AdvancedSearchBar))
);
