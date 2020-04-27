import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import ReactDependentScript from "react-dependent-script";
import Autocomplete from "react-google-autocomplete";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import FSearchBtn from "../../components/FigmaUI/FSearchBtn/FSearchBtn";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import ReactCardFlip from "react-card-flip";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import FButton from "../../components/FigmaUI/FButton/FButton";
import { NavLink } from "react-router-dom";
import variables from "scss/colors.scss";
import icons from "../../assets/streamline";
import Streamline from "../../assets/streamline";
import { motion } from "framer-motion";

//import "./SearchItem.scss";
// import variables from 'scss/colors.scss';

const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemanim = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

class CatList extends Component {
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

  componentDidMount() {}

  onPlaceSelected(place) {
    this.setState({ ville: place.formatted_address });
    this.props.selectParam(this.props.keyValue, place);
  }

  toggle = () =>
    this.setState((prevState) => {
      return { dropdownOpen: !prevState.dropdownOpen };
    });
  handleChange = (e) => this.setState({ [e.currentTarget.id]: e.target.value });
  initializeVille = () => this.setState({ ville: "" });

  componentDidUpdate(prevProps, prevState) {}

  close = (e) => {
    e.preventDefault();
    this.setState({ flip: true });
  };

  selectOption = (subi) => {
    this.props.selectParam(this.props.keyValue, subi);
    this.toggle();
  };

  render() {
    const { t, item, keyValue } = this.props;
    const { dropdownOpen, isMounted, ville } = this.state;
    console.log(this.state, item);

    return (
      <motion.ul
        className="options-wrapper"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {item.children.map((subi, idx) => {
          return (
            <motion.li
              key={idx}
              className={"search-options color" + (subi.short ? "" : " full")}
              variants={itemanim}
            >
              <FSearchBtn
                key={idx}
                onClick={() => this.selectOption(subi)}
                className={"search-options color" + (subi.short ? "" : " full")}
                color={(subi.short || "").replace(/ /g, "-")}
              >
                <InnerButton>
                  {subi.icon ? (
                    <div
                      style={{
                        display: "flex",
                        marginRight: 10,
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
                </InnerButton>
              </FSearchBtn>
            </motion.li>
          );
        })}
        <motion.li
          key={item.children.length}
          className={"search-options  advanced-search-a bg-noir"}
          variants={itemanim}
        >
          <a
            target="_blank"
            href="https://soliguide.fr/"
          >
            <InnerButton>
              <div
                style={{
                  display: "flex",
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Streamline
                  name={"message"}
                  stroke={"white"}
                  width={22}
                  height={22}
                />
              </div>
              manger, me doucher...
            </InnerButton>
          </a>
        </motion.li>
        <motion.li key={item.children.length + 1} variants={itemanim}>
          <button
            onClick={() => {
              this.props.history.push("/advanced-search");
            }}
            className={"search-options advanced-search-btn-menu  bg-blanc"}
          >
            <InnerButton>
              <div
                style={{
                  display: "flex",
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Streamline name={"menu"} stroke={"black"} />
              </div>
              {t("Toolbar.Tout voir", "Tout voir")}
            </InnerButton>
          </button>
        </motion.li>
      </motion.ul>
    );
  }
}

export default withRouter(withTranslation()(CatList));
