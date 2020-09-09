import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import {
  Col,
  Row,
  CardBody,
  CardFooter,
  Spinner,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Swal from "sweetalert2";
import querySearch from "stringquery";
import _ from "lodash";
import { NavHashLink } from "react-router-hash-link";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// import Cookies from 'js-cookie';

import SearchItem from "./SearchItem/SearchItem";
import API from "../../utils/API";
import { initial_data } from "./data";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import { filtres } from "../Dispositif/data";
import { filtres_contenu, tris } from "./data";
import { breakpoints } from "utils/breakpoints.js";

import "./AdvancedSearch.scss";
import variables from "scss/colors.scss";

let user = { _id: null, cookies: {} };
export class AdvancedSearch extends Component {
  state = {
    showSpinner: false,
    recherche: initial_data.map((x) => ({ ...x, active: false })),
    dispositifs: [],
    nbVues: [],
    pinned: [],
    activeFiltre: "",
    activeTri: "",
    data: [], //inutilisé, à remplacer par recherche quand les cookies sont stabilisés
    order: "created_at",
    croissant: true,
    filter: {},
    displayAll: true,
    dropdownOpenTri: false,
    dropdownOpenFiltre: false,
  };

  componentDidMount() {
    this.retrieveCookies();
    let tag = querySearch(this.props.location.search).tag;
    let filter = querySearch(this.props.location.search).filter;
    if (tag) {
      this.selectTag(decodeURIComponent(tag));
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

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.languei18nCode !== this.props.languei18nCode) {
      this.queryDispositifs(null, nextProps);
    }
  }

  queryDispositifs = (query = null, props = this.props) => {
    this.setState({ showSpinner: true });
    query =
      query ||
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
        dispositifs = dispositifs
          .map((x) => ({
            ...x,
            nbVues: (this.state.nbVues.find((y) => y._id === x._id) || {})
              .count,
          })) //Je rajoute la donnée sur le nombre de vues par dispositif
          .filter(
            (x) =>
              !this.state.pinned.some(
                (y) => (y && y._id === x._id) || y === x._id
              )
          );
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
          pinned: user.cookies.parkourPinned || [],
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

  pin = (e, dispositif) => {
    e.preventDefault();
    e.stopPropagation();
    dispositif.pinned = !dispositif.pinned;
    let prevState = [...this.state.dispositifs];
    this.setState(
      {
        dispositifs: dispositif.pinned
          ? prevState.filter((x) => x._id !== dispositif._id)
          : [...prevState, dispositif],
        pinned: dispositif.pinned
          ? [...this.state.pinned, dispositif]
          : this.state.pinned.filter((x) =>
              x && x._id ? x._id !== dispositif._id : x !== dispositif._id
            ),
      },
      () => {
        user.cookies.parkourPinned = [
          ...new Set(this.state.pinned.map((x) => (x && x._id) || x)),
        ];
        API.set_user_info(user);
      }
    );
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
      query: subitem.query || subitem.address_components || subitem.name,
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

  render() {
    let {
      recherche,
      dispositifs,
      pinned,
      showSpinner,
      activeFiltre,
      activeTri,
      displayAll,
    } = this.state;
    const { t, windowWidth, dispositifs: storeDispo } = this.props;
    const populatedPinned =
      storeDispo && storeDispo.length > 0
        ? pinned.map((x) => ({
            ...(x && x._id
              ? x
              : storeDispo.find((y) => y && y._id === x) || {}),
            pinned: true,
          })) || []
        : [];
    const filteredPinned = activeFiltre
      ? populatedPinned.filter((x) =>
          activeFiltre === "Dispositifs"
            ? x.typeContenu !== "demarche"
            : x.typeContenu === "demarche"
        )
      : populatedPinned;

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
        <div className="search-bar">
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
        <Row className="search-wrapper">
          {windowWidth >= breakpoints.smLimit && (
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
          )}
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
                {[...filteredPinned, ...dispositifs].map((dispositif) => {
                  if (!dispositif.hidden) {
                    let shortTag = null;
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
                          to={
                            "/" +
                            (dispositif.typeContenu || "dispositif") +
                            (dispositif._id ? "/" + dispositif._id : "")
                          }
                        >
                          <CustomCard
                            className={
                              dispositif.typeContenu === "demarche"
                                ? "texte-" + shortTag + " bg-light-" + shortTag + " border-" + shortTag
                                : "border-none"
                            }
                          >
                            <CardBody>
                              <EVAIcon
                                name="bookmark"
                                size="xlarge"
                                onClick={(e) => this.pin(e, dispositif)}
                                fill={
                                  dispositif.pinned
                                    ? variables.noir
                                    : variables.noirCD
                                }
                                className={
                                  "bookmark-icon" +
                                  (dispositif.pinned ? " pinned" : "")
                                }
                              />
                              <h5>{dispositif.titreInformatif}</h5>
                              <p>{dispositif.abstract}</p>
                            </CardBody>
                            {dispositif.typeContenu !== "demarche" && (
                              <CardFooter
                                className={
                                  "correct-radius align-right bg-" + shortTag
                                }
                              >
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
                  <Col
                    xs="12"
                    sm="6"
                    md="3"
                    className="no-result"
                    onClick={() => this.selectTag()}
                  >
                    <CustomCard className="no-result-card">
                      <CardBody>
                        <h5>{t("Aucun résultat", "Aucun résultat")}</h5>
                        <p>
                          {t(
                            "AdvancedSearch.Elargir recherche",
                            "Essayez d’élargir votre recherche en désactivant certains filtres"
                          )}{" "}
                        </p>
                      </CardBody>
                      <CardFooter className="align-right">
                        {t("AdvancedSearch.Oups", "Oups !")}...
                      </CardFooter>
                    </CustomCard>
                  </Col>
                )}
                <Col xs="12" sm="6" md="3">
                  <NavHashLink to="/comment-contribuer#ecrire">
                    <CustomCard addcard="true" className="create-card">
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
                </Col>
              </Row>
            </div>
          </Col>
          {windowWidth >= breakpoints.smLimit && (
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
          )}
        </Row>
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
  };
};

export default track({
  page: "AdvancedSearch",
})(connect(mapStateToProps)(withTranslation()(windowSize(AdvancedSearch))));
