import React, { Component } from "react";
import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Tooltip } from "reactstrap";
import Swal from "sweetalert2";
import qs from "query-string";
import get from "lodash/get";
import { connect } from "react-redux";
import styled from "styled-components";
import { END } from "redux-saga";
import SearchItem from "components/Pages/advanced-search/SearchItem/SearchItem";
import { MobileAdvancedSearch } from "components/Pages/advanced-search/MobileAdvancedSearch/MobileAdvancedSearch";
import API from "utils/API";
import {
  filtres_contenu,
  tris,
  Tris,
  Filtres,
  searchAge,
  searchLoc,
  searchTheme,
  searchFrench,
  AvailableFilters,
} from "data/searchFilters";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { tags } from "data/tags";
import FButton from "components/UI/FButton/FButton";
import FSearchBtn from "components/UI/FSearchBtn/FSearchBtn";
import { BookmarkedModal } from "components/Modals/index";
import { fetchUserActionCreator } from "services/User/user.actions";
import {
  decodeQuery,
  DispositifsFilteredState,
  queryDispositifs,
} from "lib/filterContents";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { colors } from "colors";
import SEO from "components/Seo";
import { wrapper } from "services/configureStore";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { RootState } from "services/rootReducer";
import {
  IDispositif,
  IUserFavorite,
  Language,
  User,
} from "types/interface";
import isInBrowser from "lib/isInBrowser";
import styles from "scss/pages/advanced-search.module.scss";
import moment from "moment";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { getPath } from "routes";
import { cls } from "lib/classname";
import { ThemeResults } from "components/Pages/advanced-search/SearchResults/ThemeResults";
import { CityResults } from "components/Pages/advanced-search/SearchResults/CityResults";
import { DefaultResults } from "components/Pages/advanced-search/SearchResults/DefaultResults";
import { OrderThemeResults } from "components/Pages/advanced-search/SearchResults/OrderThemeResults";
import { LoadingResults } from "components/Pages/advanced-search/SearchResults/LoadingResults";

