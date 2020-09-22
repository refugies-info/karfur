import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import {
  Col,
  Row,
  CardBody,
  CardFooter,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Swal from "sweetalert2";
import querySearch from "stringquery";
import qs from "query-string";
import _ from "lodash";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import styled from "styled-components";
import produce from "immer";
// import Cookies from 'js-cookie';

import SearchItem from "./SearchItem/SearchItem";
import API from "../../utils/API";
import { initial_data } from "./data";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import { filtres } from "../Dispositif/data";
import { filtres_contenu, tris } from "./data";
import { breakpoints } from "utils/breakpoints.js";
import Streamline from "../../assets/streamline";
import FButton from "../../components/FigmaUI/FButton/FButton";
import TagButton from "../../components/FigmaUI/TagButton/TagButton";
import NoResultsBackgroundImage from "../../assets/no_results.svg";
import { BookmarkedModal } from "../../components/Modals/index";
import { fetchUserActionCreator } from "../../services/User/user.actions";

import "./AdvancedSearch.scss";
import variables from "scss/colors.scss";

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${NoResultsBackgroundImage});
  min-width: 254px;
  height: 180px;
  margin-right: 75px;
`;

const NoResultsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResultsButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const NoResultsTitle = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 24px !important;
`;

const NoResultsText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px !important;
  margin-bottom: 24px !important;
  max-width: 520px;
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
  justify-content: space-evenly;
  background-color: #828282;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.25);
  position: fixed;
  border-radius: 0px 0px 8px 8px;
  padding: 5px 0px;
  width: 80%;
  display: flex;
  z-index: 2;
  top: ${(props) =>
    props.visibleTop && props.visibleSearch
      ? "160px"
      : !props.visibleTop && props.visibleSearch
      ? "88px"
      : props.visibleTop && !props.visibleSearch
      ? "88px"
      : "-15px"};
  transition: top 0.6s;
  height: 80px;
`;

const FilterTitle = styled.p`
  size: 18px;
  font-weight: bold;
  color: white;
