import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { colors } from "colors";
import Streamline from "../../assets/streamline";
import Ripples from "react-ripples";
import i18n from "../../i18n";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

const IconContainer = styled.div`
  display: flex;
  margin-right: ${(props) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props) => (props.isRTL ? "10px" : "0px")};
  justify-content: center;
  align-items: center;
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
    }, 1500);
  }

  componentDidUpdate(_, prevState) {
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
      }, 1500);
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
      }, 1500);
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
    if (isMobile) {
      this.props.history.push({
        pathname: "/advanced-search",
        state: { showTagModal: true },
      });
    } else {
      if (this.state.flip) {
        this.setState({ flip: false });
      } else {
        this.setState({ flip: true });
      }
      this.props.togglePopup();
      this.props.toggleOverlay();
    }
  };

  close = (e) => {
    e.preventDefault();
    this.setState({ flip: true });
    this.props.togglePopup();
    this.props.toggleOverlay();
  };

  render() {
    const { t, item } = this.props;
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

    return (
      <button onClick={this.open} className={"search-col"}>
        <span className="mr-10 mb-15">
          {t("SearchItem." + item.title, item.title)}
        </span>
        {this.state.flip ? (
          <Flippy
            flipOnClick={false}
            flipDirection="vertical" // horizontal or vertical
            ref={(r) => (this.flippy = r)} // to use toggle method like this.flippy.toggle()
            // if you pass isFlipped prop component will be controlled component.
            // and other props, which will go to div
            style={{ width: "280px", height: "50px" }} /// these are optional style, it is not necessary
          >
            <FrontSide
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "280px",
                height: "50px",
                borderRadius: 10,
              }}
            >
              {item.children.map((subi, idx) => {
                if (idx === this.state.indexF) {
                  return (
                    <button
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
                        flexDirection: "row",
                        borderRadius: 10,
                        padding: 0,
                        fontWeight: 600,
                      }}
                    >
                      {subi.icon ? (
                        <IconContainer isRTL={isRTL}>
                          <Streamline
                            name={subi.icon}
                            stroke={"white"}
                            width={22}
                            height={22}
                          />
                        </IconContainer>
                      ) : null}
                      {t("Tags." + subi.name, subi.name)}
                    </button>
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
                width: "280px",
                height: "50px",
                borderRadius: 10,
              }}
            >
              {item.children.map((subi, idx) => {
                if (idx === this.state.indexB) {
                  return (
                    <button
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
                        flexDirection: "row",
                        borderRadius: 10,
                        padding: 0,
                        fontWeight: 600,
                      }}
                    >
                      {subi.icon ? (
                        <IconContainer isRTL={isRTL}>
                          <Streamline
                            name={subi.icon}
                            stroke={"white"}
                            width={22}
                            height={22}
                          />
                        </IconContainer>
                      ) : null}
                      {t("Tags." + subi.name, subi.name)}
                    </button>
                  );
                }
              })}
            </BackSide>
          </Flippy>
        ) : (
          <Ripples>
            <button
              onClick={this.close}
              className={"search-home"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: 10,
                backgroundColor: colors.grisFonce,
                fontWeight: "600",
              }}
            >
              <IconContainer isRTL={isRTL}>
                <Streamline name="search" width={20} height={20} />
              </IconContainer>
              {item.value
                ? t("Tags." + item.value, item.value)
                : t("Tags." + item.placeholder, item.placeholder)}
            </button>
          </Ripples>
        )}

        {item.title2 && (
          <span className="ml-10">
            {t("SearchItem." + item.title2, item.title2)}
          </span>
        )}
      </button>
    );
  }
}

export default withTranslation()(SearchItem);
