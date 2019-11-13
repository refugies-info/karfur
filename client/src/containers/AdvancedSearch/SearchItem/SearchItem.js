import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import FSearchBtn from '../../../components/FigmaUI/FSearchBtn/FSearchBtn';

import "./SearchItem.scss";

class SearchItem extends Component {
  state = {
    dropdownOpen: false,
  }

  toggle = () => this.setState(prevState=>{return {dropdownOpen:!prevState.dropdownOpen}})

  selectOption = subi => {
    this.props.selectParam(this.props.keyValue, subi);
    this.toggle();
  }

  render() {
    const {t, item, keyValue} = this.props;
    return (
      <div className="search-col">
        <span className="mr-10">{t("SearchItem." + item.title, item.title)}</span>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="display-inline-block">
          <DropdownToggle
            caret
            tag="div"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
            className={"search-btn in-header " + (item.short && item.active ? ("bg-" + item.short.split(" ").join("-")) : "") + (!item.short && item.active ? "active" : "")}
          >
            {/* <FSearchBtn active={!item.short && item.active} desactiver = {() => this.props.desactiver(keyValue)} className={item.short && item.active && ("bg-" + item.short.split(" ").join("-") + " texte-blanc")}> */}
            {t("Tags." + item.value, item.value)}
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
        </Dropdown>
        {item.title2 &&
          <span className="ml-10">{t("SearchItem." + item.title2, item.title2)}</span>}
      </div>
    )
  }
}

export default withTranslation()(SearchItem);

