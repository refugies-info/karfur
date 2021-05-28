/* eslint-disable no-console */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "reactstrap";
import Swal from "sweetalert2";
import querySearch from "stringquery";
import qs from "query-string";
import _ from "lodash";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import produce from "immer";
import withSizes from "react-sizes";
import i18n from "../../i18n";
import Streamline from "../../assets/streamline";
import SearchItem from "./SearchItem/SearchItem";
import SearchResultCard from "./SearchResultCard";
import SeeMoreCard from "./SeeMoreCard";
import LoadingCard from "./LoadingCard";
import NoResultPlaceholder from "./NoResultPlaceholder";
import { MobileAdvancedSearch } from "./MobileAdvancedSearch/MobileAdvancedSearch";
import API from "../../utils/API";
import { initial_data } from "./data";
import { activatedLanguages } from "../../components/Modals/LanguageModal/data";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import { filtres } from "../Dispositif/data";
import { filtres_contenu, tris } from "./data";
import FButton from "../../components/FigmaUI/FButton/FButton";
import TagButton from "../../components/FigmaUI/TagButton/TagButton";
import { BookmarkedModal } from "../../components/Modals/index";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import { isMobile } from "react-device-detect";
import { filterContents } from "./filterContents";
import { isLoadingSelector } from "../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../services/LoadingStatus/loadingStatus.actions";

import "./AdvancedSearch.scss";
import { colors } from "colors";

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
  font-weight: 500;
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
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  border: 0.5px solid;
  border-color: ${(props) => (props.visible ? "transparent" : "black")};
  background-color: ${(props) => (props.visible ? "#828282" : "white")};
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
  position: fixed;
  border-radius: 6px 6px 12px 12px;
  padding: 13px 16px 0px;
  margin-left: 68px;
  margin-right: 68px;
  display: flex;
  z-index: 2;
  top: ${(props) =>
    props.visibleTop && props.visibleSearch
      ? "164px"
      : !props.visibleTop && props.visibleSearch
      ? "90px"
      : props.visibleTop && !props.visibleSearch
      ? "90px"
      : "16px"};
  transition: top 0.6s;
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
  font-weight: 700;
`;

const ThemeTextAlone = styled.p`
  color: white;
  font-size: 18px;
  margin-left: 0px;
  margin-right: ${(props) => (props.mr ? `${props.mr}px` : "0px")};
  font-weight: 700;
`;

const LanguageText = styled.span`
  color: black;
  font-size: 16px;
  margin-right: 16px;
  margin-left: 8px;
  font-weight: 400;
`;

const LanguageTextFilter = styled.span`
  color: black;
  font-size: 16px;
  margin-right: 0px;
  margin-left: 8px;
  font-weight: 700;
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

