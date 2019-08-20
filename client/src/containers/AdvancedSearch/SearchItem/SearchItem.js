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
    const {item, keyValue} = this.props;
    return (
      <div className="search-col">
        <div>{item.title}</div>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="display-inline-block">
          <DropdownToggle
            tag="div"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
            className="mt-8"
          >
            <FSearchBtn active={item.active} desactiver = {() => this.props.desactiver(keyValue)}>
              {item.value}
            </FSearchBtn>
          </DropdownToggle>
          <DropdownMenu>
            <div className="options-wrapper">
              {item.children.map((subi, idx) => (
                <FSearchBtn 
                  key={idx} 
                  onClick={()=> this.selectOption(subi)}
                  className="search-options full"
                  color={subi.color}
                >
                  {subi.name}
                </FSearchBtn>
              ))}
            </div>
          </DropdownMenu>
        </Dropdown>
        <span className="ml-10">{item.title2}</span>
      </div>
    )
  }
}

export default withTranslation()(SearchItem);

