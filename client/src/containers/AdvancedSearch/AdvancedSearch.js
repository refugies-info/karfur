import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
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
// import Cookies from 'js-cookie';

import i18n from "../../i18n";
import Streamline from "../../assets/streamline";
import SearchItem from "./SearchItem/SearchItem";
import SearchResultCard from "./SearchResultCard";
import SeeMoreCard from "./SeeMoreCard";
import NoResultPlaceholder from "./NoResultPlaceholder";
import API from "../../utils/API";
import { initial_data } from "./data";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import { filtres } from "../Dispositif/data";
import { filtres_contenu, tris } from "./data";
import FButton from "../../components/FigmaUI/FButton/FButton";
import TagButton from "../../components/FigmaUI/TagButton/TagButton";
import { BookmarkedModal } from "../../components/Modals/index";
import { fetchUserActionCreator } from "../../services/User/user.actions";

import "./AdvancedSearch.scss";
import variables from "scss/colors.scss";

const ThemeContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.color};
  padding: 24px 68px 48px 68px;
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
  border-radius: 12px;
  padding: 13px 16px 0px;
  margin-left: 68px;
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
  margin-left: ${(props) => (props.ml ? "8px" : "0px")};
`;
const ThemeText = styled.p`
  color: white;
  font-size: 18px;
  margin-left: 8px;
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

