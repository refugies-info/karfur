import React from 'react';
import {withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import API from '../../../utils/API';
import {available_languages} from '../../../locales/available_languages';

export class Toolbar extends React.Component {

  state = {
    dropdownOpen: false,
  };

  disconnect = event => {
      API.logout();
      window.location = "/";
  }

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  changeLanguage = (lng) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'changeLanguage', value : lng });
    this.props.i18n.changeLanguage(lng);
    this.setState({showModal:false})
  }

  render() {
    const path = this.props.location.pathname;
    const { i18n } = this.props;
    let afficher_burger=false;
    if(path.includes("/admin")){
        afficher_burger=true;
    }
    return(
        <header className="Toolbar">
            <DrawerToggle 
                forceShow={afficher_burger}
                clicked={this.props.drawerToggleClicked} />
            <div className="Logo">
                <Logo />
            </div>
            <nav className="DesktopOnly">
                <NavigationItems />
            </nav>

            <div className="right_buttons">
              <ButtonDropdown className="mr-1" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret color="transparent">
                  <i className={'flag-icon flag-icon-' + available_languages[i18n.language].code} title={available_languages[i18n.language].code} id={available_languages[i18n.language].code}></i>
                </DropdownToggle>
                <DropdownMenu>
                  {Object.keys(available_languages).map((element,key) => {
                    return (
                      <div key={element}>
                        <DropdownItem onClick={() => this.changeLanguage(element)}>
                          <i className={'flag-icon flag-icon-' + available_languages[element].code} title={available_languages[element].code} id={available_languages[element].code}></i>
                          <span>{available_languages[element].name}</span>
                        </DropdownItem>
                        {element==="fr" && <DropdownItem divider />}
                      </div>
                    );
                  })}
                </DropdownMenu>
              </ButtonDropdown>

              {API.isAuth() ? 
                  <Button onClick={this.disconnect}
                          type="submit">
                      Se déconnecter
                  </Button>
                  :
                  <a 
                      href="/login"
                      className="makeItRed">Se connecter</a>
              }
            </div>
        </header>
    )
  }
};

export default track({
  component: 'Toolbar',
})(
  withRouter(
    withTranslation()(Toolbar)
  )
);