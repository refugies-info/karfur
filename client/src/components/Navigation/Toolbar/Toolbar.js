import React from 'react';
import {withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { AppAsideToggler } from '@coreui/react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../Store/actions';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import API from '../../../utils/API';
import AudioBtn from '../../../containers/UI/AudioBtn/AudioBtn'

import './Toolbar.scss';

export class Toolbar extends React.Component {

  state = {
    dropdownOpen: false,
    available_languages:[]
  };

  componentDidMount (){
    API.get_langues({}).then(data_res => {
      this.setState({ available_languages:data_res.data.data })
    },function(error){ console.log(error); return; })
  }

  disconnect = () => {
    API.logout();
    this.props.history.push('/homepage')
  }

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  changeLanguage = (lng) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'changeLanguage', value : lng });
    const action = { type: actions.TOGGLE_LANGUE, value: lng }
    this.props.dispatch(action)
    if(this.props.i18n.getResourceBundle(lng,"translation")){
      this.props.i18n.changeLanguage(lng);
    }else{console.log('Resource not found in i18next.')}
  }

  render() {
    const path = this.props.location.pathname;
    const { i18n } = this.props;
    let afficher_burger=path.includes("/backend");
    let afficher_burger_droite=path.includes("/traduction");

    let CurrentLanguageIcon = () => {
      let current = this.state.available_languages.find(x => x.i18nCode === i18n.language)
      if (this.state.available_languages.length > 0 && current){
        return(
          <i className={'flag-icon flag-icon-' + current.langueCode} title={current.langueCode} id={current.langueCode}></i>
        )
      }else{
        return <i className={'flag-icon flag-icon-fr'} title="fr" id="fr"></i>
      }
    }
    return(
      <header className="Toolbar">
        <div className="left_buttons">
          <DrawerToggle 
            forceShow={afficher_burger}
            clicked={()=>this.props.drawerToggleClicked('left')} />
          <div className="Logo">
            Agir
          </div>
          <AudioBtn />
        </div>
        <nav className="DesktopOnly center_buttons">
          <NavigationItems />
        </nav>

        <div className="right_buttons">
          <ButtonDropdown className="mr-1" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret color="transparent">
              <CurrentLanguageIcon />
            </DropdownToggle>
            <DropdownMenu>
              {Object.keys(this.state.available_languages).map((element) => {
                return (
                  <div key={this.state.available_languages[element]._id}>
                    <DropdownItem onClick={() => this.changeLanguage(this.state.available_languages[element].i18nCode)} key={element._id}>
                      <i className={'flag-icon flag-icon-' + this.state.available_languages[element].langueCode} title={this.state.available_languages[element].langueCode} id={this.state.available_languages[element].langueCode}></i>
                      <span>{this.state.available_languages[element].langueLoc}</span>
                    </DropdownItem>
                    {this.state.available_languages[element].i18nCode==="fr" && <DropdownItem divider />}
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
              <NavLink 
                  to="/login"
                  className="makeItRed">Se connecter</NavLink>
          }
        </div>
        
        {afficher_burger_droite &&
          <AppAsideToggler
            className="d-md-down-none" />
        }
      </header>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode
  }
}

export default track({
  component: 'Toolbar',
})(
  withRouter(
    connect(mapStateToProps)(
      withTranslation()(Toolbar)
    )
  )
);