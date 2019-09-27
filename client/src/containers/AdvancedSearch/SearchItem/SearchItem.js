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
        <div>{t("SearchItem." + item.title, item.title)}</div>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="display-inline-block">
          <DropdownToggle
            tag="div"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
            className="mt-8"
          >
            <FSearchBtn active={item.active} desactiver = {() => this.props.desactiver(keyValue)}>
              {t("Tags." + item.value, item.value)}
            </FSearchBtn>
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
        <span className="ml-10">{item.title2 ? t("SearchItem." + item.title2, item.title2) : ""}</span>
      </div>
    )
  }
}

export default withTranslation()(SearchItem);