interface SearchToggleProps {
  isRtl: boolean;
  visible: boolean;
}
const SearchToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding: 10px;
  border-radius: 12px;
  border: 0.5px solid;
  margin-right: ${(props: SearchToggleProps) => (props.isRtl ? "10px" : "")};
  color: ${(props: SearchToggleProps) =>
    props.visible ? colors.white : colors.bleuCharte};
  border-color: ${(props: SearchToggleProps) =>
    props.visible ? "transparent" : colors.bleuCharte};
  background-color: ${(props: SearchToggleProps) =>
    props.visible ? colors.bleuCharte : "transparent"};
  align-self: center;
  cursor: pointer;
  &:hover {
    filter: brightness(80%);
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #828282;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.25);
  position: absolute;
  border-radius: 12px;
  padding: 5px 16px 0px;
  margin-left: 68px;
  margin-right: 68px;
  z-index: 2;
  transform: translateY(
    ${(props: { visibleSearch: boolean }) =>
      props.visibleSearch ? "-10px" : "-84px"}
  );
  opacity: ${(props: { visibleSearch: boolean }) =>
    props.visibleSearch ? "1" : "0"};
  transition: transform 0.6s;
  height: 80px;
`;

const LanguageText = styled.span`
  color: black;
  font-size: 16px;
  margin-right: 16px;
  margin-left: 8px;
  font-weight: normal;
`;

const LanguageTextFilter = styled.span`
  color: black;
  font-size: 16px;
  margin-right: 0px;
  margin-left: 8px;
  font-weight: bold;
`;

const FilterTitle = styled.p`
  size: 18px;
  font-weight: bold;
  color: white;
  margin-right: 10px;
`;

const pageFilters = [searchTheme, searchLoc, searchAge, searchFrench];
export type SearchQuery = {
  theme?: string[];
  age?: string;
  frenchLevel?: string;
  type?: "dispositifs" | "demarches";
  langue?: string;
  loc?: {
    city: string;
    dep: string;
  };
  order: "created_at" | "nbVues" | "theme" | "";
};

interface Props {
  router: any;
  dispositifs: IDispositif[];
  languei18nCode: string;
  user: User | null;
  langues: Language[];
  isLoading: boolean;
  t: any;
  fetchUser: any;
}
interface State {
  query: SearchQuery;
  queryResults: DispositifsFilteredState;
  dropdownOpenTri: boolean;
  dropdownOpenFiltre: boolean;
  showBookmarkModal: boolean;
  searchToggleVisible: boolean;
  visible: boolean;
  geoSearch: boolean;
  wrapperRef: any;
  languageDropdown: boolean;
}
export class AdvancedSearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const initialQuery = decodeQuery(this.props.router.query);
    const queryResults = queryDispositifs(
      this.props.dispositifs,
      initialQuery.query,
      this.props.languei18nCode
    );
    if (isInBrowser()) this.updateUrl(initialQuery.query);

    this.state = {
      query: initialQuery.query,
      queryResults: queryResults,
      dropdownOpenTri: false,
      dropdownOpenFiltre: false,
      showBookmarkModal: false,
      searchToggleVisible: initialQuery.searchToggleVisible,
      visible: true,
      geoSearch: initialQuery.geoSearch,
      wrapperRef: null,
      languageDropdown: false,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(node: any) {
    this.setState({ wrapperRef: node });
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event: any) {
    if (
      this.state.wrapperRef &&
      !this.state.wrapperRef.contains(event.target) &&
      this.state.languageDropdown
    ) {
      this.setState({ languageDropdown: false });
    }
  }

  switchGeoSearch = (value: boolean) => {
    this.setState({ geoSearch: value });
  };

  componentDidMount() {
    if (isInBrowser()) {
      document.addEventListener("mousedown", this.handleClickOutside);
      window.addEventListener("scroll", this.handleScrolling);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!this.props.isLoading && prevProps.isLoading) {
      this.queryDispositifs(); // removed query
    }

    if (prevState.query !== this.state.query) {
      this.queryDispositifs();
    }
  }

  handleScrolling = () => {
    const currentScrollPos = window.pageYOffset;
    //const visible = prevScrollpos > currentScrollPos;
    const visible = currentScrollPos < 70;

    this.setState({
      visible,
    });
  };

  updateUrl = (query: SearchQuery) => {
    let newQueryParam: any = {};
    if (query.theme) newQueryParam.tag = query.theme;
    if (query.age) newQueryParam.age = query.age;
    if (query.frenchLevel) newQueryParam.niveauFrancais = query.frenchLevel;
    if (query.loc?.city) newQueryParam.city = query.loc?.city;
    if (query.loc?.dep) newQueryParam.dep = query.loc?.dep;
    if (query.type) newQueryParam.filter = query.type;
    if (query.langue) newQueryParam.langue = query.langue;
    if (query.order) newQueryParam.tri = query.order;

    const locale = this.props.router.locale;
    const oldQueryString = qs.stringify(this.props.router.query);
    const newQueryString = qs.stringify(newQueryParam);
    if (oldQueryString !== newQueryString) {
      this.props.router.push(
        {
          pathname: getPath("/recherche", this.props.router.locale),
          search: newQueryString,
        },
        undefined,
        { locale: locale, shallow: true }
      );
    }
  };

  queryDispositifs = () => {
    this.updateUrl(this.state.query);
    const queryResults = queryDispositifs(
      this.props.dispositifs,
      this.state.query,
      this.props.languei18nCode
    );
    this.setState({ queryResults });
  };

  writeNew = () => {
    if (this.props.user) {
      this.props.router.push(
        getPath("/comment-contribuer", this.props.router.locale)
      );
    } else {
      this.props.router.push(getPath("/login", this.props.router.locale));
    }
  };

  pin = (e: any, dispositif: IDispositif | IUserFavorite) => {
    e.preventDefault();
    e.stopPropagation();
    if (API.isAuth() && this.props.user) {
      const dispositifsPinned =
        this.props.user?.cookies?.dispositifsPinned || [];
      const isDispositifPinned = !!dispositifsPinned.find(
        (pinnedDispostif) => pinnedDispostif._id === dispositif._id.toString()
      );
      this.setState(
        {
          showBookmarkModal:
            !isDispositifPinned && !this.state.showBookmarkModal,
        },
        () => {
          const newUserCookies = {
            _id: this.props.user?._id,
            cookies: { ...(this.props.user?.cookies || {}) },
          };
          newUserCookies.cookies.dispositifsPinned = [
            ...(newUserCookies?.cookies?.dispositifsPinned || []),
            { _id: dispositif._id.toString(), datePin: moment() },
          ];

          API.set_user_info(newUserCookies).then(() => {
            this.props.fetchUser();
          });
        }
      );
    } else {
      this.setState(() => ({ showBookmarkModal: true }));
    }
  };

  sortDispositifs = (dispositifs: IDispositif[], order: string) => {
    return dispositifs.sort((a, b) => {
      var aValue = 0;
      var bValue = 0;
      if (order === "created_at") {
        aValue = get(a, "publishedAt", get(a, "created_at"));
        bValue = get(b, "publishedAt", get(b, "created_at"));
      } else {
        aValue = get(a, order);
        bValue = get(b, order);
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });
  };

  goToDispositif = (dispositif: IDispositif) => {
    const route =
      dispositif.typeContenu === "demarche"
        ? "/demarche/[id]"
        : "/dispositif/[id]";
    this.props.router.push(
      getPath(route, this.props.router.locale, dispositif._id.toString() || "")
    );
  };

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore activée",
      type: "error",
      timer: 1500,
    });

  // Update query
  addToQuery = (query: Partial<SearchQuery>) => {
    const newQuery = { ...this.state.query, ...query };
    if (query.theme) newQuery.order = ""; // deactivate theme tri when filtered

    this.setState({
      query: newQuery,
    });
  };
  removeFromQuery = (filter: AvailableFilters) => {
    const newQuery = { ...this.state.query };
    if (filter === "loc") {
      this.setState({
        queryResults: { ...this.state.queryResults, filterVille: "" },
      });
    }
    delete newQuery[filter];
    this.setState({ query: newQuery });
  };
  desactiverTri = (e: any) => {
    e.stopPropagation();
    this.setState({
      query: {
        ...this.state.query,
        order: "",
      },
    });
  };
  desactiverFiltre = (e: any) => {
    e.stopPropagation();
    this.setState({
      query: {
        ...this.state.query,
        type: undefined,
        langue: undefined,
      },
      languageDropdown: false,
    });
  };
  selectLanguage = (language: Language) => {
    this.setState({
      query: {
        ...this.state.query,
        langue: language.i18nCode,
        type: undefined,
      },
      languageDropdown: false,
    });
  };
  restart = () => {
    this.setState({
      query: {
        order: "theme",
      },
      queryResults: { ...this.state.queryResults, filterVille: "" },
      geoSearch: false,
    });
  };
  reorder = (tri: Tris) => {
    const value =
      tri.value === this.state.query.order
        ? "" // deactivate all sorts
        : tri.value; // or set new sort

    const newQuery: SearchQuery = {
      ...this.state.query,
      order: value,
    };
    if (tri.value === "theme") newQuery.theme = undefined; // deactivate theme when "Par theme"
    this.setState({ query: newQuery });
  };
  filterType = (filtre: Filtres) => {
    this.setState({
      query: {
        ...this.state.query,
        type: filtre.value,
        langue: undefined,
      },
      languageDropdown: false,
    });
  };

  // Toggle elements
  toggleDropdownTri = () => {
    this.setState((pS) => ({ dropdownOpenTri: !pS.dropdownOpenTri }));
  };
  toggleDropdownFiltre = () => {
    this.setState((pS) => ({ dropdownOpenFiltre: !pS.dropdownOpenFiltre }));
  };
  toggleBookmarkModal = () => {
    this.setState((prevState) => ({
      showBookmarkModal: !prevState.showBookmarkModal,
    }));
  };
  toggleSearch = () => {
    this.setState({ searchToggleVisible: !this.state.searchToggleVisible });
  };
  openLDropdown = () => {
    this.setState({ languageDropdown: true });
  };

  nbFilterSelected = () => {
    let nb = 0;
    if (this.state.query.theme) nb++;
    if (this.state.query.loc) nb++;
    if (this.state.query.age) nb++;
    if (this.state.query.frenchLevel) nb++;
    if (this.state.geoSearch) nb++;
    return nb;
  };

  render() {
    let {
      dispositifs,
      dispositifsFullFrance,
      principalThemeList,
      principalThemeListFullFrance,
      secondaryThemeList,
      secondaryThemeListFullFrance,
      countShow,
      themesObject,
      filterVille,
    } = this.state.queryResults;
    const { t, languei18nCode } = this.props;
    const isRTL = ["ar", "ps", "fa"].includes(this.props.router.locale);
    const currentLanguage = (this.props.langues || []).find(
      (x) => x.i18nCode === this.props.router.locale
    );
    const langueCode =
      this.props.langues.length > 0 && currentLanguage
        ? currentLanguage.langueCode
        : "fr";
    const filterLanguage = this.state.query.langue
      ? (this.props.langues || []).find(
          (x) => x.i18nCode === this.state.query.langue
        )
      : null;
    const selectedTag = this.state.query.theme && this.state.query.theme.length === 1
      ? tags.find((tag) => tag.name === this.state.query?.theme?.[0])
      : null;
    const pinnedList = (this.props.user?.cookies?.dispositifsPinned || []).map(
      (d) => d._id.toString()
    );
    const flagIconCode = filterLanguage?.langueCode || langueCode;

    return (
      <div className={cls(styles.container, "advanced-search")}>
        <SEO title="Recherche" />
        <MobileAdvancedSearch
          query={this.state.query}
          addToQuery={this.addToQuery}
          queryDispositifs={this.queryDispositifs}
          removeFromQuery={this.removeFromQuery}
          dispositifs={dispositifs}
          dispositifsFullFrance={dispositifsFullFrance}
          principalThemeList={principalThemeList}
          principalThemeListFullFrance={principalThemeListFullFrance}
          secondaryThemeList={secondaryThemeList}
          secondaryThemeListFullFrance={secondaryThemeListFullFrance}
          totalFicheCount={this.props.dispositifs.length}
          nbFilteredResults={countShow}
          isLoading={this.props.isLoading}
          restart={this.restart}
        />

        <div className="d-none d-md-block w-100">
          <div
            className={cls(
              styles.searchbar_wrapper,
              !this.state.visible && styles.top
            )}
          >
            <div className="search-bar">
              {pageFilters.map((filter, i: number) => (
                <SearchItem
                  key={i}
                  searchItem={filter}
                  query={this.state.query}
                  addToQuery={this.addToQuery}
                  removeFromQuery={() => this.removeFromQuery(filter.type)}
                  switchGeoSearch={this.switchGeoSearch}
                  geoSearch={this.state.geoSearch}
                />
              ))}
              <SearchToggle
                onClick={() => this.toggleSearch()}
                visible={this.state.searchToggleVisible}
                isRtl={isRTL}
              >
                <div>
                  {this.nbFilterSelected() < 2 &&
                    t("AdvancedSearch.Plus de filtres", "Plus de filtres")}{" "}
                  <EVAIcon
                    name={
                      this.state.searchToggleVisible
                        ? "arrow-ios-upward-outline"
                        : "arrow-ios-downward-outline"
                    }
                    fill={
                      this.state.searchToggleVisible
                        ? colors.white
                        : colors.bleuCharte
                    }
                  />
                </div>
              </SearchToggle>
            </div>
            <FilterBar visibleSearch={this.state.searchToggleVisible}>
              <FilterTitle>
                {t("AdvancedSearch.Filtrer par n", "Filtrer par")}
              </FilterTitle>
              {filtres_contenu.map((filtre: Filtres, idx: number) => {
                return (
                  <FSearchBtn
                    active={filtre.value === this.state.query.type}
                    iconCallback={this.desactiverFiltre}
                    key={idx}
                    onClick={() => this.filterType(filtre)}
                    filter
                  >
                    {filtre.name &&
                      t("AdvancedSearch." + filtre.name, filtre.name)}
                  </FSearchBtn>
                );
              })}
              {languei18nCode === "fr" ? (
                <>
                  <FSearchBtn
                    active={!!this.state.query.langue}
                    iconCallback={this.desactiverFiltre}
                    id={"Tooltip-1"}
                    onClick={() => this.openLDropdown()}
                    filter
                  >
                    {!this.state.query.langue ? (
                      t("AdvancedSearch.Traduction")
                    ) : (
                      <>
                        <i
                          className={
                            "flag-icon ml-8 flag-icon-" +
                            filterLanguage?.langueCode
                          }
                          title={this.state.query.langue}
                          id={this.state.query.langue}
                        />
                        <LanguageTextFilter>
                          {filterLanguage?.langueFr || "Langue"}
                        </LanguageTextFilter>
                      </>
                    )}
                  </FSearchBtn>
                  <Tooltip
                    placement={"bottom"}
                    isOpen={this.state.languageDropdown}
                    target={"Tooltip-1"}
                    className={"mt-15"}
                    style={{
                      backgroundColor: "white",
                      boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.25)",
                      maxWidth: 2000,
                      flexDirection: "row",
                      display: "flex",
                      padding: "8px 0px 8px 8px",
                    }}

                    //popperClassName={"popper"}
                  >
                    <div
                      style={{ display: "flex", flexDirection: "row" }}
                      ref={this.setWrapperRef}
                    >
                      {this.props.langues.map((langue, idx) => {
                        if (
                          langue.avancement > 0 &&
                          langue.langueCode !== "fr"
                        ) {
                          return (
                            <div
                              key={idx}
                              className={styles.language_btn}
                              onClick={() => this.selectLanguage(langue)}
                            >
                              <i
                                className={
                                  "flag-icon ml-8 flag-icon-" +
                                  langue.langueCode
                                }
                                title={langue.langueCode}
                                id={langue.langueCode}
                              />
                              <LanguageText>
                                {langue.langueFr || "Langue"}
                              </LanguageText>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Tooltip>{" "}
                </>
              ) : null}
              <FilterTitle>
                {t("AdvancedSearch.Trier par n", "Trier par")}
              </FilterTitle>
              {tris.map((tri: Tris, idx: number) => (
                <FSearchBtn
                  active={tri.value === this.state.query.order}
                  iconCallback={this.desactiverTri}
                  key={idx}
                  filter
                  onClick={() => this.reorder(tri)}
                >
                  {t("AdvancedSearch." + tri.name, tri.name)}
                </FSearchBtn>
              ))}
              <FilterTitle>
                {" "}
                {(this.props.isLoading ? ". " : countShow) +
                  "/" +
                  (this.props.isLoading ? "." : this.props.dispositifs.length) +
                  " " +
                  t("AdvancedSearch.résultats", "résultats")}
              </FilterTitle>
              <FButton
                className={isRTL ? "ml-10" : ""}
                type="white-yellow-hover"
                name="file-add-outline"
                onClick={this.writeNew}
                filter
              >
                {t("AdvancedSearch.Rédiger", "Rédiger")}
              </FButton>
            </FilterBar>
          </div>
          {!this.props.isLoading ? (
            <div
              className={cls(
                styles.search_wrapper,
                this.state.searchToggleVisible
                  ? styles.mt_250
                  : styles.mt_250_hidden
              )}
              style={{
                backgroundColor:
                  this.state.query.order === "theme"
                    ? themesObject[0]?.tag?.lightColor || "#f1e8f5"
                    : selectedTag
                    ? selectedTag?.lightColor
                    : "#e4e5e6",
              }}
            >
              {this.state.query.order === "theme" ? (
                <OrderThemeResults
                  queryResults={this.state.queryResults}
                  pin={this.pin}
                  pinnedList={pinnedList}
                  addToQuery={this.addToQuery}
                />
              ) : selectedTag ? (
                <ThemeResults
                  langueCode={langueCode}
                  flagIconCode={flagIconCode}
                  selectedTag={selectedTag || null}
                  filterLanguage={filterLanguage || null}
                  currentLanguage={currentLanguage || null}
                  queryResults={this.state.queryResults}
                  embed={false}
                  pin={this.pin}
                  pinnedList={pinnedList}
                  restart={this.restart}
                  writeNew={this.writeNew}
                />
              ) : filterVille ? (
                <CityResults
                  queryResults={this.state.queryResults}
                  embed={false}
                  pin={this.pin}
                  pinnedList={pinnedList}
                  restart={this.restart}
                  writeNew={this.writeNew}
                />
              ) : (
                <DefaultResults
                  langueCode={langueCode}
                  filterLanguage={filterLanguage || null}
                  currentLanguage={currentLanguage || null}
                  queryResults={this.state.queryResults}
                  embed={false}
                  isLoading={false}
                  pin={this.pin}
                  pinnedList={pinnedList}
                  restart={this.restart}
                  writeNew={this.writeNew}
                />
              )}
            </div>
          ) : (
            <div
              className={cls(
                styles.search_wrapper,
                this.state.searchToggleVisible
                  ? styles.mt_250
                  : styles.mt_250_hidden
              )}
            >
              <LoadingResults />
            </div>
          )}
          <BookmarkedModal
            success={this.props.user ? true : false}
            show={this.state.showBookmarkModal}
            toggle={this.toggleBookmarkModal}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    dispositifs: state.activeDispositifs,
    languei18nCode: state.langue.languei18nCode,
    user: state.user.user,
    langues: state.langue.langues,
    isLoading: isLoadingSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS)(
      state
    ),
  };
};

const mapDispatchToProps = {
  fetchUser: fetchUserActionCreator,
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      if (locale) {
        store.dispatch(toggleLangueActionCreator(locale)); // will fetch dispositifs automatically
      } else {
        store.dispatch(fetchActiveDispositifsActionsCreator());
      }
      store.dispatch(END);
      await store.sagaTask?.toPromise();

      return {
        props: {
          ...(await serverSideTranslations(getLanguageFromLocale(locale), [
            "common",
          ])),
        },
      };
    }
);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(AdvancedSearch))
);