`;

let user = { _id: null, cookies: {} };
export class AdvancedSearch extends Component {
  state = {
    showSpinner: false,
    recherche: initial_data.map((x) => ({ ...x, active: false })),
    dispositifs: [],
    nbVues: [],
    pinned: [],
    //activeFiltre: "",
    //activeTri: "",
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
  };

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    //const visible = prevScrollpos > currentScrollPos;
    const visible = currentScrollPos < 70;

    this.setState({
      visible,
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
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
            draft.recherche[0].query = decodeURIComponent(tag);
            draft.recherche[0].value = decodeURIComponent(tag);
            draft.recherche[0].active = true;
            draft.recherche[0].short =
              filtres.tags &&
              filtres.tags.find((x) => x.name === decodeURIComponent(tag))
                .short;
          }
          if (topValue && bottomValue) {
            draft.recherche[1].value = initial_data[2].children.find(
              (item) => item.topValue === parseInt(topValue, 10)
            ).name;
            draft.recherche[1].query = draft.recherche[2].value;
            draft.recherche[1].active = true;
          }
          if (niveauFrancais) {
            draft.recherche[2].name = decodeURIComponent(niveauFrancais);
            draft.recherche[2].value = decodeURIComponent(niveauFrancais);
            draft.recherche[2].query = niveauFrancaisObj.query;
            draft.recherche[2].active = true;
          }
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
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.languei18nCode !== this.props.languei18nCode) {
      this.queryDispositifs(null, nextProps);
    }
  }

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
    const localisationSearch = this.state.recherche.find(
      (x) => x.queryName === "localisation" && x.value
    );
    if (!Nquery) {
      let newQueryParam = {
        tag: query["tags.name"] ? query["tags.name"] : undefined,
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

    /*     (query["tags.name"] ? `?tag=${this.state.recherche[0].short}` : "") +
    (query["audienceAge.bottomValue"]
      ? `?bottomValue=${this.state.recherche[2].bottomValue}`
      : "") +
    (query["audienceAge.topValue"]
      ? `?topValue=${this.state.recherche[2].topValue}`
      : "") +
    (query["niveauFrancais"]
      ? `?niveauFrancais=${this.state.recherche[3].value}`
      : ""), */

    API.get_dispositif({
      query: {
        ...query,
        ...this.state.filter,
        status: "Actif",
        ...(!localisationSearch && { demarcheId: { $exists: false } }),
      },
      locale: props.languei18nCode,
    })
      .then((data_res) => {
        let dispositifs = data_res.data.data;
        if (query["tags.name"]) {
          //On réarrange les résultats pour avoir les dispositifs dont le tag est le principal en premier
          dispositifs = dispositifs.sort(
            (a, b) =>
              a.tags.findIndex((x) =>
                x ? x.short === query["tags.name"] : 99
              ) -
              b.tags.findIndex((x) => (x ? x.short === query["tags.name"] : 99))
          );
        }
        if (localisationSearch) {
          //On applique le filtre géographique maintenant
          dispositifs = dispositifs.filter(
            (x) =>
              x.typeContenu !== "demarche" ||
              !(x.variantes || []).some((y) => y.villes) ||
              x.variantes.some((y) =>
                y.villes.some(
                  (z) =>
                    !z.address_components.some(
                      (ad) =>
                        !localisationSearch.query.some(
                          (lq) => lq.long_name === ad.long_name
                        ) //On compare seulement les noms, il faudrait idéalement rajouter le type aussi mais la comparaison des Arrays me paraît lourde
                    )
                )
              )
          );
          const filterDoubles = [
            ...new Set(dispositifs.map((x) => x.demarcheId || x._id)),
          ]; //Je vire les doublons créés par les variantes
          dispositifs = filterDoubles.map((x) =>
            dispositifs.find((y) => y.demarcheId === x || y._id === x)
          );
        }
        dispositifs = dispositifs.map((x) => ({
          ...x,
          nbVues: (this.state.nbVues.find((y) => y._id === x._id) || {}).count,
        })); //Je rajoute la donnée sur le nombre de vues par dispositif

        this.setState({ dispositifs: dispositifs, showSpinner: false });
      })
      .catch(() => this.setState({ showSpinner: false }));
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
    }));
    this.queryDispositifs({ "tags.name": tagValue.name });
    // this.props.history.replace("/advanced-search?tag="+tag)
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
  };

  filter_content = (filtre) => {
    const filter = this.state.activeFiltre === filtre.name ? {} : filtre.query;
    const activeFiltre =
      this.state.activeFiltre === filtre.name ? "" : filtre.name;
    this.setState({ filter, activeFiltre }, () => this.queryDispositifs());
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
    this.setState({ recherche: recherche }, () => this.queryDispositifs());
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
  toggleSearch = () =>
    this.setState({ searchToggleVisible: !this.state.searchToggleVisible });

  render() {
    let {
      recherche,
      dispositifs,
      pinned,
      showSpinner,
      //activeFiltre,
      //activeTri,
      displayAll,
    } = this.state;
    // eslint-disable-next-line
    const { t, windowWidth, dispositifs: storeDispo } = this.props;

    if (recherche[0].active) {
      dispositifs = dispositifs.sort((a, b) =>
        _.get(a, "tags.0.name", {}) === recherche[0].query
          ? -1
          : _.get(b, "tags.0.name", {}) === recherche[0].query
          ? 1
          : 0
      );
    }

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
                key={i}
                item={d}
                keyValue={i}
                selectParam={this.selectParam}
                desactiver={this.desactiver}
              />
            ))}
          <SearchToggle
            onClick={this.toggleSearch}
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
            show={windowWidth < breakpoints.smLimit}
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
          <FilterTitle>Filtrer Par</FilterTitle>
          {filtres_contenu.map((filtre, idx) => (
            <TagButton key={idx} filter onClick={() => this.filter_content(filtre)}>
              {filtre.name && t("AdvancedSearch." + filtre.name, filtre.name)}
            </TagButton>
          ))}
          <TagButton filter>{"Traduction"}</TagButton>
          <FilterTitle>Trier Par</FilterTitle>
          {tris.map((tri, idx) => (
            <TagButton key={idx} filter onClick={() => this.reorder(tri)}>
              {t("AdvancedSearch." + tri.name, tri.name)}
            </TagButton>
          ))}
          <FilterTitle>résultats</FilterTitle>
          <FButton type="white" name="file-add-outline" onClick={this.writeNew}>
            Rédiger
          </FButton>
        </FilterBar>
        <Row className="search-wrapper">
          {/* {windowWidth >= breakpoints.smLimit && (
            <Col xl="2" lg="2" md="2" sm="2" xs="2" className="mt-250 side-col">
              {windowWidth >= breakpoints.desktopUp && (
                <EVAIcon
                  name="options-2-outline"
                  fill={variables.noir}
                  className="mr-12"
                />
              )}
              <div className="right-side">
                {windowWidth >= breakpoints.desktopUp ? (
                  <b>{t("AdvancedSearch.Trier par", "Trier par :")}</b>
                ) : (
                  <EVAIcon name="options-2-outline" fill={variables.noir} />
                )}
                <div className="mt-10 side-options">
                  {tris.map((tri, idx) => (
                    <div
                      key={idx}
                      className={
                        "side-option" +
                        (tri.name === activeTri ? " active" : "")
                      }
                      onClick={() => this.reorder(tri)}
                    >
                      {t("AdvancedSearch." + tri.name, tri.name)}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          )} */}
          <Col
            xl="8"
            lg="8"
            md="8"
            sm="8"
            xs="12"
            className="mt-250 central-col"
          >
            <div className="results-wrapper">
              <Row>
                {[...dispositifs].map((dispositif) => {
                  const pinned =
                    this.state.pinned.includes(dispositif._id) ||
                    this.state.pinned.filter(
                      (pinnedDispostif) =>
                        pinnedDispostif &&
                        pinnedDispostif._id === dispositif._id
                    ).length > 0;

                  if (!dispositif.hidden) {
                    let shortTag = null;
                    let shortTagFull = null;
                    let iconTag = null;
                    if (
                      dispositif.tags &&
                      dispositif.tags.length > 0 &&
                      dispositif.tags[0] &&
                      dispositif.tags[0].short
                    ) {
                      shortTag = (dispositif.tags[0].short || {}).replace(
                        / /g,
                        "-"
                      );
                      shortTagFull = dispositif.tags[0].short;
                    }
                    if (shortTagFull) {
                      iconTag = filtres.tags.find(
                        (tag) => tag.short === shortTagFull
                      );
                    }
                    return (
                      <Col
                        xl="3"
                        lg="3"
                        md="4"
                        sm="6"
                        xs="12"
                        className={
                          "card-col puff-in-center " +
                          (dispositif.typeContenu || "dispositif")
                        }
                        key={dispositif._id}
                      >
                        <NavLink
                          to={{
                            pathname:
                              "/" +
                              (dispositif.typeContenu || "dispositif") +
                              (dispositif._id ? "/" + dispositif._id : ""),
                            state: { previousRoute: "advanced-search" },
                          }}
                        >
                          <CustomCard
                            className={
                              dispositif.typeContenu === "demarche"
                                ? "texte-" +
                                  shortTag +
                                  " bg-light-" +
                                  shortTag +
                                  " border-" +
                                  shortTag
                                : "border-none"
                            }
                          >
                            <CardBody>
                              <EVAIcon
                                name="bookmark"
                                size="xlarge"
                                onClick={(e) => this.pin(e, dispositif)}
                                fill={
                                  pinned ? variables.noir : variables.noirCD
                                }
                                className={
                                  "bookmark-icon" + (pinned ? " pinned" : "")
                                }
                              />
                              <h5>{dispositif.titreInformatif}</h5>
                              <p>{dispositif.abstract}</p>
                            </CardBody>
                            {dispositif.typeContenu !== "demarche" && (
                              <CardFooter
                                className={
                                  "correct-radius align-right bg-" +
                                  shortTag +
                                  (iconTag ? "" : " no-icon")
                                }
                              >
                                {iconTag ? (
                                  <div
                                    style={{
                                      width: 50,
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <Streamline
                                      name={iconTag.icon}
                                      stroke={"white"}
                                      width={22}
                                      height={22}
                                    />
                                  </div>
                                ) : null}
                                {dispositif.titreMarque}
                              </CardFooter>
                            )}
                          </CustomCard>
                        </NavLink>
                      </Col>
                    );
                  }
                  return false;
                })}
                {!showSpinner && [...pinned, ...dispositifs].length === 0 && (
                  /*             <Col
                    xs="12"
                    sm="6"
                    md="3"
                    className="no-result"
                    onClick={() => this.selectTag()}
                  > */
                  <NoResultsContainer>
                    <NoResults />
                    <NoResultsTextContainer>
                      <NoResultsTitle>
                        {t("Aucun résultat", "Aucun résultat")}
                      </NoResultsTitle>
                      <NoResultsText>
                        {t(
                          "AdvancedSearch.Elargir recherche",
                          "Il n’existe aucune fiche correspondant aux critères sélectionnés. Essayez d’élargir votre recherche en retirant des critères."
                        )}{" "}
                      </NoResultsText>
                      <NoResultsButtonsContainer>
                        <FButton
                          type="dark"
                          name="refresh-outline"
                          className="mr-10"
                          onClick={this.restart}
                        >
                          Recommencer
                        </FButton>
                        <FButton
                          type="white"
                          name="file-add-outline"
                          onClick={this.writeNew}
                        >
                          Rédiger une nouvelle fiche
                        </FButton>
                      </NoResultsButtonsContainer>
                    </NoResultsTextContainer>
                  </NoResultsContainer>
                  //  </Col>
                )}
                {/*      <Col xs="12" sm="6" md="3">
                  <NavHashLink to="/comment-contribuer#ecrire">
                    <CustomCard
                      addcard="true"
                      className="create-card border-none"
                    >
                      <CardBody>
                        {showSpinner ? (
                          <Spinner color="success" />
                        ) : (
                          <span className="add-sign">+</span>
                        )}
                      </CardBody>
                      <CardFooter className="align-right">
                        {showSpinner
                          ? t("Chargement", "Chargement") + "..."
                          : t(
                              "AdvancedSearch.Créer une fiche",
                              "Créer une fiche"
                            )}
                      </CardFooter>
                    </CustomCard>
                  </NavHashLink>
                </Col> */}
              </Row>
            </div>
          </Col>
          {/*           {windowWidth >= breakpoints.smLimit && (
            <Col xl="2" lg="2" md="2" sm="2" xs="2" className="mt-250 side-col">
              {windowWidth >= breakpoints.desktopUp && (
                <EVAIcon
                  name="funnel-outline"
                  fill={variables.noir}
                  className="mr-12"
                />
              )}
              <div className="right-side">
                {windowWidth >= breakpoints.desktopUp ? (
                  <b>{t("AdvancedSearch.Filtrer par", "Filtrer par :")}</b>
                ) : (
                  <EVAIcon name="funnel-outline" fill={variables.noir} />
                )}
                <div className="mt-10 side-options">
                  {filtres_contenu.map((filtre, idx) => (
                    <div
                      key={idx}
                      className={
                        "side-option right" +
                        (filtre.name === activeFiltre ? " active" : "")
                      }
                      onClick={() => this.filter_content(filtre)}
                    >
                      {filtre.name &&
                        t("AdvancedSearch." + filtre.name, filtre.name)}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          )} */}
        </Row>
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
  };
};

const mapDispatchToProps = {
  fetchUser: fetchUserActionCreator,
};

export default track({
  page: "AdvancedSearch",
})(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(windowSize(AdvancedSearch)))
  )
);
