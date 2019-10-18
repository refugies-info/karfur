import React from 'react';
import {withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { AppAsideToggler } from '@coreui/react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';

import {toggle_lang_modal} from '../../Store/actions/index';
// import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems';
import DrawerToggle from '../../components/Navigation/SideDrawer/DrawerToggle/DrawerToggle';
import API from '../../utils/API';
import AudioBtn from '../UI/AudioBtn/AudioBtn';
import marioProfile from '../../assets/mario-profile.jpg';
import Logo from '../../components/Logo/Logo';
import LanguageBtn from '../../components/FigmaUI/LanguageBtn/LanguageBtn';
import FButton from '../../components/FigmaUI/FButton/FButton';
import SearchBar from '../UI/SearchBar/SearchBar';

import './Toolbar.scss';

export class Toolbar extends React.Component {

  state = {
    dropdownOpen: false,
  };

  disconnect = () => {
    API.logout();
  }

  toggle = () => this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));

  navigateTo = route => this.props.history.push(route)

  render() {
    const path = this.props.location.pathname;
    const { user, contributeur, traducteur, expertTrad, admin, membreStruct } = this.props;
    let afficher_burger = admin && path.includes("/backend") && path.includes("/admin");
    let afficher_burger_droite = path.includes("/traduction");
    
    let userImg = (user.picture || {}).secure_url || marioProfile;
    return(
      <header className="Toolbar">
        <div className="left_buttons">
          <DrawerToggle 
            forceShow={afficher_burger}
            clicked={()=>this.props.drawerToggleClicked('left')} />
          <Logo />
          <span className="baseline">Construire sa vie en France</span>
        </div>

        <nav className="DesktopOnly center-buttons">
          <AudioBtn />
          <LanguageBtn />
          {/* <NavigationItems /> */}
        </nav>

        <SearchBar
          loupe
          className="search-bar inner-addon right-addon"
        />

        <div className="right_buttons">
          <FButton type="dark" name="grid" className="ml-10 mr-10" tag={NavLink} to="/advanced-search"> {/*to={ API.isAuth() ? "/backend/user-dashboard" : { pathname: '/login', state: {traducteur: true, redirectTo:"/backend/user-dashboard"} }} */}
            Tout voir
          </FButton>

          {API.isAuth() ? 
            <ButtonDropdown className="user-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle color="transparent">
                <img src={userImg} className="user-picture" alt="user" />
                <div className="user-badge" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={()=>this.navigateTo("/backend/user-profile")}>Mon profil</DropdownItem>
                {contributeur && <DropdownItem onClick={()=>this.navigateTo("/backend/user-dash-contrib")}>Espace rédaction</DropdownItem>}
                {(expertTrad || traducteur) && <DropdownItem onClick={()=>this.navigateTo("/backend/user-dashboard")}>Espace traduction</DropdownItem>}
                {membreStruct && <DropdownItem onClick={()=>this.navigateTo("/backend/user-dash-structure")}>Ma structure</DropdownItem>}
                {admin && <DropdownItem onClick={()=>this.navigateTo("/backend/admin")}>Administration</DropdownItem>}
                <DropdownItem divider />
                <NavLink to="/" onClick={this.disconnect}>
                  <DropdownItem className="text-danger">Se déconnecter</DropdownItem>
                </NavLink>
              </DropdownMenu>
            </ButtonDropdown>
            :
            <NavLink to={{ pathname:'/login', state: { redirectTo: "/backend/user-profile" } }}>
              <FButton type="outline-black" className="connect-btn">
                Connexion
              </FButton>
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
    langues: state.langue.langues,
    dispositifs: state.dispositif.dispositifs,
    user: state.user.user,
    traducteur: state.user.traducteur,
    expertTrad: state.user.expertTrad,
    contributeur: state.user.contributeur,
    admin: state.user.admin,
    membreStruct: state.user.membreStruct,
  }
}

const mapDispatchToProps = {toggle_lang_modal};

export default track({
  component: 'Toolbar',
})(
  withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
      withTranslation()(Toolbar)
    )
  )
);