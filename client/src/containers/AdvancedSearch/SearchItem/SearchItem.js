import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import ReactDependentScript from 'react-dependent-script';
import Autocomplete from 'react-google-autocomplete';

import FSearchBtn from '../../../components/FigmaUI/FSearchBtn/FSearchBtn';

import "./SearchItem.scss";

class SearchItem extends Component {
  state = {
    dropdownOpen: false,
    isMounted: false,
    ville: "",
  }

  componentDidMount(){
    this.setState({isMounted: true})
  }

  onPlaceSelected = (place) => {
    this.setState({ville: place.formatted_address });
    this.props.selectParam(this.props.keyValue, place);
  }

  toggle = () => this.setState(prevState=>{return {dropdownOpen:!prevState.dropdownOpen}})
  handleChange = (e) => this.setState({ [e.currentTarget.id]: e.target.value });

  selectOption = subi => {
    this.props.selectParam(this.props.keyValue, subi);
    this.toggle();
  }

  render() {
    const {t, item} = this.props; //keyValue
    const {dropdownOpen, isMounted, ville}=this.state;
    return (
      <div className="search-col">
        <span className="mr-10">{t("SearchItem." + item.title, item.title)}</span>
        {item.queryName === 'localisation' ? 
          isMounted && 
            <ReactDependentScript
              loadingComponent={<div>Chargement de Google Maps...</div>}
              scripts={["https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&v=3.exp&libraries=places&language=fr&region=FR"]}
            >
              <Autocomplete
                className={"search-btn in-header search-autocomplete " + (item.active ? "active" : "")}
                placeholder={item.placeholder}
                id="ville"
                value={ville}
                onChange={this.handleChange}
                onPlaceSelected={this.onPlaceSelected}
                types={['(regions)']}
                componentRestrictions={{country: "fr"}}
              />
            </ReactDependentScript> :
          <Dropdown isOpen={dropdownOpen} toggle={this.toggle} className="display-inline-block">
            <DropdownToggle
              caret
              tag="div"
              data-toggle="dropdown"
              aria-expanded={dropdownOpen}
              className={"search-btn in-header " + (item.short && item.active ? ("bg-" + item.short.split(" ").join("-")) : "") + (!item.short && item.active ? "active" : "")}
            >
              {/* <FSearchBtn active={!item.short && item.active} desactiver = {() => this.props.desactiver(keyValue)} className={item.short && item.active && ("bg-" + item.short.split(" ").join("-") + " texte-blanc")}> */}
              {item.value ? t("Tags." + item.value, item.value) : t("Tags." + item.placeholder, item.placeholder)}
              {/* </FSearchBtn> */}
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
          </Dropdown>}
        {item.title2 &&
          <span className="ml-10">{t("SearchItem." + item.title2, item.title2)}</span>}
      </div>
    )
  }
}

export default withTranslation()(SearchItem);

