import React from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { AppAsideToggler } from "@coreui/react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import windowSize from "react-window-size";

import { toggle_lang_modal } from "../../services/actions/index";
// import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems';
import DrawerToggle from "../../components/Navigation/SideDrawer/DrawerToggle/DrawerToggle";
import API from "../../utils/API";
import AudioBtn from "../UI/AudioBtn/AudioBtn";
import marioProfile from "../../assets/mario-profile.jpg";
import Logo from "../../components/Logo/Logo";
import LanguageBtn from "../../components/FigmaUI/LanguageBtn/LanguageBtn";
import FButton from "../../components/FigmaUI/FButton/FButton";
import SearchBar from "../UI/SearchBar/SearchBar";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import { breakpoints } from "utils/breakpoints.js";
import styled from "styled-components";
import Streamline from "../../assets/streamline";

import "./Toolbar.scss";
import variables from "scss/colors.scss";

const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export class Toolbar extends React.Component {
  state = {
    dropdownOpen: false,
  };

  disconnect = () => {
    API.logout();
    this.props.fetchUser();
  };

  toggle = () =>
    this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));

  navigateTo = (route) => {
    this.props.history.push(route);
  };

  render() {
    const path = this.props.location.pathname || "";
    const {
      user,
      contributeur,
      traducteur,
      expertTrad,
      admin,
      membreStruct,
      t,
      windowWidth,
    } = this.props;
    const afficher_burger =
      false && admin && path.includes("/backend") && path.includes("/admin"); //Hugo demande de ne plus afficher le burger, temporairement désactivé donc
    const afficher_burger_droite = path.includes("/traduction");
    const userImg =
      user && user.picture ? user.picture.secure_url : marioProfile;
    return (
      <header className="Toolbar">
        <div className="left_buttons">
          {afficher_burger && (
            <DrawerToggle
              forceShow={afficher_burger}
              clicked={() => this.props.drawerToggleClicked("left")}
            />
          )}
          <Logo reduced={windowWidth < breakpoints.phoneDown} />
          {path !== "/" &&
            path !== "/homepage" &&
            windowWidth >= breakpoints.phoneDown && (
              <NavLink to="/" className="home-btn">
                <EVAIcon
                  name="home"
                  fill={variables.noir}
                  className="mr-10 rsz"
                />
                {windowWidth >= breakpoints.lgLimit && (
                  <b className="home-texte">
                    {t("Toolbar.Accueil", "Accueil")}
                  </b>
                )}
              </NavLink>
            )}
        </div>

        <div className="center-buttons">
          <AudioBtn />
          <LanguageBtn hideText={windowWidth < breakpoints.tabletUp} />
          {/* <NavigationItems /> */}

          <SearchBar
            loupe
            className="search-bar inner-addon right-addon mr-10 rsz"
          />

          <button
            onClick={() => {
              this.props.history.push("/advanced-search");
            }}
            className={"advanced-search-btn-menu"}
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
                <Streamline name={"menu"} stroke={"white"} />
              </div>
              {t("Toolbar.Tout voir", "Tout voir")}
            </InnerButton>
          </button>

          {API.isAuth() ? (
            <ButtonDropdown
              className="user-dropdown"
              isOpen={this.state.dropdownOpen}
              toggle={this.toggle}
            >
              <DropdownToggle color="transparent">
                <img src={userImg} className="user-picture" alt="user" />
                <div className="user-badge" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => this.navigateTo("/backend/user-profile")}
                >
                  {t("Toolbar.Mon profil", "Mon profil")}
                </DropdownItem>
                {contributeur && (
                  <DropdownItem
                    onClick={() =>
                      this.navigateTo("/backend/user-dash-contrib")
                    }
                  >
                    {t("Toolbar.Espace rédaction", "Espace rédaction")}
                  </DropdownItem>
                )}
                {(expertTrad || traducteur) && (
                  <DropdownItem
                    onClick={() => this.navigateTo("/backend/user-dashboard")}
                  >
                    {t("Toolbar.Espace traduction", "Espace traduction")}
                  </DropdownItem>
                )}
                {membreStruct && (
                  <DropdownItem
                    onClick={() => {
                      this.navigateTo("/backend/user-dash-structure");
                    }}
                  >
                    {t("Toolbar.Ma structure", "Ma structure")}
                  </DropdownItem>
                )}
                {admin && (
                  <DropdownItem
                    onClick={() => this.navigateTo("/backend/admin")}
                  >
                    {t("Toolbar.Administration", "Administration")}
                  </DropdownItem>
                )}
                <DropdownItem divider />
                <NavLink to="/" onClick={this.disconnect}>
                  <DropdownItem className="text-danger">
                    {t("Toolbar.Se déconnecter", "Se déconnecter")}
                  </DropdownItem>
                </NavLink>
              </DropdownMenu>
            </ButtonDropdown>
          ) : (
            <NavLink
              to={{
                pathname: "/login",
                state: { redirectTo: "/backend/user-profile" },
              }}
            >
              <FButton
                type="outline-black"
                className="connect-btn"
                name={windowWidth < breakpoints.tabletUp && "log-in-outline"}
                fill={variables.noir}
              >
                {windowWidth >= breakpoints.tabletUp &&
                  t("Toolbar.Connexion", "Connexion")}
              </FButton>
            </NavLink>
          )}
        </div>

        {false && afficher_burger_droite && (
          <AppAsideToggler className="d-md-down-none" />
        )}
      </header>
    );
  }
}

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
  };
};

const mapDispatchToProps = {
  toggle_lang_modal,
  fetchUser: fetchUserActionCreator,
};

export default track({
  component: "Toolbar",
})(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(windowSize(Toolbar)))
  )
);
