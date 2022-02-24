import React, { Component } from "react";
import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Tooltip } from "reactstrap";
import Swal from "sweetalert2";
import qs from "query-string";
import _ from "lodash";
import { connect } from "react-redux";
import styled from "styled-components";
import withSizes from "react-sizes";
import Streamline from "assets/streamline";
import { isMobile } from "react-device-detect";
import { END } from "redux-saga";
import SearchItem from "containers/AdvancedSearch/SearchItem/SearchItem";
import SearchResultCard from "components/Pages/advanced-search/SearchResultCard";
import SeeMoreCard from "components/Pages/advanced-search/SeeMoreCard";
import LoadingCard from "components/Pages/advanced-search/LoadingCard";
import NoResultPlaceholder from "components/Pages/advanced-search/NoResultPlaceholder";
import { MobileAdvancedSearch } from "containers/AdvancedSearch/MobileAdvancedSearch/MobileAdvancedSearch";
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
  AvailableFilters
} from "data/searchFilters";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { tags } from "data/tags";
import FButton from "components/FigmaUI/FButton/FButton";
import FSearchBtn from "components/FigmaUI/FSearchBtn/FSearchBtn";
import { BookmarkedModal } from "components/Modals/index";
import { fetchUserActionCreator } from "services/User/user.actions";
import { filterContents } from "containers/AdvancedSearch/filterContents";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { colors } from "colors";
import SEO from "components/Seo";
import { wrapper } from "services/configureStore";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { RootState } from "services/rootReducer";
import { IDispositif, IUserFavorite, Language, Tag, User } from "types/interface";
import { t } from "i18next";
import isInBrowser from "lib/isInBrowser";
import styles from "scss/pages/advanced-search.module.scss";
import moment from "moment";

const ThemeContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.color};
  padding: 24px 68px 48px 68px;
  align-items: center;
`;

const ThemeHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 48px 0px 48px 0px;
`;

const ThemeHeaderTitle = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: ${(props) => props.color};
`;

const ThemeListContainer = styled.div`
  display: grid;
  justify-content: start;
  align-content: start;
  grid-template-columns: ${(props) =>
    `repeat(${props.columns || 5}, minmax(260px, 300px))`};
  background-color: ${(props) => props.color};
`;

const SearchToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding: 10px;
  border-radius: 12px;
  border: 0.5px solid;
  margin-right: ${(props) => (props.isRtl ? "10px" : "")};
  color: ${(props) => (props.visible ? colors.blancSimple : colors.bleuCharte)};
  border-color: ${(props) =>
    props.visible ? "transparent" : colors.bleuCharte};
  background-color: ${(props) =>
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
  transform: translateY(${(props) => props.visibleSearch ? "-10px" : "-84px"});
  opacity: ${(props) => (props.visibleSearch ? "1" : "0")};
  transition: transform 0.6s;
  height: 80px;
`;

const ThemeButton = styled.div`
  background-color: ${(props) => props.color};
  display: flex;
  flex-direction: row;
  padding: 12px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  margin-left: ${(props) => (props.ml ? `${props.ml}px` : "0px")};
`;
const ThemeText = styled.p`
  color: white;
  font-size: 18px;
  margin-left: 8px;
  margin-right: ${(props) => (props.mr ? `${props.mr}px` : "0px")};
  font-weight: bold;
`;

const ThemeTextAlone = styled.p`
  color: white;
  font-size: 18px;
  margin-left: 0px;
  margin-right: ${(props) => (props.mr ? `${props.mr}px` : "0px")};
  font-weight: bold;
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

const ShowFullFrancePrimary = styled.div`
  padding: 8px;
  height: 52px;
  align-items: center;
  justify-content: center;
  align-self: center;
  display: flex;
  margin-top: 48px;
  margin-bottom: 48px;

  background: ${(props) => (props.active ? "white" : "transparent")};

  border: 2px solid #5e5e5e;
  box-sizing: border-box;
  border-radius: 12px;
  font-size: 16px;
  text-align: center;
  align-content: center;
  cursor: pointer;
  &:hover {
    background-color: white;
  }
`;

const ShowFullFranceSecondary = styled.div`
  padding: 8px;
  height: 52px;
  font-size: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  align-content: center;
  align-self: center;
  margin-top: 48px;
  margin-bottom: 48px;

  background: ${(props) => (props.active ? "white" : "transparent")};

  border: 2px solid #5e5e5e;
  box-sizing: border-box;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background-color: white;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const pageFilters = [
  searchTheme,
  searchLoc,
  searchAge,
  searchFrench
]
export type SearchQuery = {
  theme?: string
  age?: string
  frenchLevel?: string
  type?: "dispositifs" | "demarches"
  langue?: string
  loc?: {
    city: string
    dep: string
  }
  order: "created_at" | "nbVues" | "theme" | ""
}

