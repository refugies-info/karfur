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
import AudioBtn from '../../../containers/UI/AudioBtn/AudioBtn';
import marioProfile from '../../../assets/mario-profile.jpg'

import './Toolbar.scss';

export class Toolbar extends React.Component {

  state = {
    dropdownOpen: false,
    available_languages:[],
    user:{}
  };

  componentDidMount (){
    API.get_langues({}).then(data_res => {
      this.setState({ available_languages:data_res.data.data })
    },function(error){ console.log(error); return; })
    if(API.isAuth()){
      API.get_user_info().then(data_res => {
        let user=data_res.data.data;
        this.setState({user:user})
      },(error) => {console.log(error);return;})
    }
  }

  disconnect = () => {
    API.logout();
    this.props.history.push('/')
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

  navigateTo = route => this.props.history.push(route)

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
    let userImg = (this.state.user.picture || {}).secure_url || marioProfile;
    return(
      <header className="Toolbar">
        <div className="left_buttons">
          <DrawerToggle 
            forceShow={false && afficher_burger}
            clicked={()=>this.props.drawerToggleClicked('left')} />
          <NavLink to="/" className="Logo">
            Agir
            <sup className="beta-tag">beta</sup>
          </NavLink>
          <AudioBtn />
          <Button className="flag-btn" onClick={this.props.toggleLangModal}>
            <CurrentLanguageIcon />
          </Button>
        </div>

        <nav className="DesktopOnly center_buttons">
          <NavigationItems />
        </nav>

        <div className="right_buttons">
          <NavLink to={ API.isAuth() ? "/backend/user-dashboard" : { pathname: '/login', state: {traducteur: true, redirectTo:"/backend/user-dashboard"} }}>
            <Button className="traduire-btn">
              Traduire
            </Button>
          </NavLink>

          {API.isAuth() ? 
            <ButtonDropdown className="user-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle color="transparent">
                <img src={userImg} className="user-picture" />
                <div className="user-badge" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={()=>this.navigateTo("/backend/user-profile")}>Mon profil</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.disconnect} className="text-danger">Se déconnecter</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            :
            <NavLink to={{ pathname:'/login', state: { redirectTo: "/backend/user-profile" } }}>
              <Button color="white" className="connect-btn">
                Connexion
              </Button>
            </NavLink>
          }
        </div>
        
        {false && afficher_burger_droite &&
          <AppAsideToggler
            className="d-md-down-none" />
        }
      </header>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
    showLangModal: state.langue.showLangModal,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLangModal: () => dispatch({type: actions.TOGGLE_LANG_MODAL}),
  }
}

export default track({
  component: 'Toolbar',
})(
  withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
      withTranslation()(Toolbar)
    )
  )
);