let user = { _id: null, cookies: {} };
export class AdvancedSearch extends Component {
  state = {
    showSpinner: false,
    recherche: initial_data.map((x) => ({ ...x, active: false })),
    dispositifs: [],
    nbVues: [],
    pinned: [],
    activeFiltre: "",
    activeTri: "Par thème",
    data: [], //inutilisé, à remplacer par recherche quand les cookies sont stabilisés
    order: "created_at",
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
    nonTranslated: [],
    filterLanguage: "",
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScrolling);
    this._isMounted = true;
    this.retrieveCookies();
    let tag = querySearch(this.props.location.search).tag;
    let bottomValue = querySearch(this.props.location.search).bottomValue;
    let topValue = querySearch(this.props.location.search).topValue;
    let niveauFrancais = querySearch(this.props.location.search).niveauFrancais;
    let niveauFrancaisObj = this.state.recherche[2].children.find(
      (elem) => elem.name === decodeURIComponent(niveauFrancais)
    );
    let filter = querySearch(this.props.location.search).filter;
    if (tag || bottomValue || topValue || niveauFrancais) {
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
            draft.recherche[1].value = initial_data[1].children.find(
              (item) => item.topValue === parseInt(topValue, 10)
            ).name;
            draft.recherche[1].query = draft.recherche[1].value;
            draft.recherche[1].active = true;
          }
          if (niveauFrancais) {
            draft.recherche[2].name = decodeURIComponent(niveauFrancais);
            draft.recherche[2].value = decodeURIComponent(niveauFrancais);
            draft.recherche[2].query = niveauFrancaisObj.query;
            draft.recherche[2].active = true;
          }
          draft.activeTri = "";
        }),
        () =>
          this.queryDispositifs({
            "tags.name": tag ? decodeURIComponent(tag) : "",
            "audienceAge.bottomValue": topValue
              ? { $lt: parseInt(topValue, 10) }
              : "",
            "audienceAge.topValue": bottomValue
              ? { $gt: parseInt(bottomValue, 10) }
              : "",
            niveauFrancais: niveauFrancaisObj ? niveauFrancaisObj.query : "",
          })
      );
      //this.selectTag(decodeURIComponent(tag));
    } else if (filter) {
      this.filter_content(
        filter === "dispositif" ? filtres_contenu[0] : filtres_contenu[1]
      );
    } else {
      this.queryDispositifs();
    }
    this._initializeEvents();
    //window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrolling);
    this._isMounted = false;
  }

  // eslint-disable-next-line react/no-deprecated
  componentDidUpdate(prevProps) {
    if (prevProps.languei18nCode !== this.props.languei18nCode) {
      this.setState({filterLanguage: "", activeFiltre: this.state.activeFiltre === "traduction" ? "" : this.state.activeFiltre}, () => this.queryDispositifs(null, this.props))
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
    this.setState({ showSpinner: true });
    if (Nquery) {
      Object.keys(Nquery).forEach((key) =>
        Nquery[key] === "" ? delete Nquery[key] : {}
      );
    }
    let query =
      Nquery ||
      this.state.recherche
        .filter((x) => x.active && x.queryName !== "localisation")
        .map((x) =>
          x.queryName === "audienceAge"
            ? {
                "audienceAge.bottomValue": { $lt: x.topValue },
                "audienceAge.topValue": { $gt: x.bottomValue },
              }
            : { [x.queryName]: x.query }
        )
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    /*     const localisationSearch = this.state.recherche.find(
      (x) => x.queryName === "localisation" && x.value
    ) */ if (
      !Nquery
    ) {
      let newQueryParam = {
        tag: query["tags.name"]
          ? decodeURIComponent(query["tags.name"])
          : undefined,
        bottomValue: query["audienceAge.bottomValue"]
          ? this.state.recherche[1].bottomValue
          : undefined,
        topValue: query["audienceAge.topValue"]
          ? this.state.recherche[1].topValue
          : undefined,
        niveauFrancais: query["niveauFrancais"]
          ? this.state.recherche[2].value
          : undefined,
      };

      Object.keys(newQueryParam).forEach((key) =>
        newQueryParam[key] === undefined ? delete newQueryParam[key] : {}
      );

      this.props.history.push({
        search: qs.stringify(newQueryParam),
      });
    }
    API.get_dispositif({
      query: {
        ...query,
        ...this.state.filter,
        status: "Actif",
      },
      demarcheId: { $exists: false },
      locale: props.languei18nCode,
    })
      .then((data_res) => {
        let dispositifs = data_res.data.data;

        this.setState({ countTotal: dispositifs.length });

        if (query["tags.name"]) {
          //On réarrange les résultats pour avoir les dispositifs dont le tag est le principal en premier
          /*           dispositifs = dispositifs.sort(
            (a, b) =>
              a.tags.findIndex((x) =>
                x ? x.short === query["tags.name"] : 99
              ) -
              b.tags.findIndex((x) => (x ? x.short === query["tags.name"] : 99))
          ); */
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
        dispositifs = dispositifs.map((x) => ({
          ...x,
          nbVues: (this.state.nbVues.find((y) => y._id === x._id) || {}).count,
        })); //Je rajoute la donnée sur le nombre de vues par dispositif

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
        }
        this.setState({
          dispositifs: dispositifs,
          showSpinner: false,
          countShow: dispositifs.length,
        });
      })
      .catch(() => {
        this.setState({ showSpinner: false });
      });
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

  _initializeEvents = () => {
    API.aggregate_events([
      {
        $match: {
          action: "readDispositif",
          label: "dispositifId",
          value: { $ne: null },
        },
      },
      { $group: { _id: "$value", count: { $sum: 1 } } },
    ]).then((data_res) => {
      const countEvents = data_res.data.data;
      this.setState((pS) => ({
        nbVues: countEvents,
        dispositifs: pS.dispositifs.map((x) => ({
          ...x,
          nbVues: (countEvents.find((y) => y._id === x._id) || {}).count,
        })),
      }));
    });
  };

  retrieveCookies = () => {
    // Cookies.set('data', 'ici un test');
    // let dataC=Cookies.getJSON('data');
    // if(dataC){ this.setState({data:data.map((x,key)=> {return {...x, value:dataC[key] || x.value}})})}
    // let pinnedC=Cookies.getJSON('pinnedC');
    // if(pinnedC){ this.setState({pinned:pinnedC})}
    //data à changer en recherche après
    if (API.isAuth()) {
      API.get_user_info().then((data_res) => {
        let u = data_res.data.data;
        user = { _id: u._id, cookies: u.cookies || {} };
        this.setState({
          pinned: user.cookies.dispositifsPinned
            ? user.cookies.dispositifsPinned.map((x) => x._id)
            : [],
          dispositifs: [...this.state.dispositifs].filter(
            (x) =>
              !(user.cookies.parkourPinned || []).find(
                (y) => y._id === x._id || y === x._id
              )
          ),
          ...(user.cookies.parkourData &&
            user.cookies.parkourData.length > 0 && {
              data: this.state.data.map((x, key) => {
                return {
                  ...x,
                  value: user.cookies.parkourData[key] || x.value,
                  query: (
                    x.children.find(
                      (y) =>
                        y.name === (user.cookies.parkourData[key] || x.value)
                    ) || {}
                  ).query,
                };
              }),
            }),
        });
      });
    }
  };

  restart = () => {
    this.setState(
      { recherche: initial_data.map((x) => ({ ...x, active: false })) },
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
          user.cookies.parkourPinned = [
            ...new Set(this.state.pinned.map((x) => (x && x._id) || x)),
          ];
          user.cookies.dispositifsPinned = user.cookies.parkourPinned.map(
            (parkourId) => {
              if (
                user.cookies.dispositifsPinned &&
                user.cookies.dispositifsPinned.find(
                  (dispPinned) => parkourId === dispPinned._id
                )
              ) {
                return user.cookies.dispositifsPinned.find(
                  (dispPinned) => parkourId === dispPinned._id
                );
              }
              return { _id: parkourId, datePin: new Date() };
            }
          );
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

  reorder = (tri) => {
    if (tri.name === "Par thème") {
      this.setState(
        {
          activeTri: tri.name,
          recherche: this.state.recherche.map((x, i) =>
            i === 0 ? initial_data[i] : x
          ),
        },
        () => this.queryDispositifs()
      );
    } else {
      const order = tri.value,
        croissant = order === this.state.order ? !this.state.croissant : true;
      this.setState((pS) => ({
        dispositifs: pS.dispositifs.sort((a, b) => {
          const aValue = _.get(a, order),
            bValue = _.get(b, order);
          return aValue > bValue
            ? croissant
              ? 1
              : -1
            : aValue < bValue
            ? croissant
              ? -1
              : 1
            : 0;
        }),
        order: tri.value,
        activeTri: tri.name,
        croissant: croissant,
      }));
    }
  };

  filter_content = (filtre) => {
    const filter = this.state.activeFiltre === filtre.name ? {} : filtre.query;
    const activeFiltre =
      this.state.activeFiltre === filtre.name ? "" : filtre.name;
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

  goToDispositif = (dispositif = {}, fromAutoSuggest = false) => {
    this.props.tracking.trackEvent({
      action: "click",
      label: "goToDispositif" + (fromAutoSuggest ? " - fromAutoSuggest" : ""),
      value: dispositif._id,
    });
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

  selectParam = (key, subitem) => {
    let recherche = [...this.state.recherche];
    recherche[key] = {
      ...recherche[key],
      value: subitem.name || subitem.formatted_address,
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
    this.setState({ activeTri: "" }, () => this.queryDispositifs());
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

  desactiver = (key) =>
    this.setState(
      {
        recherche: this.state.recherche.map((x, i) =>
          i === key ? initial_data[i] : x
        ),
      },
      () => this.queryDispositifs()
    );
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
    this.setState({ activeFiltre: "traduction", languageDropdown: true });
  };

  selectLanguage = (language) => {
    this.setState({ filterLanguage: language, languageDropdown: false }, () =>
      this.queryDispositifs()
    );
  };

  render() {
    let {
      recherche,
      dispositifs,
      pinned,
      showSpinner,
      activeFiltre,
      activeTri,
      displayAll,
      selectedTag,
      filterLanguage
    } = this.state;
    // eslint-disable-next-line
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
    //console.log(i18n.language);
    /* 
    if (recherche[0].active) {
      dispositifs = dispositifs.sort((a, b) =>
        _.get(a, "tags.0.name", {}) === recherche[0].query
          ? -1
          : _.get(b, "tags.0.name", {}) === recherche[0].query
          ? 1
          : 0
      );
    } */

    return (
      <div className="animated fadeIn advanced-search">
        <div
          className={
            "search-bar" + (this.state.visible ? "" : " search-bar-hidden")
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
              />
            ))}
          <SearchToggle
            onClick={() => this.toggleSearch()}
            visible={this.state.searchToggleVisible}
          >
            {this.state.searchToggleVisible ? (
              <EVAIcon name="arrow-ios-upward-outline" fill={variables.blanc} />
            ) : (
              <EVAIcon
                name="arrow-ios-downward-outline"
                fill={variables.noir}
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
                {filtre.name && t("AdvancedSearch." + filtre.name, filtre.name)}
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
                }}
                //popperClassName={"popper"}
              >
                {this.props.langues.map((elem) => {
                  if (elem.avancement > 0 && elem.langueCode !== "fr") {
                    return (
                      <div onClick={() => this.selectLanguage(elem)}>
                        <i
                          className={
                            "flag-icon ml-8 flag-icon-" + elem.langueCode
                          }
                          title={elem.langueCode}
                          id={elem.langueCode}
                        />
                        <LanguageText>{elem.langueFr || "Langue"}</LanguageText>
                      </div>
                    );
                  }
                })}
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
            {this.state.countShow +
              "/" +
              this.props.dispositifs.length +
              " " +
              t("AdvancedSearch.résultats", "résultats")}
          </FilterTitle>
          <FButton
            className={isRTL ? "ml-10" : ""}
            type="white"
            name="file-add-outline"
            onClick={this.writeNew}
            filter
          >
            {t("AdvancedSearch.Rédiger", "Rédiger")}
          </FButton>
        </FilterBar>
        <div
          className={"mt-250 search-wrapper"}
          style={{
            backgroundColor:
              this.state.activeTri === "Par thème" ? "#f1e8f5" : "#e4e5e6",
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
                  <ThemeContainer key={index} color={selectedTheme.lightColor}>
                    <ThemeHeader>
                      <ThemeButton color={selectedTheme.darkColor}>
                        <Streamline
                          name={selectedTheme.icon}
                          stroke={"white"}
                          width={22}
                          height={22}
                        />
                        <ThemeText>{selectedTheme.short}</ThemeText>
                      </ThemeButton>
                      <ThemeHeaderTitle color={selectedTheme.darkColor}>
                        {selectedTheme.name[0].toUpperCase() +
                          selectedTheme.name.slice(1)}
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
                        .filter((card, indexCard) => indexCard < 4)
                        .map((cardFiltered, indexCardFiltered) => {
                          return (
                            <SearchResultCard
                              key={indexCardFiltered}
                              pin={this.pin}
                              pinnedList={this.state.pinned}
                              dispositif={cardFiltered}
                            />
                          );
                        })}
                      <SeeMoreCard
                        seeMore={() => this.seeMore(selectedTheme)}
                        theme={selectedTheme}
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
                  {(langueCode !== "fr" || filterLanguage !== "") ? (
                    <>
                      {"Résultats disponibles en "}
                      <i
                        className={"flag-icon flag-icon-" + (filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                        title={(filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                        id={(filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                      />
                      <span className="ml-10 language-name">
                        {(filterLanguage !== "" ? filterLanguage.langueFr : current.langueFr) || "Langue"}
                      </span>
                      {" " + "avec le thème"}
                    </>
                  ) : (
                    "fiches avec le thème"[0].toUpperCase() +
                    "fiches avec le thème".slice(1)
                  )}
                </ThemeHeaderTitle>
                <ThemeButton
                  ml
                  color={selectedTag ? selectedTag.darkColor : null}
                >
                  <Streamline
                    name={selectedTag ? selectedTag.icon : null}
                    stroke={"white"}
                    width={22}
                    height={22}
                  />
                  <ThemeText>
                    {selectedTag ? selectedTag.short : null}
                  </ThemeText>
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
                {this.state.principalThemeList.length > 0 ? (
                  this.state.principalThemeList.map((dispositif, index) => {
                    return (
                      <SearchResultCard
                        key={index}
                        pin={this.pin}
                        pinnedList={this.state.pinned}
                        dispositif={dispositif}
                      />
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
                  {(langueCode !== "fr" || filterLanguage !== "")  ? (
                    <>
                      {"Autres fiches traduites en "}
                      <i
                        className={"flag-icon flag-icon-" + (filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                        title={(filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                        id={(filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                      />
                      <span className="ml-10 language-name">
                        {(filterLanguage !== "" ? filterLanguage.langueFr : current.langueFr) || "Langue"}
                      </span>
                      {" " + "avec le thème"}
                    </>
                  ) : (
                    "autres fiches avec le thème"[0].toUpperCase() +
                    "autres fiches avec le thème".slice(1)
                  )}
                </ThemeHeaderTitle>
                <ThemeButton
                  ml
                  color={selectedTag ? selectedTag.darkColor : null}
                >
                  <Streamline
                    name={selectedTag ? selectedTag.icon : null}
                    stroke={"white"}
                    width={22}
                    height={22}
                  />
                  <ThemeText>
                    {selectedTag ? selectedTag.short : null}
                  </ThemeText>
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
                {this.state.secondaryThemeList.length > 0 ? (
                  this.state.secondaryThemeList.map((dispositif, index) => {
                    return (
                      <SearchResultCard
                        key={index}
                        pin={this.pin}
                        pinnedList={this.state.pinned}
                        dispositif={dispositif}
                      />
                    );
                  })
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
              {(langueCode !== "fr" || filterLanguage !== "") ? (
                <>
                  <ThemeHeader>
                    <ThemeHeaderTitle color={"#828282"}>
                      <>
                        {"Résultats disponibles en "}
                        <i
                          className={"flag-icon flag-icon-" + (filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                          title={(filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                          id={(filterLanguage !== "" ? filterLanguage.langueCode :langueCode)}
                        />
                        <span className="ml-10 language-name">
                          {(filterLanguage !== "" ? filterLanguage.langueFr : current.langueFr) || "Langue"}
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
                          <SearchResultCard
                            key={index}
                            pin={this.pin}
                            pinnedList={this.state.pinned}
                            dispositif={dispositif}
                          />
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
                      {"Contenu pas traduit"}
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
                      this.state.nonTranslated.map((dispositif, index) => {
                        return (
                          <SearchResultCard
                            key={index}
                            pin={this.pin}
                            pinnedList={this.state.pinned}
                            dispositif={dispositif}
                          />
                        );
                      })
                    ) : (
                      <NoResultPlaceholder
                        restart={this.restart}
                        writeNew={this.writeNew}
                      />
                    )}
                  </ThemeListContainer>
                </>
              ) : (
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
                      <SearchResultCard
                        key={index}
                        pin={this.pin}
                        pinnedList={this.state.pinned}
                        dispositif={dispositif}
                      />
                    );
                  })}
                  {!showSpinner && [...pinned, ...dispositifs].length === 0 && (
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
              )}
            </ThemeContainer>
          )}
        </div>
        <BookmarkedModal
          t={this.props.t}
          success={this.props.user ? true : false}
          show={this.state.showBookmarkModal}
          toggle={this.toggleBookmarkModal}
        />
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
          fill={variables.grisFonce}
        />
      </div>
    )
  );
};

const mapStateToProps = (state) => {
  return {
    dispositifs: state.dispositif.dispositifs,
    languei18nCode: state.langue.languei18nCode,
    user: state.user.user,
    langues: state.langue.langues,
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

export default track({
  page: "AdvancedSearch",
})(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withSizes(mapSizesToProps)(withTranslation()(windowSize(AdvancedSearch))))
  )
);
