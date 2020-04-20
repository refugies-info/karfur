import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import ReactDependentScript from "react-dependent-script";
import Autocomplete from "react-google-autocomplete";
import styled from "styled-components";

import FSearchBtn from "../../components/FigmaUI/FSearchBtn/FSearchBtn";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import ReactCardFlip from "react-card-flip";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import variables from "scss/colors.scss";

//import "./SearchItem.scss";
// import variables from 'scss/colors.scss';

const ThemeButton = styled.div`
  display: block;
  background-color: blue;
  position: absolute;
  border-radius: 10px;
  text-align: center;
`;

const ThemeButtonR = styled.div`
  display: block;
  background-color: red;
  position: absolute;
  border-radius: 10px;
  text-align: center;
`;

export class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      isMounted: false,
      flip: true,
      isFlipped: false,
      indexF: 0,
      indexB: 1,
      index: 0,
    };
    this.selectParam = this.onPlaceSelected.bind(this); //Placé ici pour être reconnu par les tests unitaires
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    setTimeout(() => {
      if (this.flippy) {
        this.flippy.toggle();
        setTimeout(() => {
          this.setState({
            indexF: this.state.indexF === 10 ? 0 : this.state.indexF + 2,
          });
          // do second thing
        }, 1000);
      }
      // this.setState({indexF: this.state.indexF + 2})
    }, 2000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.flip === true && prevState.indexF !== this.state.indexF) {
      setTimeout(() => {
        if (this.flippy) {
          this.flippy.toggle();
          setTimeout(() => {
            if (this.state.indexB === 9) {
              this.setState({ indexB: 1 });
            } else {
              this.setState({ indexB: this.state.indexB + 2 });
            }
            // do second thing
          }, 1000);
        }
      }, 2000);
    }
    if (
      this.state.flip === true &&
      (prevState.indexB !== this.state.indexB ||
        prevState.flip !== this.state.flip)
    ) {
      setTimeout(() => {
        if (this.flippy) {
          this.flippy.toggle();
          setTimeout(() => {
            if (this.state.indexF === 10) {
              this.setState({ indexF: 0 });
            } else {
              this.setState({ indexF: this.state.indexF + 2 });
            }
            // do second thing
          }, 1000);
        }
      }, 2000);
    }
  }

  onPlaceSelected(place) {
    this.setState({ ville: place.formatted_address });
    this.props.selectParam(this.props.keyValue, place);
  }

  toggle = () =>
    this.setState((prevState) => {
      return { dropdownOpen: !prevState.dropdownOpen };
    });
  handleChange = (e) => this.setState({ [e.currentTarget.id]: e.target.value });

  selectOption = (subi) => {
    this.props.selectParam(this.props.keyValue, subi);
    this.toggle();
  };

  open = (e) => {
    e.preventDefault();
    this.setState({ flip: false });
    this.props.togglePopup();
  };

  close = (e) => {
    e.preventDefault();
    this.setState({ flip: true });
    this.props.togglePopup();
  };

  render() {
    const { t, item, keyValue } = this.props;
    const { dropdownOpen, isMounted, ville } = this.state;
    console.log(this.state, item);

    return (
      <div className="search-col">
        <span className="mr-10">
          {t("SearchItem." + item.title, item.title)}
        </span>
        {this.state.flip ? (
          <Flippy
            flipOnClick={false}
            flipDirection="vertical" // horizontal or vertical
            ref={(r) => (this.flippy = r)} // to use toggle method like this.flippy.toggle()
            // if you pass isFlipped prop component will be controlled component.
            // and other props, which will go to div
            style={{ width: "250px", height: "50px" }} /// these are optional style, it is not necessary
          >
            <FrontSide
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "250px",
                height: "50px",
                borderRadius: 10,
              }}
            >
              {item.children.map((subi, idx) => {
                if (idx === this.state.indexF) {
                  console.log(subi.darkColor);
                  return (
                    <div
                      onClick={this.open}
                      className={
                        "search-home " +
                        "bg-" +
                        (subi.short || "").replace(/ /g, "-")
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        borderRadius: 10,
                        padding: 0,
                      }}
                    >
                      {t("Tags." + subi.name, subi.name)}
                    </div>
                  );
                }
              })}
            </FrontSide>
            <BackSide
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "250px",
                height: "50px",
                borderRadius: 10,
              }}
            >
              {item.children.map((subi, idx) => {
                if (idx === this.state.indexB) {
                  console.log(subi.illustrationColor);
                  return (
                    <div
                      onClick={this.open}
                      className={
                        "search-home " +
                        "bg-" +
                        (subi.short || "").replace(/ /g, "-")
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        borderRadius: 10,
                        padding: 0,
                      }}
                    >
                      {t("Tags." + subi.name, subi.name)}
                    </div>
                  );
                }
              })}
            </BackSide>
          </Flippy>
        ) : (
          <div
            onClick={this.close}
            className={"search-home"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              flexDirection: "row",
              borderRadius: 10,
              padding: 10,
              backgroundColor: variables.grisFonce,
            }}
          >
            <EVAIcon name="search-outline" size="medium" />
            {item.value
              ? t("Tags." + item.value, item.value)
              : t("Tags." + item.placeholder, item.placeholder)}
          </div>
        )}
        {/*<Dropdown isOpen={dropdownOpen} toggle={this.toggle} className="display-inline-block">
            <DropdownToggle
              caret
              tag="div"
              data-toggle="dropdown"
              aria-expanded={dropdownOpen}
              className={"search-btn in-header " + (item.short && item.active ? ("bg-" + item.short.split(" ").join("-")) : "") + (!item.short && item.active ? "active" : "")}
            >
              {item.value ? t("Tags." + item.value, item.value) : t("Tags." + item.placeholder, item.placeholder)}
              {item.active && 
                <EVAIcon name="close-circle" size="xlarge" className="close-icon" onClick={e => {e.stopPropagation(); this.props.desactiver(keyValue)}} />}
            </DropdownToggle>
            <DropdownMenu>
              <div className="options-wrapper">
                {item.children.map((subi, idx) => {
                  return(
                  <FSearchBtn 
                    key={idx} 
                    onClick={()=> this.selectOption(subi)}
                    className={"search-options color" + (subi.short ? "": " full")}
                    color={(subi.short || '').replace(/ /g, "-")} 
                  >
                    {t("Tags." + subi.name, subi.name)}
                  </FSearchBtn>
                )})}
              </div>
            </DropdownMenu>
          </Dropdown> */}
        {item.title2 && (
          <span className="ml-10">
            {t("SearchItem." + item.title2, item.title2)}
          </span>
        )}
      </div>
    );
  }
}

export default withTranslation()(SearchItem);
