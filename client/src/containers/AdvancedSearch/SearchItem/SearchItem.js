import React, { Component } from "react";
import { withTranslation } from "next-i18next";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import Autocomplete from "react-google-autocomplete";
import FSearchBtn from "components/FigmaUI/FSearchBtn/FSearchBtn";
import Streamline from "assets/streamline";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./SearchItem.module.scss";
import fsb_styles from "components/FigmaUI/FSearchBtn/FSearchBtn.module.scss"
import { withRouter } from "next/router";

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
    if (
      this.state.ville === "" &&
      this.props.item.queryName === "localisation" &&
      this.props.item.value
    ) {
      this.setState({
        ville: this.props.item.value,
        villeAuto: this.props.item.value,
      });
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
    const isRTL = ["ar", "ps", "fa"].includes(this.props.router.locale);

    return (
      <div className={styles.search_col}>
        <span className={"mr-10 " + styles.title}>
          {t("SearchItem." + item.title, item.title)}
        </span>
        {item.queryName === "localisation" && ville !== "" && this.props.geoSearch ? (
            <FSearchBtn
              inHeader
              extraPadding
              active={item.active}
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
        ) : item.queryName === "localisation" && ville === "" && this.props.geoSearch ? (
          isMounted && (
            <div className="position-relative">
              <Autocomplete
                apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || ""}
                ref={(input) => {
                  input && input.refs.input.focus();
                }}
                className={[
                      fsb_styles.search_btn,
                      fsb_styles.extra_padding,
                      fsb_styles.in_header,
                      styles.search_autocomplete,
                      (item.active ? fsb_styles.active : "")
                  ].join(" ")
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
                options={{
                  componentRestrictions: { country: "fr" }
                }}
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
          )
        ) : item.queryName === "localisation" && !this.props.geoSearch ? (
          <FSearchBtn
                inHeader
                extraPadding
            onClick={() => { this.props.switchGeoSearch(true) }}
          >
            {t("SearchItem.ma ville", "ma ville")}
          </FSearchBtn>
        ) : (
          <Dropdown
            isOpen={dropdownOpen}
            toggle={this.toggle}
            className="inline-block"
          >
            <DropdownToggle
              caret={false}
              tag="div"
              //data-toggle="none"
              aria-haspopup={false}
              aria-expanded={dropdownOpen}
              className={[
                fsb_styles.search_btn,
                fsb_styles.extra_padding,
                fsb_styles.in_header,
                (item.short && item.active ? "bg-" + item.short.split(" ").join("-") : ""),
                (!item.short && item.active ? fsb_styles.active : "")
              ].join(" ")
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
            <DropdownMenu className={styles.dropdown}>
              <div
                className={
                  [styles.options,
                  (item.queryName === "tags.name" ? styles.tags : "")].join(" ")
                }
              >
                {item.children &&
                  item.children.map((subi, idx) => {
                    return (
                      <FSearchBtn
                        key={idx}
                        onClick={() => this.selectOption(subi)}
                        filter={!subi.short}
                        searchOption
                        inHeader
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

export default withRouter(withTranslation()(SearchItem));