interface Props {
  router: any
  dispositifs: IDispositif[]
  languei18nCode: string
  user: User|null
  langues: Language[]
  isLoading: boolean
  t: any
  fetchUser: any
  isMobile: boolean
  isTablet: boolean
  isSmallDesktop: boolean
  isDesktop: boolean
  isBigDesktop: boolean
}
interface State {
  query: SearchQuery
  dispositifs: IDispositif[]
  principalThemeList: IDispositif[]
  secondaryThemeList: IDispositif[]
  principalThemeListFullFrance: IDispositif[]
  secondaryThemeListFullFrance: IDispositif[]
  nonTranslated: IDispositif[]
  dispositifsFullFrance: IDispositif[]
  dropdownOpenTri: boolean
  dropdownOpenFiltre: boolean
  showBookmarkModal: boolean
  searchToggleVisible: boolean
  visible: boolean
  countTotal: number
  countShow: number
  themesObject: {
    tag: Tag
    dispositifs: IDispositif[]
  }[]
  chargingArray: boolean[]
  showGeolocFullFrancePrincipal: boolean
  showGeolocFullFranceSecondary: boolean
  filterVille: string
  geoSearch: boolean
  wrapperRef: any
  languageDropdown: boolean
}
export class AdvancedSearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      query: {
        order: "theme"
      },
      dispositifs: [],
      dropdownOpenTri: false,
      dropdownOpenFiltre: false,
      showBookmarkModal: false,
      searchToggleVisible: false,
      visible: true,
      countTotal: 0,
      countShow: 0,
      themesObject: [],
      principalThemeList: [],
      secondaryThemeList: [],
      principalThemeListFullFrance: [],
      secondaryThemeListFullFrance: [],
      nonTranslated: [],
      chargingArray: new Array(20).fill(true),
      showGeolocFullFrancePrincipal: false,
      showGeolocFullFranceSecondary: false,
      filterVille: "",
      dispositifsFullFrance: [],
      geoSearch: false,
      wrapperRef: null,
      languageDropdown: false
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(node:any) {
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

    const {
      tag, dep, city, age, niveauFrancais, filter, langue, tri
    } = this.props.router.query;

    if (filter || langue || tri) this.setState({ searchToggleVisible: true });

    // Reinject filters value in search
    if (tag || age || niveauFrancais || dep || city || filter || langue || tri) {
      const query: SearchQuery = {
        order: tri
      };

      if (tag) query.theme = decodeURIComponent(tag);
      if (age) query.age = decodeURIComponent(age);
      if (dep && city) {
        query.loc = {
          city: decodeURIComponent(city),
          dep: decodeURIComponent(dep)
        }
        this.switchGeoSearch(true);
      }
      if (niveauFrancais) query.frenchLevel = decodeURIComponent(niveauFrancais);
      if (filter) query.type = decodeURIComponent(filter) as ("dispositifs" | "demarches" | undefined);
      if (langue) query.langue = langue
      this.setState({ query: query });
    } else {
      this.queryDispositifs();
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

  updateUrl = () => {
    const query = this.state.query;
    let newQueryParam: any = {};
    if(query.theme) newQueryParam.tag = query.theme;
    if(query.age) newQueryParam.age = query.age;
    if(query.frenchLevel) newQueryParam.niveauFrancais = query.frenchLevel;
    if(query.loc?.city) newQueryParam.city = query.loc?.city;
    if(query.loc?.dep) newQueryParam.dep = query.loc?.dep;
    if(query.type) newQueryParam.filter = query.type;
    if(query.langue) newQueryParam.langue = query.langue;
    if(query.order) newQueryParam.tri = query.order;

    this.props.router.push({
      search: qs.stringify(newQueryParam),
    }, undefined, { shallow: true });
  }

  queryDispositifs = () => {
    this.updateUrl();
    const filteredDispositifs = filterContents(
      this.props.dispositifs,
      this.state.query
    );
    const sortedDispositifs = this.sortDispositifs(
      filteredDispositifs,
      this.state.query.order
    );

    let dispositifs = sortedDispositifs;
    this.setState({ countTotal: dispositifs.length });

    if (this.state.query.theme) {
      //On réarrange les résultats pour avoir les dispositifs dont le tag est le principal en premier, sinon trié par date de création
      dispositifs = dispositifs.sort((a, b) =>
        _.get(a, "tags.0.name", {}) === this.state.query.theme
          ? -1
          : _.get(b, "tags.0.name", {}) === this.state.query.theme
          ? 1
          : 0
      );
    } else {
      //@ts-ignore
      dispositifs = dispositifs.sort((a, b) => a.created_at - b.created_at);
    }

    if (this.props.languei18nCode !== "fr" || this.state.query.langue) {
      var nonTranslated = dispositifs.filter((dispo) => {
        const lnCode = this.props.languei18nCode !== "fr"
          ? this.props.languei18nCode : this.state.query.langue;
        if (!lnCode) return false
        if (dispo.avancement?.[lnCode]) return false;
        return true;
      });
      this.setState({ nonTranslated });

      dispositifs = dispositifs.filter((dispo) => {
        const lnCode = this.props.languei18nCode !== "fr"
          ? this.props.languei18nCode : this.state.query.langue;
          if (!lnCode) return false
          if (dispo.avancement?.[lnCode]) return true;
          return false;
      });
    }
    let dispositifsFullFrance: IDispositif[] = [];
    if (this.state.query.loc?.dep) {
      var index;
      var i;
      var dispositifsFrance = [];
      var dispositifsVille = [];
      var dispositifsEmpty = [];
      this.setState({ filterVille: this.state.query.loc?.city || "" });
      for (index = 0; index < dispositifs.length; index++) {
        if (dispositifs[index]?.contenu?.[1]?.children) {
          var geolocInfocard = (dispositifs[index].contenu[1].children || []).find(
            (infocard) => infocard.title === "Zone d'action"
          );
          if (geolocInfocard && geolocInfocard.departments) {
            for (i = 0; i < geolocInfocard.departments.length; i++) {
              if (
                geolocInfocard.departments[i] === "All" &&
                dispositifs[index].typeContenu === "dispositif"
              ) {
                dispositifsFrance.push(dispositifs[index]);
              } else if (
                geolocInfocard.departments[i].split(" - ")[1] ===
                  this.state.query.loc?.dep ||
                geolocInfocard.departments[i].split(" - ")[1] ===
                  this.state.query.loc?.city ||
                dispositifs[index].typeContenu === "demarche"
              ) {
                dispositifsVille.push(dispositifs[index]);
              }
            }
          } else if (dispositifs[index].typeContenu === "dispositif") {
            dispositifsEmpty.push(dispositifs[index]);
          } else if (dispositifs[index].typeContenu === "demarche") {
            dispositifsVille.push(dispositifs[index]);
          }
        } else if (dispositifs[index].typeContenu === "dispositif") {
          dispositifsEmpty.push(dispositifs[index]);
        } else if (dispositifs[index].typeContenu === "demarche") {
          dispositifsVille.push(dispositifs[index]);
        }
      }
      dispositifsFullFrance = dispositifsFrance.concat(dispositifsEmpty);

      dispositifs = dispositifsVille;
      this.setState({ dispositifsFullFrance });
    }
    dispositifs = dispositifs.map((x) => ({
      ...x,
      nbVues: x.nbVues || 0,
    }));

    if (this.state.query.order === "theme") {
      const themesObject = tags.map((tag) => {
        return {
          tag: tag,
          dispositifs: dispositifs.filter((elem) => (
            elem.tags[0] ? elem.tags[0].short === tag.short : ""
          )),
        };
      }).filter(themeObject => themeObject.dispositifs.length > 0);

      this.setState({ themesObject: themesObject });
    }
    if (this.state.query.theme) {
      var principalThemeList = dispositifs.filter((elem) => (
        elem?.tags[0] ? elem.tags[0].name === this.state.query.theme : ""
      ));
      const principalThemeListSorted = this.sortDispositifs(
        principalThemeList,
        this.state.query.order
      );

      var secondaryThemeList = dispositifs.filter((element) => {
        if (element.tags && element.tags.length > 0) {
          for (var index = 1; index < element.tags.length; index++) {
            if (
              index !== 0 &&
              element.tags[index] &&
              element.tags[index].name === this.state.query.theme
            )
              return true;
          }
        }
        return false;
      });
      const secondaryThemeListSorted = this.sortDispositifs(
        secondaryThemeList,
        this.state.query.order
      );

      this.setState({
        principalThemeList: principalThemeListSorted,
        secondaryThemeList: secondaryThemeListSorted,
      });
      if (this.state.query.loc?.city) {
        var principalThemeListFullFrance = dispositifsFullFrance.filter(
          (elem) => (elem?.tags[0] ? elem.tags[0].name === this.state.query.theme : "")
        );
        const principalThemeListFullFranceSorted = this.sortDispositifs(
          principalThemeListFullFrance,
          this.state.query.order
        );
        var secondaryThemeListFullFrance = dispositifsFullFrance.filter(
          (element) => {
            if (element.tags && element.tags.length > 0) {
              for (var index = 1; index < element.tags.length; index++) {
                if (
                  index !== 0 &&
                  element.tags[index] &&
                  element.tags[index].name === this.state.query.theme
                )
                  return true;
              }
            }
            return false;
          }
        );
        const secondaryThemeListFullFranceSorted = this.sortDispositifs(
          secondaryThemeListFullFrance,
          this.state.query.order
        );

        this.setState({
          principalThemeListFullFrance: principalThemeListFullFranceSorted,
          secondaryThemeListFullFrance: secondaryThemeListFullFranceSorted,
        });
      }
    }
    this.setState({
      dispositifs,
      countShow: dispositifs.length,
    });
  };

  writeNew = () => {
    if (this.props.user) {
      this.props.router.push({
        pathname: "/comment-contribuer",
      });
    } else {
      this.props.router.push({
        pathname: "/login",
      });
    }
  };

  pin = (e: any, dispositif: IDispositif | IUserFavorite) => {
    e.preventDefault();
    e.stopPropagation();
    if (API.isAuth() && this.props.user) {
      const dispositifsPinned = this.props.user?.cookies?.dispositifsPinned || [];
      const isDispositifPinned = !!dispositifsPinned.find(
        (pinnedDispostif) => pinnedDispostif._id === dispositif._id.toString()
      );
      this.setState(
        {
          showBookmarkModal: !isDispositifPinned && !this.state.showBookmarkModal,
        },
        () => {
          const newUserCookies = {
            _id: this.props.user?._id || "",
            cookies: { ...(this.props.user?.cookies || {}) }
          };
          newUserCookies.cookies.dispositifsPinned = [
            ...(newUserCookies?.cookies?.dispositifsPinned || []),
            { _id: dispositif._id.toString(), datePin: moment() }
          ]

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
        aValue = _.get(a, "publishedAt", _.get(a, "created_at"));
        bValue = _.get(b, "publishedAt", _.get(b, "created_at"));
      } else {
        aValue = _.get(a, order);
        bValue = _.get(b, order);
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });
  };

  goToDispositif = (dispositif: IDispositif) => {
    this.props.router.push(
      "/" +
        (dispositif.typeContenu || "dispositif") +
        (dispositif._id ? "/" + dispositif._id : "")
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
      query: newQuery
    });
  };
  removeFromQuery = (filter: AvailableFilters) => {
    const newQuery = { ...this.state.query };
    if (filter === "loc") this.setState({ filterVille: "" });
    delete newQuery[filter];
    this.setState({ query: newQuery });
  };
  desactiverTri = (e: any) => {
    e.stopPropagation();
    this.setState({
      query: {
        ...this.state.query,
        order: ""
      },
    });
  };
  desactiverFiltre = (e: any) => {
    e.stopPropagation();
    this.setState({
      query: {
        ...this.state.query,
        type: undefined,
        langue: undefined
      },
      languageDropdown: false,
    });
  };
  selectLanguage = (language: Language) => {
    this.setState(
      {
        query: {
          ...this.state.query,
          langue: language.i18nCode,
          type: undefined
        },
        languageDropdown: false
      });
  };
  restart = () => {
    this.setState({
        query: {
          order: "theme"
        },
        filterVille: "",
        geoSearch: false,
      });
  };
  reorder = (tri: Tris) => {
    const value = tri.value === this.state.query.order
      ? "" // deactivate all sorts
      : tri.value; // or set new sort

    const newQuery: SearchQuery = {
      ...this.state.query,
      order: value
    }
    if (tri.value === "theme") newQuery.theme = undefined; // deactivate theme when "Par theme"
    this.setState({ query: newQuery });
  };
  filterType = (filtre: Filtres) => {
    this.setState(
      {
        query: {
          ...this.state.query,
          type: filtre.value,
          langue: undefined
        },
        languageDropdown: false,
      });
  };

  // Toggle elements
  toggleDropdownTri = () => {
    this.setState((pS) => ({ dropdownOpenTri: !pS.dropdownOpenTri }));
  }
  toggleDropdownFiltre = () => {
    this.setState((pS) => ({ dropdownOpenFiltre: !pS.dropdownOpenFiltre }));
  }
  toggleBookmarkModal = () => {
    this.setState((prevState) => ({
      showBookmarkModal: !prevState.showBookmarkModal,
    }));
  }
  toggleSearch = () => {
    this.setState({ searchToggleVisible: !this.state.searchToggleVisible });
  };
  openLDropdown = () => {
    this.setState({ languageDropdown: true });
  };


  nbFilterSelected = () => {
    let nb = 0;
    if (this.state.query.theme) nb++
    if (this.state.query.loc) nb++
    if (this.state.query.age) nb++
    if (this.state.query.frenchLevel) nb++
    if (this.state.geoSearch) nb++;
    return nb;
  };

  render() {
    let { dispositifs } = this.state;
    const {
      t,
      isDesktop,
      isSmallDesktop,
      isTablet,
      isBigDesktop,
      languei18nCode,
    } = this.props;
    const isRTL = ["ar", "ps", "fa"].includes(this.props.router.locale);
    const currentLanguage =(this.props.langues || []).find(
      (x) => x.i18nCode === this.props.router.locale
    );
    const langueCode = this.props.langues.length > 0 && currentLanguage
      ? currentLanguage.langueCode
      : "fr";
    const filterLanguage = this.state.query.langue ? (this.props.langues || []).find(
      (x) => x.i18nCode === this.state.query.langue
    ) : null;
    const selectedTag = this.state.query.theme ? tags.find(
      tag => tag.name === this.state.query.theme
    ) : null;
    const pinnedList = (this.props.user?.cookies?.dispositifsPinned || []).map(d => d._id.toString());

    return (
      <div className={"animated fadeIn advanced-search" + (isMobile ?" advanced-search--mobile" : "")}>
        <SEO title="Recherche" />
        {isMobile ? (
          <MobileAdvancedSearch
            query={this.state.query}
            addToQuery={this.addToQuery}
            queryDispositifs={this.queryDispositifs}
            removeFromQuery={this.removeFromQuery}
            dispositifs={this.state.dispositifs}
            dispositifsFullFrance={this.state.dispositifsFullFrance}
            principalThemeList={this.state.principalThemeList}
            principalThemeListFullFrance={
              this.state.principalThemeListFullFrance
            }
            secondaryThemeList={this.state.secondaryThemeList}
            secondaryThemeListFullFrance={
              this.state.secondaryThemeListFullFrance
            }
            totalFicheCount={this.props.dispositifs.length}
            nbFilteredResults={this.state.countShow}
            isLoading={this.props.isLoading}
          />
        ) : (
          <>
            <div className={styles.searchbar_wrapper + " " + (!this.state.visible ? styles.top : "")}>
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
                      t(
                        "AdvancedSearch.Plus de filtres",
                        "Plus de filtres"
                      )}{" "}
                    <EVAIcon
                      name={this.state.searchToggleVisible ? "arrow-ios-upward-outline" : "arrow-ios-downward-outline"}
                      fill={this.state.searchToggleVisible ? colors.blancSimple : colors.bleuCharte}
                    />
                  </div>
                </SearchToggle>
              </div>
              <FilterBar
                visibleSearch={this.state.searchToggleVisible}
              >
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
                          if (langue.avancement > 0 && langue.langueCode !== "fr") {
                            return (
                              <div
                                key={idx}
                                className={"language-filter-button"}
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
                          return null
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
                  {(this.props.isLoading ? ". " : this.state.countShow) +
                    "/" +
                    (this.props.isLoading
                      ? "."
                      : this.props.dispositifs.length) +
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
                className={
                  "search-wrapper " +
                  (this.state.searchToggleVisible ? "mt-250" : "mt-250-hidden")
                }
                style={{
                  backgroundColor:
                    this.state.query.order === "theme"
                      ? this.state.themesObject[0]?.tag?.lightColor || "#f1e8f5"
                      : this.state.query.theme
                      ? selectedTag?.lightColor
                      : "#e4e5e6",
                }}
              >
                {this.state.query.order === "theme" ? (
                  <div style={{ width: "100%" }}>
                    {this.state.themesObject.map((theme, index: number) => {
                      return (
                        <ThemeContainer
                          key={index}
                          color={theme.tag.lightColor}
                        >
                          <ThemeHeader>
                            <ThemeButton
                              ml={isRTL ? 20 : 0}
                              color={theme.tag.darkColor}
                            >
                              <Streamline
                                name={theme.tag.icon}
                                stroke={"white"}
                                width={22}
                                height={22}
                              />
                              <ThemeText mr={isRTL ? 8 : 0}>
                                {t(
                                  "Tags." + theme.tag.short,
                                  theme.tag.short
                                )}
                              </ThemeText>
                            </ThemeButton>
                            <ThemeHeaderTitle color={theme.tag.darkColor}>
                              {t(
                                "Tags." + theme.tag.name,
                                theme.tag.name
                              )[0].toUpperCase() +
                                t(
                                  "Tags." + theme.tag.name,
                                  theme.tag.name
                                ).slice(1)}
                            </ThemeHeaderTitle>
                          </ThemeHeader>
                          <ThemeListContainer
                            columns={
                              isDesktop || isBigDesktop
                                ? 5
                                : isSmallDesktop
                                ? 4
                                : isTablet
                                ? 3
                                : 2
                            }
                          >
                            {theme.dispositifs.slice(0, 4)
                              .map((dispositif, index) => {
                                return (
                                  <SearchResultCard
                                    key={index}
                                    pin={this.pin}
                                    pinnedList={pinnedList}
                                    dispositif={dispositif}
                                    showPinned={true}
                                  />
                                );
                              })
                            }
                            <SeeMoreCard
                              seeMore={() => this.addToQuery({theme: theme.tag.name})}
                              theme={theme.tag}
                              isRTL={isRTL}
                            />
                          </ThemeListContainer>
                        </ThemeContainer>
                      );
                    })}
                  </div>
                ) : this.state.query.theme ? (
                  <ThemeContainer>
                    <ThemeHeader>
                      <ThemeHeaderTitle color={"#828282"}>
                        {langueCode !== "fr" || filterLanguage !== null ? (
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
                            {" " + t("AdvancedSearch.avec le thème")}
                          </>
                        ) : (
                          t(
                            "AdvancedSearch.fiches avec le thème"
                          )[0].toUpperCase() +
                          t("AdvancedSearch.fiches avec le thème").slice(1)
                        )}
                      </ThemeHeaderTitle>
                      <ThemeButton
                        ml={8}
                        color={selectedTag ? selectedTag.darkColor : null}
                      >
                        <Streamline
                          name={selectedTag ? selectedTag.icon : undefined}
                          stroke={"white"}
                          width={22}
                          height={22}
                        />
                        <ThemeText mr={isRTL ? 8 : 0}>
                          {selectedTag
                            ? t("Tags." + selectedTag.short, selectedTag.short)
                            : null}
                        </ThemeText>
                      </ThemeButton>
                      {this.state.filterVille ? (
                        <ThemeHeaderTitle color={"#828282"}>
                          {" disponibles à "}
                        </ThemeHeaderTitle>
                      ) : null}
                      {this.state.filterVille ? (
                        <ThemeButton ml={8} color={"#0421b1"}>
                          <ThemeTextAlone mr={0}>
                            {this.state.filterVille}
                          </ThemeTextAlone>
                        </ThemeButton>
                      ) : null}
                    </ThemeHeader>
                    <ThemeListContainer
                      columns={
                        isDesktop || isBigDesktop
                          ? 5
                          : isSmallDesktop
                          ? 4
                          : isTablet
                          ? 3
                          : 2
                      }
                    >
                      {this.state.principalThemeList.length > 0 ? (
                        this.state.principalThemeList.map(
                          (dispositif, index: number) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={pinnedList}
                                  dispositif={dispositif}
                                  showPinned={true}
                                />
                              </div>
                            );
                          }
                        )
                      ) : (
                        <NoResultPlaceholder
                          restart={this.restart}
                          writeNew={this.writeNew}
                        />
                      )}
                    </ThemeListContainer>
                    <ButtonContainer>
                      {this.state.filterVille &&
                      !this.state.showGeolocFullFrancePrincipal ? (
                        <ShowFullFrancePrimary
                          onClick={() =>
                            this.setState({
                              showGeolocFullFrancePrincipal: true,
                            })
                          }
                        >
                          {t(
                            "AdvancedSearch.Afficher aussi les résultats disponibles dans",
                            "Afficher aussi les résultats disponibles dans"
                          )}
                          <span style={{ marginLeft: "4px" }}>
                            <b>{t("AdvancedSearch.toute la France")}</b>
                          </span>
                        </ShowFullFrancePrimary>
                      ) : this.state.filterVille &&
                        this.state.showGeolocFullFrancePrincipal ? (
                        <ShowFullFrancePrimary
                          active
                          onClick={() =>
                            this.setState({
                              showGeolocFullFrancePrincipal: false,
                            })
                          }
                        >
                          {t(
                            "AdvancedSearch.Masquer les résultats disponibles dans"
                          )}
                          <span style={{ marginLeft: "4px" }}>
                            <b>{t("AdvancedSearch.toute la France")}</b>
                          </span>
                        </ShowFullFrancePrimary>
                      ) : null}
                    </ButtonContainer>
                    {this.state.filterVille &&
                    this.state.showGeolocFullFrancePrincipal ? (
                      <ThemeListContainer
                        columns={
                          isDesktop || isBigDesktop
                            ? 5
                            : isSmallDesktop
                            ? 4
                            : isTablet
                            ? 3
                            : 2
                        }
                      >
                        {this.state.principalThemeListFullFrance.length > 0 ? (
                          this.state.principalThemeListFullFrance.map(
                            (dispositif, index: number) => {
                              return (
                                <div key={index}>
                                  <SearchResultCard
                                    key={index}
                                    pin={this.pin}
                                    pinnedList={pinnedList}
                                    dispositif={dispositif}
                                    showPinned={true}
                                  />
                                </div>
                              );
                            }
                          )
                        ) : (
                          <NoResultPlaceholder
                            restart={this.restart}
                            writeNew={this.writeNew}
                          />
                        )}
                      </ThemeListContainer>
                    ) : null}
                    <ThemeHeader>
                      <ThemeHeaderTitle color={"#828282"}>
                        {langueCode !== "fr" || filterLanguage ? (
                          <>
                            {t("AdvancedSearch.Autres fiches traduites en") +
                              " "}
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
                            {" " + t("AdvancedSearch.avec le thème")}
                          </>
                        ) : (
                          t(
                            "AdvancedSearch.autres fiches avec le thème"
                          )[0].toUpperCase() +
                          t("AdvancedSearch.autres fiches avec le thème").slice(
                            1
                          )
                        )}
                      </ThemeHeaderTitle>
                      <ThemeButton
                        ml={8}
                        color={selectedTag ? selectedTag.darkColor : null}
                      >
                        <Streamline
                          name={selectedTag ? selectedTag.icon : undefined}
                          stroke={"white"}
                          width={22}
                          height={22}
                        />
                        <ThemeText mr={isRTL ? 8 : 0}>
                          {selectedTag
                            ? t("Tags." + selectedTag.short, selectedTag.short)
                            : null}
                        </ThemeText>
                      </ThemeButton>
                      {this.state.filterVille ? (
                        <ThemeHeaderTitle color={"#828282"}>
                          {" disponibles à "}
                        </ThemeHeaderTitle>
                      ) : null}
                      {this.state.filterVille ? (
                        <ThemeButton ml={8} color={"#0421b1"}>
                          <ThemeTextAlone mr={0}>
                            {this.state.filterVille}
                          </ThemeTextAlone>
                        </ThemeButton>
                      ) : null}
                    </ThemeHeader>
                    <ThemeListContainer
                      columns={
                        isDesktop || isBigDesktop
                          ? 5
                          : isSmallDesktop
                          ? 4
                          : isTablet
                          ? 3
                          : 2
                      }
                    >
                      {this.state.secondaryThemeList.length > 0 ? (
                        this.state.secondaryThemeList.map(
                          (dispositif, index: number) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={pinnedList}
                                  dispositif={dispositif}
                                  showPinned={true}
                                />
                              </div>
                            );
                          }
                        )
                      ) : (
                        <NoResultPlaceholder
                          restart={this.restart}
                          writeNew={this.writeNew}
                        />
                      )}
                    </ThemeListContainer>
                    <ButtonContainer>
                      {this.state.filterVille &&
                      !this.state.showGeolocFullFranceSecondary ? (
                        <ShowFullFranceSecondary
                          onClick={() =>
                            this.setState({
                              showGeolocFullFranceSecondary: true,
                            })
                          }
                        >
                          {t(
                            "AdvancedSearch.Afficher aussi les autres fiches disponibles dans",
                            "Afficher aussi les autres fiches disponibles dans"
                          )}
                          <span style={{ marginLeft: "4px" }}>
                            <b>{t("AdvancedSearch.toute la France")}</b>
                          </span>
                        </ShowFullFranceSecondary>
                      ) : this.state.filterVille &&
                        this.state.showGeolocFullFranceSecondary ? (
                        <ShowFullFranceSecondary
                          active
                          onClick={() =>
                            this.setState({
                              showGeolocFullFranceSecondary: false,
                            })
                          }
                        >
                          {t(
                            "AdvancedSearch.Masquer les autres fiches disponibles dans",
                            "Masquer les autres fiches disponibles dans"
                          )}
                          <span style={{ marginLeft: "4px" }}>
                            <b>{t("AdvancedSearch.toute la France")}</b>
                          </span>
                        </ShowFullFranceSecondary>
                      ) : null}
                    </ButtonContainer>
                    {this.state.filterVille &&
                    this.state.showGeolocFullFranceSecondary ? (
                      <ThemeListContainer
                        columns={
                          isDesktop || isBigDesktop
                            ? 5
                            : isSmallDesktop
                            ? 4
                            : isTablet
                            ? 3
                            : 2
                        }
                      >
                        {this.state.secondaryThemeListFullFrance.length > 0 ? (
                          this.state.secondaryThemeListFullFrance.map(
                            (dispositif, index: number) => {
                              return (
                                <div key={index}>
                                  <SearchResultCard
                                    key={index}
                                    pin={this.pin}
                                    pinnedList={pinnedList}
                                    dispositif={dispositif}
                                    showPinned={true}
                                  />
                                </div>
                              );
                            }
                          )
                        ) : (
                          <NoResultPlaceholder
                            restart={this.restart}
                            writeNew={this.writeNew}
                          />
                        )}
                      </ThemeListContainer>
                    ) : null}
                  </ThemeContainer>
                ) : this.state.filterVille ? (
                  <ThemeContainer>
                    <ThemeHeader>
                      <ThemeHeaderTitle color={"#828282"}>
                        {"Fiches disponibles à "}
                      </ThemeHeaderTitle>
                      <ThemeButton ml={8} color={"#0421b1"}>
                        <ThemeTextAlone mr={0}>
                          {this.state.filterVille}
                        </ThemeTextAlone>
                      </ThemeButton>
                    </ThemeHeader>
                    <ThemeListContainer
                      columns={
                        isDesktop || isBigDesktop
                          ? 5
                          : isSmallDesktop
                          ? 4
                          : isTablet
                          ? 3
                          : 2
                      }
                    >
                      {dispositifs.length > 0 ? (
                        dispositifs.map((dispositif, index: number) => {
                          return (
                            <div key={index}>
                              <SearchResultCard
                                key={index}
                                pin={this.pin}
                                pinnedList={pinnedList}
                                dispositif={dispositif}
                                showPinned={true}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <NoResultPlaceholder
                          restart={this.restart}
                          writeNew={this.writeNew}
                        />
                      )}
                    </ThemeListContainer>
                    <ThemeHeader>
                      <ThemeHeaderTitle color={"#828282"}>
                        {"Fiches disponibles partout en France"}
                      </ThemeHeaderTitle>
                    </ThemeHeader>
                    <ThemeListContainer
                      columns={
                        isDesktop || isBigDesktop
                          ? 5
                          : isSmallDesktop
                          ? 4
                          : isTablet
                          ? 3
                          : 2
                      }
                    >
                      {this.state.dispositifsFullFrance.length > 0 ? (
                        this.state.dispositifsFullFrance.map(
                          (dispositif, index: number) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={pinnedList}
                                  dispositif={dispositif}
                                  showPinned={true}
                                />
                              </div>
                            );
                          }
                        )
                      ) : (
                        <NoResultPlaceholder
                          restart={this.restart}
                          writeNew={this.writeNew}
                        />
                      )}
                    </ThemeListContainer>
                  </ThemeContainer>
                ) : (
                  <ThemeContainer>
                    {langueCode !== "fr" || filterLanguage ? (
                      <>
                        <ThemeHeader>
                          <ThemeHeaderTitle color={"#828282"}>
                            <>
                              {t("AdvancedSearch.Résultats disponibles en") +
                                " "}
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
                          </ThemeHeaderTitle>
                        </ThemeHeader>
                        <ThemeListContainer
                          columns={
                            isDesktop || isBigDesktop
                              ? 5
                              : isSmallDesktop
                              ? 4
                              : isTablet
                              ? 3
                              : 2
                          }
                        >
                          {this.state.dispositifs.length > 0 ? (
                            this.state.dispositifs.map((dispositif, index: number) => {
                              return (
                                <div key={index}>
                                  <SearchResultCard
                                    key={index}
                                    pin={this.pin}
                                    pinnedList={pinnedList}
                                    dispositif={dispositif}
                                    showPinned={true}
                                  />
                                </div>
                              );
                            })
                          ) : (
                            <NoResultPlaceholder
                              restart={this.restart}
                              writeNew={this.writeNew}
                            />
                          )}
                        </ThemeListContainer>
                        <ThemeHeader>
                          <ThemeHeaderTitle color={"#828282"}>
                            <>
                              {t(
                                "AdvancedSearch.Résultats non disponibles en"
                              ) + " "}
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
                          </ThemeHeaderTitle>
                        </ThemeHeader>
                        <ThemeListContainer
                          columns={
                            isDesktop || isBigDesktop
                              ? 5
                              : isSmallDesktop
                              ? 4
                              : isTablet
                              ? 3
                              : 2
                          }
                        >
                          {this.state.nonTranslated.length > 0 ? (
                            this.state.nonTranslated.map(
                              (dispositif, index: number) => {
                                return (
                                  <div key={index}>
                                    <SearchResultCard
                                      key={index}
                                      pin={this.pin}
                                      pinnedList={pinnedList}
                                      dispositif={dispositif}
                                      showPinned={true}
                                    />
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <NoResultPlaceholder
                              restart={this.restart}
                              writeNew={this.writeNew}
                            />
                          )}
                        </ThemeListContainer>
                      </>
                    ) : (
                      <>
                        <ThemeHeader />
                        <ThemeListContainer
                          columns={
                            isDesktop || isBigDesktop
                              ? 5
                              : isSmallDesktop
                              ? 4
                              : isTablet
                              ? 3
                              : 2
                          }
                        >
                          {dispositifs.map((dispositif, index: number) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={pinnedList}
                                  dispositif={dispositif}
                                  showPinned={true}
                                />
                              </div>
                            );
                          })}
                          {!this.props.isLoading &&
                            dispositifs.length === 0 && (
                              <NoResultPlaceholder
                                restart={this.restart}
                                writeNew={this.writeNew}
                              />
                            )}
                        </ThemeListContainer>
                      </>
                    )}
                  </ThemeContainer>
                )}
              </div>
            ) : (
              <div
                className={
                  "search-wrapper " +
                  (this.state.searchToggleVisible ? "mt-250" : "mt-250-hidden")
                }
              >
                <ThemeContainer>
                  <ThemeHeader />
                  <ThemeListContainer
                    columns={
                      isDesktop || isBigDesktop
                        ? 5
                        : isSmallDesktop
                        ? 4
                        : isTablet
                        ? 3
                        : 2
                    }
                  >
                    {this.state.chargingArray.map((_, index: number) => {
                      return <LoadingCard key={index} />;
                    })}
                  </ThemeListContainer>
                </ThemeContainer>
              </div>
            )}
            <BookmarkedModal
              success={this.props.user ? true : false}
              show={this.state.showBookmarkModal}
              toggle={this.toggleBookmarkModal}
            />
          </>
        )}
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

const mapSizesToProps = ({ width }: {width: number}) => ({
  isMobile: width < 850,
  isTablet: width >= 850 && width < 1100,
  isSmallDesktop: width >= 1100 && width < 1400,
  isDesktop: width >= 1400 && width < 1565,
  isBigDesktop: width >= 1565,
});

export const getServerSideProps = wrapper.getServerSideProps(store => async ({locale}) => {
  store.dispatch(fetchActiveDispositifsActionsCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
    //@ts-ignore
  )(withSizes(mapSizesToProps)(withTranslation()(AdvancedSearch)))
)
