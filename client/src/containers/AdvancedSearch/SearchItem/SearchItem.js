import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import ReactDependentScript from "react-dependent-script";
import Autocomplete from "react-google-autocomplete";

import FSearchBtn from "../../../components/FigmaUI/FSearchBtn/FSearchBtn";
import Streamline from "../../../assets/streamline";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import i18n from "../../../i18n";

import "./SearchItem.scss";
// import variables from 'scss/colors.scss';

export class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.selectParam = this.onPlaceSelected.bind(this); //Placé ici pour être reconnu par les tests unitaires
  }
  state = {
    dropdownOpen: false,
    isMounted: false,
    ville: "",
    villeAuto: "",
  };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentDidUpdate(prevProps) {
    if (this.props.geoSearch !== prevProps.geoSearch && !this.props.geoSearch) {
      this.setState({ ville: "", villeAuto: "" });
    }
  }

  onPlaceSelected = (place) => {
    if (place.formatted_address) {
      this.setState({ ville: place.formatted_address });
      this.props.selectParam(this.props.keyValue, place);
    }
  };

  toggle = () =>
    this.setState((prevState) => {
      return { dropdownOpen: !prevState.dropdownOpen };
    });
  handleChange = (e) => this.setState({ [e.currentTarget.id]: e.target.value });
  initializeVille = () => this.setState({ ville: "", villeAuto: "" });

  selectOption = (subi) => {
    this.props.selectParam(this.props.keyValue, subi);
    this.toggle();
  };

  render() {
    const { t, item, keyValue, isBigDesktop } = this.props;
    const { dropdownOpen, isMounted, ville, villeAuto } = this.state;
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

    return (
      <div className="search-col">
        <span
          className={
            "mr-10 " + (isBigDesktop ? "search-title" : "search-title-small")
          }
        >
          {t("SearchItem." + item.title, item.title)}
        </span>
        {item.queryName === "localisation" &&
        ville !== "" &&
        this.props.geoSearch ? (
          <FSearchBtn
            className={
              "mr-10 in-header search-filter " +
              (isBigDesktop ? "search-btn " : "search-btn-small ") +
              (item.active ? "active " : "")
            }
          >
            {ville
              ? ville.slice(0, 20) + (ville.length > 20 ? "..." : "")
              : null}
            {item.active && (
              <EVAIcon
                name="close-outline"
                size="large"
                className="ml-10"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.desactiver(keyValue);
                  this.initializeVille();
                }}
              />
            )}
          </FSearchBtn>
        ) : item.queryName === "localisation" &&
          ville === "" &&
          this.props.geoSearch ? (
          isMounted && (
            <ReactDependentScript
              loadingComponent={<div>Chargement de Google Maps...</div>}
              scripts={[
                "https://maps.googleapis.com/maps/api/js?key=" +
                  process.env.REACT_APP_GOOGLE_API_KEY +
                  "&v=3.exp&libraries=places&language=fr&region=FR",
              ]}
            >
              <div className="position-relative">
                <Autocomplete
                  ref={(input) => {
                    input && input.refs.input.focus();
                  }}
                  className={
                    "search-btn in-header search-autocomplete " +
                    (item.active ? "active " : "") +
                    (isBigDesktop ? "" : "search-btn-small")
                  }
                  onBlur={() =>
                    ville === "" &&
                    villeAuto === "" &&
                    this.props.switchGeoSearch(false)
                  }
                  placeholder={item.placeholder}
                  id="villeAuto"
                  value={villeAuto}
                  onChange={this.handleChange}
                  onPlaceSelected={this.onPlaceSelected}
                  types={["(regions)"]}
                  componentRestrictions={{ country: "fr" }}
                />
                {item.active && (
                  <EVAIcon
                    name="close-outline"
                    size="large"
                    className="ml-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.props.desactiver(keyValue);
                      this.initializeVille();
                    }}
                  />
                )}
              </div>
            </ReactDependentScript>
          )
        ) : item.queryName === "localisation" && !this.props.geoSearch ? (
          <FSearchBtn
            onClick={() => {
              this.props.switchGeoSearch(true);
            }}
            className={
              "mr-10 in-header search-filter " +
              (isBigDesktop ? "search-btn " : "search-btn-small ")
            }
          >
            {"ma ville"}
          </FSearchBtn>
        ) : (
          <Dropdown
            isOpen={dropdownOpen}
            toggle={this.toggle}
            className="display-inline-block"
          >
            <DropdownToggle
              caret={false}
              tag="div"
              //data-toggle="none"
              aria-haspopup={false}
              aria-expanded={dropdownOpen}
              className={
                "search-btn in-header search-filter " +
                (item.short && item.active
                  ? "bg-" + item.short.split(" ").join("-")
                  : "") +
                (!item.short && item.active ? "active " : "") +
                (isBigDesktop ? "" : " search-btn-small")
              }
            >
              {item.active && item.placeholder === "thème" && (
                <div
                  style={{
                    display: "flex",
                    marginRight: isRTL ? 0 : 10,
                    marginLeft: isRTL ? 10 : 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Streamline
                    name={item.icon}
                    stroke={"white"}
                    width={22}
                    height={22}
                  />
                </div>
              )}
              {item.value
                ? t("Tags." + item.value, item.value)
                : t("Tags." + item.placeholder, item.placeholder)}
              {item.active ? (
                <EVAIcon
                  name="close-outline"
                  size="large"
                  className="ml-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.props.desactiver(keyValue);
                  }}
                />
              ) : (
                <EVAIcon
                  name="arrow-ios-downward-outline"
                  size="large"
                  className="ml-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.toggle();
                  }}
                />
              )}
            </DropdownToggle>
            <DropdownMenu>
              <div
                className={
                  "options-wrapper" +
                  (item.queryName === "tags.name" ? " query-tags" : "")
                }
              >
                {item.children &&
                  item.children.map((subi, idx) => {
                    return (
                      <FSearchBtn
                        key={idx}
                        onClick={() => this.selectOption(subi)}
                        className={
                          "search-options color" + (subi.short ? "" : " filter")
                        }
                        color={(subi.short || "").replace(/ /g, "-")}
                      >
                        {subi.icon ? (
                          <div
                            style={{
                              display: "flex",
                              marginRight: isRTL ? 0 : 10,
                              marginLeft: isRTL ? 10 : 0,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Streamline
                              name={subi.icon}
                              stroke={"white"}
                              width={22}
                              height={22}
                            />
                          </div>
                        ) : null}
                        {t("Tags." + subi.name, subi.name)}
                      </FSearchBtn>
                    );
                  })}
              </div>
            </DropdownMenu>
          </Dropdown>
        )}
        {/* {item.title2 && (
          <span className="ml-10">
            {t("SearchItem." + item.title2, item.title2)}
          </span>
        )} */}
      </div>
    );
  }
}

export default withTranslation()(SearchItem);