let user = { _id: null, cookies: {} };
export class AdvancedSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recherche: initial_data.map((x) => ({ ...x, active: false })),
      dispositifs: [],
      pinned: [],
      activeFiltre: "",
      activeTri: this.props.location.state === "theme" ? "Par thème" : null,
      data: [], //inutilisé, à remplacer par recherche quand les cookies sont stabilisés
      order: this.props.location.state === "theme" ? "theme" : null,
      croissant: true,
      filter: {},
      displayAll: true,
      dropdownOpenTri: false,
      dropdownOpenFiltre: false,
      showBookmarkModal: false,
      searchToggleVisible: true,
      visible: true,
      countTotal: 0,
      countShow: 0,
      themesObject: [],
      principalThemeList: [],
      secondaryThemeList: [],
      selectedTag: null,
      principalThemeListFullFrance: [],
      secondaryThemeListFullFrance: [],
      nonTranslated: [],
      filterLanguage: "",
      chargingArray: new Array(20).fill(),
      switch: false,
      showGeolocFullFrancePrincipal: false,
      showGeolocFullFranceSecondary: false,
      filterVille: "",
      dispositifsFullFrance: [],
      geoSearch: false,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.state.languageDropdown
    ) {
      if (this.state.filterLanguage === "") {
        this.setState({ filterLanguage: "", activeFiltre: "" });
      }
      this.setState({ languageDropdown: false });
    }
  }

  switchGeoSearch = (value) => {
    this.setState({ geoSearch: value });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    document.addEventListener("mousedown", this.handleClickOutside);
    window.addEventListener("scroll", this.handleScrolling);
    this._isMounted = true;
    this.retrieveCookies();
    // Retrieve filters value from url parameters
    let tagFromNav =
      this.props.location.state === "clean-filters" ||
      this.props.location.state === "dispositifs" ||
      this.props.location.state === "demarches" ||
      this.props.location.state === "theme"
        ? null
        : this.props.location.state;

    let tag = querySearch(this.props.location.search).tag || tagFromNav;
    //let tri = querySearch(this.props.location.search).tri;
    let bottomValue = querySearch(this.props.location.search).bottomValue;
    let dep = querySearch(this.props.location.search).dep;
    let city = querySearch(this.props.location.search).city;
    let topValue = querySearch(this.props.location.search).topValue;
    let niveauFrancais = querySearch(this.props.location.search).niveauFrancais;
    let niveauFrancaisObj = this.state.recherche[3].children.find(
      (elem) => elem.name === decodeURIComponent(niveauFrancais)
    );
    const filter = querySearch(this.props.location.search).filter;
    if (filter) {
      this.filter_content(
        filter === "dispositif" ? filtres_contenu[0] : filtres_contenu[1]
      );
    }

    const filterLanguage = querySearch(this.props.location.search)
      .filterLanguage;
    if (filterLanguage) {
      const langueIndex = Object.keys(activatedLanguages).filter(
        (item) => activatedLanguages[item].langueCode === filterLanguage
      )[0];
      const langueFromUrl = activatedLanguages[langueIndex];
      this.setState({ activeFiltre: "traduction" });
      this.selectLanguage(langueFromUrl);
    }

    if (this.props.location.state === "dispositifs") {
      this.filter_content(filtres_contenu[0]);
    } else if (this.props.location.state === "demarches") {
      this.filter_content(filtres_contenu[1]);
    }
    // Reinject filters value in recherche
    if (tag || bottomValue || topValue || niveauFrancais || dep || city) {
      console.log("newQueryP HERE query");
      this.setState(
        produce((draft) => {
          if (tag) {
            const tagValue = filtres.tags.find(
              (x) => x.name === decodeURIComponent(tag)
            );
            draft.selectedTag = tagValue;
            draft.recherche[0].query = decodeURIComponent(tag);
            draft.recherche[0].value = decodeURIComponent(tag);
            draft.recherche[0].active = true;
            draft.recherche[0].short =
              filtres.tags &&
              filtres.tags.find((x) => x.name === decodeURIComponent(tag))
                .short;
          }
          if (topValue && bottomValue) {
            draft.recherche[2].value = initial_data[2].children.find(
              (item) => item.topValue === parseInt(topValue, 10)
            ).name;
            draft.recherche[2].query = draft.recherche[2].value;
            draft.recherche[2].active = true;
          }
          if (dep && city) {
            let locationQuery = [
              { long_name: decodeURIComponent(city) },
              { long_name: decodeURIComponent(dep) },
            ];
            draft.recherche[1].query = locationQuery;
            draft.recherche[1].value = decodeURIComponent(city);
            draft.recherche[1].active = true;
            this.switchGeoSearch(true);
          }
          if (niveauFrancais) {
            draft.recherche[3].name = decodeURIComponent(niveauFrancais);
            draft.recherche[3].value = decodeURIComponent(niveauFrancais);
            draft.recherche[3].query = niveauFrancaisObj.query;
            draft.recherche[3].active = true;
          }
          draft.activeTri = "";
        }),
        //Launch filter query with value from the url
        () =>
          this.queryDispositifs({
            "tags.name": tag ? decodeURIComponent(tag) : "",
            "audienceAge.bottomValue": topValue
              ? { $lte: parseInt(topValue, 10) }
              : "",
            "audienceAge.topValue": bottomValue
              ? { $gte: parseInt(bottomValue, 10) }
              : "",
            city: city ? decodeURIComponent(city) : "",
            dep: dep ? decodeURIComponent(dep) : "",
            niveauFrancais: niveauFrancaisObj ? niveauFrancaisObj.query : "",
          })
      );
    } else if (filter) {
      this.filter_content(
        filter === "dispositif" ? filtres_contenu[0] : filtres_contenu[1]
      );

      this.queryDispositifs();
    } else {
      this.queryDispositifs();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    window.removeEventListener("scroll", this.handleScrolling);
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoading !== this.props.isLoading) {
      this.queryDispositifs(null, this.props);
    }

    if (
      prevProps.location.state !== "clean-filters" &&
      this.props.location.state === "clean-filters"
    ) {
      this.setState({
        recherche: initial_data.map((x) => ({ ...x, active: false })),
      });
    }

    if (prevProps.languei18nCode !== this.props.languei18nCode) {
      this.setState(
        {
          filterLanguage: "",
          activeFiltre:
            this.state.activeFiltre === "traduction"
              ? ""
              : this.state.activeFiltre,
        },
        () => this.queryDispositifs(null, this.props)
      );
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

  queryDispositifs = (Nquery = null, props = this.props) => {
    // if query from url parameters, delete all empty values
    if (Nquery) {
      Object.keys(Nquery).forEach((key) =>
        Nquery[key] === "" ? delete Nquery[key] : {}
      );
    }
    console.log("newQueryP queryD Nquery", Nquery);
    // create query with values from Url or from values selected in search bar
    const { query, newQueryParam } = this.computeQuery(Nquery);
    console.log("newQueryParam query", newQueryParam);

    // let query =
    //   Nquery ||
    //   this.state.recherche
    //     .filter((x) => x.active)
    //     .map((x) =>
    //       x.queryName === "audienceAge"
    //         ? {
    //             "audienceAge.bottomValue": { $lte: x.topValue },
    //             "audienceAge.topValue": { $gte: x.bottomValue },
    //           }
    //         : x.queryName === "localisation"
    //         ? {
    //             city: x.query[0].long_name,
    //             dep: x.query[1].long_name,
    //           }
    //         : x.queryName === "niveauFrancais"
    //         ? {
    //             niveauFrancais: x.value === "bien" ? "bien" : x.query,
    //           }
    //         : { [x.queryName]: x.query }
    //     )
    //     .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    // create object with localisation filter only
    const localisationSearch = this.state.recherche.find(
      (x) => x.queryName === "localisation" && x.value
    );
    // When no paramaters from the url
    if (!Nquery) {
      console.log("HERE", newQueryParam);
      // let newQueryParam = {
      //   tag: query["tags.name"]
      //     ? decodeURIComponent(query["tags.name"])
      //     : undefined,
      //   bottomValue: query["audienceAge.bottomValue"]
      //     ? this.state.recherche[2].bottomValue
      //     : undefined,
      //   topValue: query["audienceAge.topValue"]
      //     ? this.state.recherche[2].topValue
      //     : undefined,
      //   niveauFrancais: query["niveauFrancais"]
      //     ? this.state.recherche[3].value
      //     : undefined,
      //   city: query["city"]
      //     ? this.state.recherche[1].query[0].long_name
      //     : undefined,
      //   dep: query["dep"]
      //     ? this.state.recherche[1].query[1].long_name
      //     : undefined,
      //   filter: this.state.filter.$or
      //     ? this.state.filter.$or[1].typeContenu
      //     : this.state.filter.typeContenu
      //     ? this.state.filter.typeContenu
      //     : undefined,

      //   tri: this.state.order ? this.state.order : undefined,
      //   filterLanguage: this.state.filterLanguage.langueCode,
      // };
      // //delete empty value from the filters
      // Object.keys(newQueryParam).forEach((key) =>
      //   newQueryParam[key] === undefined ? delete newQueryParam[key] : {}
      // );
      // inject parameters in the url
      this.props.history.push({
        search: qs.stringify(newQueryParam),
      });
    }
    // delete localisation filter from the query before calling the back end
    delete query.dep;
    delete query.city;

    const filteredDispositifs = filterContents(
      this.props.dispositifs,
      query,
      this.state.filter
    );

    let dispositifs = filteredDispositifs;
    this.setState({ countTotal: dispositifs.length });

    if (query["tags.name"]) {
      //On réarrange les résultats pour avoir les dispositifs dont le tag est le principal en premier, sinon trié par date de création
      dispositifs = dispositifs.sort((a, b) =>
        _.get(a, "tags.0.name", {}) === this.state.recherche[0].query
          ? -1
          : _.get(b, "tags.0.name", {}) === this.state.recherche[0].query
          ? 1
          : 0
      );
    } else {
      dispositifs = dispositifs.sort((a, b) => a.created_at - b.created_at);
    }

    if (props.languei18nCode !== "fr" || this.state.filterLanguage !== "") {
      var nonTranslated = dispositifs.filter((dispo) => {
        if (
          typeof dispo.avancement === "object" &&
          dispo.avancement[
            props.languei18nCode !== "fr"
              ? props.languei18nCode
              : this.state.filterLanguage.i18nCode
          ]
        ) {
          return false;
        }
        return true;
      });
      this.setState({ nonTranslated });
      dispositifs = dispositifs.filter((dispo) => {
        if (
          typeof dispo.avancement === "object" &&
          dispo.avancement[
            props.languei18nCode !== "fr"
              ? props.languei18nCode
              : this.state.filterLanguage.i18nCode
          ]
        ) {
          return true;
        }
      });
    }
    let dispositifsFullFrance = [];
    if (
      localisationSearch &&
      localisationSearch.query[1] &&
      localisationSearch.query[1].long_name
    ) {
      var index;
      var i;
      var dispositifsFrance = [];
      var dispositifsVille = [];
      var dispositifsEmpty = [];
      this.setState({
        filterVille: localisationSearch.query[0].long_name || "",
      });
      for (index = 0; index < dispositifs.length; index++) {
        if (
          dispositifs[index].contenu[1] &&
          dispositifs[index].contenu[1].children &&
          dispositifs[index].contenu[1].children.length > 0
        ) {
          var geolocInfocard = dispositifs[index].contenu[1].children.find(
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
                  localisationSearch.query[1].long_name ||
                geolocInfocard.departments[i].split(" - ")[1] ===
                  localisationSearch.query[0].long_name ||
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

    if (this.state.activeTri === "Par thème") {
      const themesObject = filtres.tags.map((tag) => {
        return {
          [tag.short]: dispositifs.filter((elem) => {
            if (elem.tags[0]) {
              return elem.tags[0].short === tag.short;
            }
          }),
        };
      });
      this.setState({ themesObject: themesObject });
    }

    if (this.state.recherche[0] && this.state.recherche[0].value) {
      var principalThemeList = dispositifs.filter((elem) => {
        if (elem.tags && elem.tags[0]) {
          return elem.tags[0].short === this.state.recherche[0].short;
        }
      });

      var secondaryThemeList = dispositifs.filter((element) => {
        if (element.tags && element.tags.length > 0) {
          for (var index = 1; index < element.tags.length; index++) {
            if (
              index !== 0 &&
              element.tags[index] &&
              element.tags[index].short === this.state.recherche[0].short
            )
              return true;
          }
        }
      });

      this.setState({ principalThemeList, secondaryThemeList });
      if (
        localisationSearch &&
        localisationSearch.query[1] &&
        localisationSearch.query[1].long_name
      ) {
        var principalThemeListFullFrance = dispositifsFullFrance.filter(
          (elem) => {
            if (elem.tags && elem.tags[0]) {
              return elem.tags[0].short === this.state.recherche[0].short;
            }
          }
        );
        var secondaryThemeListFullFrance = dispositifsFullFrance.filter(
          (element) => {
            if (element.tags && element.tags.length > 0) {
              for (var index = 1; index < element.tags.length; index++) {
                if (
                  index !== 0 &&
                  element.tags[index] &&
                  element.tags[index].short === this.state.recherche[0].short
                )
                  return true;
              }
            }
          }
        );
        this.setState({
          principalThemeListFullFrance,
          secondaryThemeListFullFrance,
        });
      }
    }

    this.setState({
      dispositifs,
      countShow: dispositifs.length,
    });

    let tri = querySearch(this.props.location.search).tri;
    console.log(" QDtri", tri, this.state.order);
    if (this.state.order === "nbVues" || this.state.order === "created_at") {
      // const triFromUrl = tris.filter(
      //   (item) => item.value === decodeURIComponent(tri)
      // )[0];
      this.reorder({ value: this.state.order });
    }
  };

  selectTag = (tag = {}) => {
    const tagValue = filtres.tags.find((x) => x.short === tag) || {};
    this.setState((pS) => ({
      recherche: pS.recherche.map((x, i) =>
        i === 0
          ? {
              ...x,
              value: tagValue.name,
              short: tagValue.short,
              query: tagValue.name,
              active: true,
            }
          : x
      ),
      selectedTag: tagValue,
    }));
    this.queryDispositifs({ "tags.name": tagValue.name });
  };

  retrieveCookies = () => {
    if (API.isAuth()) {
      API.get_user_info().then((data_res) => {
        let u = data_res.data.data;
        user = { _id: u._id, cookies: u.cookies || {} };
        this.setState({
          pinned: user.cookies.dispositifsPinned
            ? user.cookies.dispositifsPinned.map((x) => x._id)
            : [],
        });
      });
    }
  };

  restart = () => {
    this.setState(
      {
        recherche: initial_data.map((x) => ({ ...x, active: false })),
        filterVille: "",
        geoSearch: false,
      },
      () => this.queryDispositifs()
    );
  };

  writeNew = () => {
    if (this.props.user) {
      this.props.history.push({
        pathname: "/comment-contribuer",
      });
    } else {
      this.props.history.push({
        pathname: "/login",
      });
    }
  };

  pin = (e, dispositif) => {
    e.preventDefault();
    e.stopPropagation();
    if (API.isAuth()) {
      dispositif.pinned = !dispositif.pinned;
      let prevState = [...this.state.dispositifs];
      const isDispositifPinned =
        this.state.pinned.includes(dispositif._id) ||
        this.state.pinned.filter(
          (pinnedDispostif) =>
            pinnedDispostif && pinnedDispostif._id === dispositif._id
        ).length > 0;
      this.setState(
        {
          pinned: dispositif.pinned
            ? [...this.state.pinned, dispositif]
            : this.state.pinned.filter((x) =>
                x && x._id ? x._id !== dispositif._id : x !== dispositif._id
              ),
          showBookmarkModal:
            !isDispositifPinned && !prevState.showBookmarkModal,
        },
        () => {
          const dispositifsPinnedArray = [
            ...new Set(this.state.pinned.map((x) => (x && x._id) || x)),
          ];

          user.cookies.dispositifsPinned = dispositifsPinnedArray.map((id) => {
            if (
              user.cookies.dispositifsPinned &&
              user.cookies.dispositifsPinned.find(
                (dispPinned) => id === dispPinned._id
              )
            ) {
              return user.cookies.dispositifsPinned.find(
                (dispPinned) => id === dispPinned._id
              );
            }
            return { _id: id, datePin: new Date() };
          });
          API.set_user_info(user).then(() => {
            this.props.fetchUser();
          });
        }
      );
    } else {
      this.setState(() => ({
        showBookmarkModal: true,
      }));
    }
  };

  sortFunction = (dispositifs, order, croissant) => {
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
      return aValue > bValue
        ? croissant
          ? 1
          : -1
        : aValue < bValue
        ? croissant
          ? -1
          : 1
        : 0;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  computeQuery = (Nquery = null) => {
    console.log("newQueryP Nquery", Nquery);
    let query =
      Nquery ||
      this.state.recherche
        .filter((x) => x.active)
        .map((x) =>
          x.queryName === "audienceAge"
            ? {
                "audienceAge.bottomValue": { $lte: x.topValue },
                "audienceAge.topValue": { $gte: x.bottomValue },
              }
            : x.queryName === "localisation"
            ? {
                city: x.query[0].long_name,
                dep: x.query[1].long_name,
              }
            : x.queryName === "niveauFrancais"
            ? {
                niveauFrancais: x.value === "bien" ? "bien" : x.query,
              }
            : { [x.queryName]: x.query }
        )
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    console.log("newQueryP this.state.order", this.state.order);
    let newQueryParam = {
      tag: query["tags.name"]
        ? decodeURIComponent(query["tags.name"])
        : undefined,
      bottomValue: query["audienceAge.bottomValue"]
        ? this.state.recherche[2].bottomValue
        : undefined,
      topValue: query["audienceAge.topValue"]
        ? this.state.recherche[2].topValue
        : undefined,
      niveauFrancais: query["niveauFrancais"]
        ? this.state.recherche[3].value
        : undefined,
      city: query["city"]
        ? this.state.recherche[1].query[0].long_name
        : undefined,
      dep: query["dep"]
        ? this.state.recherche[1].query[1].long_name
        : undefined,
      filter: this.state.filter.$or
        ? this.state.filter.$or[1].typeContenu
        : this.state.filter.typeContenu
        ? this.state.filter.typeContenu
        : undefined,
      tri: this.state.order ? this.state.order : undefined,
      filterLanguage: this.state.filterLanguage.langueCode,
    };
    //delete empty value from the filters
    Object.keys(newQueryParam).forEach((key) =>
      newQueryParam[key] === undefined ? delete newQueryParam[key] : {}
    );
    console.log("compute query", newQueryParam);
    return { query, newQueryParam };
  };

  reorder = (tri) => {
    console.log("newQueryP tri", tri);
    if (tri.name === "Par thème") {
      this.setState(
        {
          activeTri: tri.name,
          recherche: this.state.recherche.map((x, i) =>
            i === 0 ? initial_data[i] : x
          ),
          order: "theme",
        },
        () => this.queryDispositifs()
      );
    } else {
      const order = tri.value;
      // const croissant =
      //   order === this.state.order ? !this.state.croissant : false;

      const croissant = false;
      console.log("newQueryP tri?value", tri.value);
      this.setState(
        (pS) => ({
          dispositifs: this.sortFunction(pS.dispositifs, order, croissant),
          principalThemeList: this.sortFunction(
            pS.principalThemeList,
            order,
            croissant
          ),
          secondaryThemeList: this.sortFunction(
            pS.secondaryThemeList,
            order,
            croissant
          ),
          order: tri.value,
          activeTri: tri.name,
          croissant: croissant,
        }),
        () => {
          const { _, newQueryParam } = this.computeQuery();
          console.log("newQueryParam reorder", newQueryParam);
          this.props.history.push({ search: qs.stringify(newQueryParam) });
        }
      );
    }
  };

  filter_content = (filtre) => {
    const filter = this.state.activeFiltre === filtre.name ? {} : filtre.query;
    const activeFiltre =
      this.state.activeFiltre === filtre.name ? "" : filtre.name;
    const { _, newQueryParam } = this.computeQuery();
    console.log("newQueryParam filter", newQueryParam);

    this.props.history.push({ search: qs.stringify(newQueryParam) });
    this.setState(
      {
        filter,
        activeFiltre /* activeTri: this.state.activeTri === "Par thème" ? "" : this.state.activeTri */,
        languageDropdown: false,
        filterLanguage: "",
      },
      () => this.queryDispositifs()
    );
  };

  seeMore = (selectedTheme) => {
    this.selectParam(0, selectedTheme);
  };

  goToDispositif = (dispositif = {}) => {
    this.props.history.push(
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

  addParamasInRechercher = (key, subitem) => {
    let recherche = [...this.state.recherche];
    recherche[key] = {
      ...recherche[key],
      value: subitem.name || subitem.formatted_address,
      icon: subitem.icon,
      query:
        subitem.query ||
        subitem.address_components ||
        (key !== 3 ? subitem.name : undefined),
      active: true,
      ...(subitem.short && { short: subitem.short }),
      ...(subitem.bottomValue && { bottomValue: subitem.bottomValue }),
      ...(subitem.topValue && { topValue: subitem.topValue }),
    };
    this.setState({ recherche });
  };

  selectParam = (key, subitem) => {
    let recherche = [...this.state.recherche];
    recherche[key] = {
      ...recherche[key],
      value: subitem.name || subitem.formatted_address,
      icon: subitem.icon,
      query:
        subitem.query ||
        subitem.address_components ||
        (key !== 3 ? subitem.name : undefined),
      active: true,
      ...(subitem.short && { short: subitem.short }),
      ...(subitem.bottomValue && { bottomValue: subitem.bottomValue }),
      ...(subitem.topValue && { topValue: subitem.topValue }),
    };
    this.setState(
      {
        recherche: recherche,
        selectedTag: key === 0 ? subitem : this.state.selectedTag,
        activeTri:
          this.state.activeTri === "Par thème" ? "" : this.state.activeTri,
      },
      () => this.queryDispositifs()
    );
  };

  desactiverTri = () => {
    let query = querySearch(this.props.location.search);
    if (query.tri) {
      delete query.tri;
    }
    this.props.history.push({
      search: qs.stringify(query),
    });

    this.setState({ activeTri: "", order: null }, () =>
      this.queryDispositifs()
    );
  };

  desactiverFiltre = () => {
    this.setState(
      {
        activeFiltre: "",
        filter: {},
        languageDropdown: false,
        filterLanguage: "",
      },
      () => this.queryDispositifs()
    );
  };

  deleteItemInSearch = (key) => {
    if (key === 1) {
      this.setState({ filterVille: "" });
    }
    this.setState({
      recherche: this.state.recherche.map((x, i) =>
        i === key ? initial_data[i] : x
      ),
    });
  };

  desactiver = (key) => {
    if (key === 1) {
      this.setState({ filterVille: "" });
    }
    this.setState(
      {
        recherche: this.state.recherche.map((x, i) =>
          i === key ? initial_data[i] : x
        ),
      },
      () => this.queryDispositifs()
    );
  };
  toggleDisplayAll = () =>
    this.setState((pS) => ({ displayAll: !pS.displayAll }));
  toggleDropdownTri = () =>
    this.setState((pS) => ({ dropdownOpenTri: !pS.dropdownOpenTri }));
  toggleDropdownFiltre = () =>
    this.setState((pS) => ({ dropdownOpenFiltre: !pS.dropdownOpenFiltre }));
  toggleBookmarkModal = () =>
    this.setState((prevState) => ({
      showBookmarkModal: !prevState.showBookmarkModal,
    }));
  toggleSearch = () => {
    this.setState({ searchToggleVisible: !this.state.searchToggleVisible });
  };

  openLDropdown = () => {
    this.desactiverFiltre();
    this.setState({ activeFiltre: "traduction", languageDropdown: true });
  };

  selectLanguage = (language) => {
    let filterFromUrl = querySearch(this.props.location.search);
    filterFromUrl.filterLanguage = language.langueCode;

    delete filterFromUrl.filter;

    this.props.history.push({
      search: qs.stringify(filterFromUrl),
    });
    this.setState({ filterLanguage: language, languageDropdown: false }, () =>
      this.queryDispositifs()
    );
  };

  render() {
    let {
      recherche,
      dispositifs,
      pinned,
      activeFiltre,
      activeTri,
      displayAll,
      selectedTag,
      filterLanguage,
    } = this.state;
    const {
      t,
      isDesktop,
      isSmallDesktop,
      isTablet,
      isBigDesktop,
      languei18nCode,
    } = this.props;
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
    const current =
      (this.props.langues || []).find(
        (x) => x.i18nCode === this.props.i18n.language
      ) || {};
    const langueCode =
      this.props.langues.length > 0 && current ? current.langueCode : "fr";

    return (
      <div className="animated fadeIn advanced-search">
        {isMobile ? (
          <MobileAdvancedSearch
            t={t}
            recherche={recherche}
            addParamasInRechercher={this.addParamasInRechercher}
            queryDispositifs={this.queryDispositifs}
            desactiver={this.deleteItemInSearch}
            query={querySearch(this.props.location.search)}
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
            history={this.props.history}
            isLoading={this.props.isLoading}
          />
        ) : (
          <>
            <div>
              <div
                className={
                  "search-bar" +
                  (this.state.visible ? "" : " search-bar-hidden")
                }
              >
                {recherche
                  .filter((_, i) => displayAll || i === 0)
                  .map((d, i) => (
                    <SearchItem
                      isBigDesktop={isBigDesktop}
                      key={i}
                      item={d}
                      keyValue={i}
                      selectParam={this.selectParam}
                      desactiver={this.desactiver}
                      switchGeoSearch={this.switchGeoSearch}
                      geoSearch={this.state.geoSearch}
                    />
                  ))}
                <SearchToggle
                  onClick={() => this.toggleSearch()}
                  visible={this.state.searchToggleVisible}
                >
                  {this.state.searchToggleVisible ? (
                    <EVAIcon
                      name="arrow-ios-upward-outline"
                      fill={colors.blanc}
                    />
                  ) : (
                    <EVAIcon
                      name="arrow-ios-downward-outline"
                      fill={colors.noir}
                    />
                  )}
                </SearchToggle>
                <ResponsiveFooter
                  {...this.state}
                  show={false}
                  toggleDropdownTri={this.toggleDropdownTri}
                  toggleDropdownFiltre={this.toggleDropdownFiltre}
                  reorder={this.reorder}
                  filter_content={this.filter_content}
                  toggleDisplayAll={this.toggleDisplayAll}
                  t={t}
                />
              </div>
              <FilterBar
                visibleTop={this.state.visible}
                visibleSearch={this.state.searchToggleVisible}
              >
                <FilterTitle>
                  {t("AdvancedSearch.Filtrer par n", "Filtrer par")}
                </FilterTitle>
                {filtres_contenu.map((filtre, idx) => {
                  return (
                    <TagButton
                      active={filtre.name === activeFiltre}
                      desactiver={this.desactiverFiltre}
                      key={idx}
                      filter
                      onClick={() => this.filter_content(filtre)}
                    >
                      {filtre.name &&
                        t("AdvancedSearch." + filtre.name, filtre.name)}
                    </TagButton>
                  );
                })}
                {languei18nCode === "fr" ? (
                  <>
                    <TagButton
                      active={"traduction" === activeFiltre}
                      desactiver={this.desactiverFiltre}
                      filter
                      id={"Tooltip-1"}
                      onClick={() => this.openLDropdown()}
                    >
                      {filterLanguage === "" ? (
                        t("AdvancedSearch.Traduction")
                      ) : (
                        <>
                          <i
                            className={
                              "flag-icon ml-8 flag-icon-" +
                              filterLanguage.langueCode
                            }
                            title={filterLanguage.langueCode}
                            id={filterLanguage.langueCode}
                          />
                          <LanguageTextFilter>
                            {filterLanguage.langueFr || "Langue"}
                          </LanguageTextFilter>
                        </>
                      )}
                    </TagButton>
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
                        {this.props.langues.map((elem) => {
                          if (elem.avancement > 0 && elem.langueCode !== "fr") {
                            return (
                              <div
                                className={"language-filter-button"}
                                onClick={() => this.selectLanguage(elem)}
                              >
                                <i
                                  className={
                                    "flag-icon ml-8 flag-icon-" +
                                    elem.langueCode
                                  }
                                  title={elem.langueCode}
                                  id={elem.langueCode}
                                />
                                <LanguageText>
                                  {elem.langueFr || "Langue"}
                                </LanguageText>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </Tooltip>{" "}
                  </>
                ) : null}
                <FilterTitle>
                  {t("AdvancedSearch.Trier par n", "Trier par")}
                </FilterTitle>
                {tris.map((tri, idx) => (
                  <TagButton
                    active={tri.name === activeTri}
                    desactiver={this.desactiverTri}
                    key={idx}
                    filter
                    onClick={() => this.reorder(tri)}
                  >
                    {t("AdvancedSearch." + tri.name, tri.name)}
                  </TagButton>
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
                    this.state.activeTri === "Par thème"
                      ? "#f1e8f5"
                      : this.state.recherche[0] && this.state.recherche[0].value
                      ? filtres.tags.find(
                          (elem) => elem.short === this.state.recherche[0].short
                        )["lightColor"]
                      : "#e4e5e6",
                }}
              >
                {this.state.activeTri === "Par thème" ? (
                  <div style={{ width: "100%" }}>
                    {this.state.themesObject.map((theme, index) => {
                      var themeKey = Object.keys(theme);
                      var selectedTheme = filtres.tags.find(
                        (elem) => elem.short === themeKey[0]
                      );
                      return (
                        <ThemeContainer
                          key={index}
                          color={selectedTheme.lightColor}
                        >
                          <ThemeHeader>
                            <ThemeButton
                              ml={isRTL ? 20 : 0}
                              color={selectedTheme.darkColor}
                            >
                              <Streamline
                                name={selectedTheme.icon}
                                stroke={"white"}
                                width={22}
                                height={22}
                              />
                              <ThemeText mr={isRTL ? 8 : 0}>
                                {t(
                                  "Tags." + selectedTheme.short,
                                  selectedTheme.short
                                )}
                              </ThemeText>
                            </ThemeButton>
                            <ThemeHeaderTitle color={selectedTheme.darkColor}>
                              {t(
                                "Tags." + selectedTheme.name,
                                selectedTheme.name
                              )[0].toUpperCase() +
                                t(
                                  "Tags." + selectedTheme.name,
                                  selectedTheme.name
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
                            {theme[themeKey]
                              .filter((_, indexCard) => indexCard < 4)
                              .map((cardFiltered, indexCardFiltered) => {
                                return (
                                  <SearchResultCard
                                    key={indexCardFiltered}
                                    pin={this.pin}
                                    pinnedList={this.state.pinned}
                                    dispositif={cardFiltered}
                                    showPinned={true}
                                  />
                                );
                              })}
                            <SeeMoreCard
                              seeMore={() => this.seeMore(selectedTheme)}
                              theme={selectedTheme}
                              isRTL={isRTL}
                            />
                          </ThemeListContainer>
                        </ThemeContainer>
                      );
                    })}
                  </div>
                ) : this.state.activeTri !== "Par thème" &&
                  this.state.recherche[0] &&
                  this.state.recherche[0].value ? (
                  <ThemeContainer>
                    <ThemeHeader>
                      <ThemeHeaderTitle color={"#828282"}>
                        {langueCode !== "fr" || filterLanguage !== "" ? (
                          <>
                            {t("AdvancedSearch.Résultats disponibles en") + " "}
                            <i
                              className={
                                "flag-icon flag-icon-" +
                                (filterLanguage !== ""
                                  ? filterLanguage.langueCode
                                  : langueCode)
                              }
                              title={
                                filterLanguage !== ""
                                  ? filterLanguage.langueCode
                                  : langueCode
                              }
                              id={
                                filterLanguage !== ""
                                  ? filterLanguage.langueCode
                                  : langueCode
                              }
                            />
                            <span
                              className={
                                "language-name " + (isRTL ? "mr-10" : "ml-10")
                              }
                            >
                              {(filterLanguage !== ""
                                ? filterLanguage.langueFr
                                : current.langueFr) || "Langue"}
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
                          name={selectedTag ? selectedTag.icon : null}
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
                          (dispositif, index) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={this.state.pinned}
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
                            (dispositif, index) => {
                              return (
                                <div key={index}>
                                  <SearchResultCard
                                    key={index}
                                    pin={this.pin}
                                    pinnedList={this.state.pinned}
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
                        {langueCode !== "fr" || filterLanguage !== "" ? (
                          <>
                            {t("AdvancedSearch.Autres fiches traduites en") +
                              " "}
                            <i
                              className={
                                "flag-icon flag-icon-" +
                                (filterLanguage !== ""
                                  ? filterLanguage.langueCode
                                  : langueCode)
                              }
                              title={
                                filterLanguage !== ""
                                  ? filterLanguage.langueCode
                                  : langueCode
                              }
                              id={
                                filterLanguage !== ""
                                  ? filterLanguage.langueCode
                                  : langueCode
                              }
                            />
                            <span
                              className={
                                "language-name " + (isRTL ? "mr-10" : "ml-10")
                              }
                            >
                              {(filterLanguage !== ""
                                ? filterLanguage.langueFr
                                : current.langueFr) || "Langue"}
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
                          name={selectedTag ? selectedTag.icon : null}
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
                          (dispositif, index) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={this.state.pinned}
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
                            (dispositif, index) => {
                              return (
                                <div key={index}>
                                  <SearchResultCard
                                    key={index}
                                    pin={this.pin}
                                    pinnedList={this.state.pinned}
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
                        dispositifs.map((dispositif, index) => {
                          return (
                            <div key={index}>
                              <SearchResultCard
                                key={index}
                                pin={this.pin}
                                pinnedList={this.state.pinned}
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
                          (dispositif, index) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={this.state.pinned}
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
                    {langueCode !== "fr" || filterLanguage !== "" ? (
                      <>
                        <ThemeHeader>
                          <ThemeHeaderTitle color={"#828282"}>
                            <>
                              {t("AdvancedSearch.Résultats disponibles en") +
                                " "}
                              <i
                                className={
                                  "flag-icon flag-icon-" +
                                  (filterLanguage !== ""
                                    ? filterLanguage.langueCode
                                    : langueCode)
                                }
                                title={
                                  filterLanguage !== ""
                                    ? filterLanguage.langueCode
                                    : langueCode
                                }
                                id={
                                  filterLanguage !== ""
                                    ? filterLanguage.langueCode
                                    : langueCode
                                }
                              />
                              <span
                                className={
                                  "language-name " + (isRTL ? "mr-10" : "ml-10")
                                }
                              >
                                {(filterLanguage !== ""
                                  ? filterLanguage.langueFr
                                  : current.langueFr) || "Langue"}
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
                            this.state.dispositifs.map((dispositif, index) => {
                              return (
                                <div key={index}>
                                  <SearchResultCard
                                    key={index}
                                    pin={this.pin}
                                    pinnedList={this.state.pinned}
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
                                  (filterLanguage !== ""
                                    ? filterLanguage.langueCode
                                    : langueCode)
                                }
                                title={
                                  filterLanguage !== ""
                                    ? filterLanguage.langueCode
                                    : langueCode
                                }
                                id={
                                  filterLanguage !== ""
                                    ? filterLanguage.langueCode
                                    : langueCode
                                }
                              />
                              <span
                                className={
                                  "language-name " + (isRTL ? "mr-10" : "ml-10")
                                }
                              >
                                {(filterLanguage !== ""
                                  ? filterLanguage.langueFr
                                  : current.langueFr) || "Langue"}
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
                              (dispositif, index) => {
                                return (
                                  <div key={index}>
                                    <SearchResultCard
                                      key={index}
                                      pin={this.pin}
                                      pinnedList={this.state.pinned}
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
                          {dispositifs.map((dispositif, index) => {
                            return (
                              <div key={index}>
                                <SearchResultCard
                                  key={index}
                                  pin={this.pin}
                                  pinnedList={this.state.pinned}
                                  dispositif={dispositif}
                                  showPinned={true}
                                />
                              </div>
                            );
                          })}
                          {!this.props.isLoading &&
                            [...pinned, ...dispositifs].length === 0 && (
                              /*             <Col
                    xs="12"
                    sm="6"
                    md="3"
                    className="no-result"
                    onClick={() => this.selectTag()}
                  > */
                              <NoResultPlaceholder
                                restart={this.restart}
                                writeNew={this.writeNew}
                              />
                              //  </Col>
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
                /*           style={{
            backgroundColor:
              this.state.activeTri === "Par thème"
                ? "#f1e8f5"
                : this.state.recherche[0] && this.state.recherche[0].value
                ?  (filtres.tags.find(
                  (elem) => elem.short === this.state.recherche[0].short
                ))["lightColor"]
                : "#e4e5e6",
          }} */
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
                    {this.state.chargingArray.map((_, index) => {
                      return <LoadingCard key={index} />;
                    })}
                  </ThemeListContainer>
                </ThemeContainer>
              </div>
            )}
            <BookmarkedModal
              t={this.props.t}
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

export const ResponsiveFooter = (props) => {
  const { activeFiltre, activeTri, displayAll, t, show } = props;
  return (
    show && (
      <div className="responsive-footer">
        <ButtonDropdown
          className={"options-dropdown" + (activeTri ? " active" : "")}
          isOpen={props.dropdownOpenTri}
          toggle={props.toggleDropdownTri}
        >
          <DropdownToggle color="transparent">
            <EVAIcon name="options-2-outline" />
          </DropdownToggle>
          <DropdownMenu>
            {tris.map((tri, idx) => (
              <DropdownItem
                key={idx}
                onClick={() => props.reorder(tri)}
                className={
                  "side-option" + (tri.name === activeTri ? " active" : "")
                }
              >
                {t("AdvancedSearch." + tri.name, tri.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown
          className={"options-dropdown" + (activeFiltre ? " active" : "")}
          isOpen={props.dropdownOpenFiltre}
          toggle={props.toggleDropdownFiltre}
        >
          <DropdownToggle
            color="transparent"
            className={activeFiltre ? "active" : ""}
          >
            <EVAIcon name="funnel-outline" />
          </DropdownToggle>
          <DropdownMenu>
            {filtres_contenu.map((filtre, idx) => (
              <DropdownItem
                key={idx}
                onClick={() => props.filter_content(filtre)}
                className={
                  "side-option" +
                  (filtre.name === activeFiltre ? " active" : "")
                }
              >
                {filtre.name && t("AdvancedSearch." + filtre.name, filtre.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
        <EVAIcon
          name={"arrow-circle-" + (displayAll ? "up" : "down")}
          size="xlarge"
          onClick={props.toggleDisplayAll}
          className="close-arrow"
          fill={colors.grisFonce}
        />
      </div>
    )
  );
};

const mapStateToProps = (state) => {
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

const mapSizesToProps = ({ width }) => ({
  isMobile: width < 850,
  isTablet: width >= 850 && width < 1100,
  isSmallDesktop: width >= 1100 && width < 1400,
  isDesktop: width >= 1400 && width < 1565,
  isBigDesktop: width >= 1565,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withSizes(mapSizesToProps)(withTranslation()(windowSize(AdvancedSearch))))
);
