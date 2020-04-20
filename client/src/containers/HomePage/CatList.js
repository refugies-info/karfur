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
      <div className="options-wrapper">
        {item.children.map((subi, idx) => {
          return (
            <FSearchBtn
              key={idx}
              onClick={() => this.selectOption(subi)}
              className={"search-options color" + (subi.short ? "" : " full")}
              color={(subi.short || "").replace(/ /g, "-")}
            >
              {t("Tags." + subi.name, subi.name)}
            </FSearchBtn>
          );
        })}
        <a
          target="_blank"
          href="https://soliguide.fr/"
          className={"search-options advanced-search-btn  bg-noir"}
        >
          manger, me doucher...
        </a>
        <FButton
          type="light"
          name="grid"
          className="mr-10 rsz"
          tag={NavLink}
          to="/advanced-search"
          fill="black"
        >
          {t("Toolbar.Tout voir", "Tout voir")}
        </FButton>
      </div>
    );
  }
}

export default withRouter(withTranslation()(CatList));
