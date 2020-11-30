import React from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import i18n from "../../i18n";
import { AppAsideToggler } from "@coreui/react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import windowSize from "react-window-size";

import { toggleLangueModalActionCreator } from "../../services/Langue/langue.actions";
// import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems';
import DrawerToggle from "../../components/Navigation/SideDrawer/DrawerToggle/DrawerToggle";
import API from "../../utils/API";
import AudioBtn from "../UI/AudioBtn/AudioBtn";
import marioProfile from "../../assets/mario-profile.jpg";
import Logo from "../../components/Logo/Logo";
import LanguageBtn from "../../components/FigmaUI/LanguageBtn/LanguageBtn";
import FButton from "../../components/FigmaUI/FButton/FButton";
import AdvancedSearchBar from "../UI/AdvancedSearchBar/AdvancedSearchBar";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import { breakpoints } from "utils/breakpoints.js";
import styled from "styled-components";
import Streamline from "../../assets/streamline";

import "./Toolbar.scss";
import variables from "scss/colors.scss";
import { logger } from "../../logger";

const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// top banner
export class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      scroll: false,
    };
  }

  state = {
    dropdownOpen: false,
  };

  disconnect = () => {
    API.logout();
    this.props.fetchUser();
    this.props.setUserStructure(null);
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    if (
      (this.props.location.pathname.includes("dispositif") &&
        this.props.location.state &&
        this.props.location.state.editable) ||
      (this.props.location.pathname.includes("demarche") &&
        this.props.location.state &&
        this.props.location.state.editable) ||
      this.props.location.pathname.includes("user-profile") ||
      this.props.location.pathname.includes("advanced-search") ||
      this.props.location.pathname.includes("qui-sommes-nous") ||
      this.props.location.pathname === "/dispositif" ||
      this.props.location.pathname === "/demarche"
    ) {
      this.setState({ scroll: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname ||
      ((this.props.location.pathname.includes("dispositif") ||
        this.props.location.pathname.includes("demarche")) &&
        this.props.location.state !== prevProps.location.state)
    ) {
      if (
        (this.props.location.pathname.includes("dispositif") &&
          this.props.location.state &&
          this.props.location.state.editable) ||
        (this.props.location.pathname.includes("demarche") &&
          this.props.location.state &&
          this.props.location.state.editable) ||
        this.props.location.pathname.includes("user-profile") ||
        this.props.location.pathname.includes("advanced-search") ||
        this.props.location.pathname.includes("qui-sommes-nous") ||
        this.props.location.pathname === "/dispositif" ||
        this.props.location.pathname === "/demarche"
      ) {
        this.setState({ scroll: true });
      } else {
        this.setState({ scroll: false });
      }
    }
  }

  toggle = () =>
    this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));

  navigateTo = (route) => {
    this.props.history.push(route);
  };

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    //const visible = prevScrollpos > currentScrollPos;
    const visible = currentScrollPos < 70;

    this.setState({
      visible,
    });
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
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

    return (
      <header
        className={
          "Toolbar" +
          (this.state.visible || !this.state.scroll ? "" : " toolbar-hidden") +
          (isRTL ? " isRTL" : "")
        }
      >
        <div className="left_buttons">
          {afficher_burger && (
            <DrawerToggle
              forceShow={afficher_burger}
              clicked={() => this.props.drawerToggleClicked("left")}
            />
          )}
          <Logo reduced={windowWidth < breakpoints.phoneDown} isRTL={isRTL} />
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

        {/*  {i18n.language === "fr" && ( */}
            <AdvancedSearchBar
              visible={this.state.visible}
              scroll={this.state.scroll}
              loupe
              className="search-bar inner-addon right-addon mr-10 rsz"
            />
          {/* )} */}

          <button
            onClick={() => {
              if (this.props.location.pathname === "/advanced-search") {
                this.props.history.replace("/advanced-search");
                window.location.reload();
              } else {
                this.props.history.push("/advanced-search");
              }
            }}
            className={
              isRTL
                ? "advanced-search-btn-menu-rtl"
                : "advanced-search-btn-menu"
            }
          >
            <InnerButton isRTL={isRTL}>
              {!isRTL ? (
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
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <Streamline name={"menu"} stroke={"white"} />
                </div>
              )}
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
                    {t("Toolbar.Mes fiches", "Mes fiches")}
                  </DropdownItem>
                )}
                {(expertTrad || traducteur) && (
                  <DropdownItem
                    onClick={() => this.navigateTo("/backend/user-dashboard")}
                  >
                    {t("Toolbar.Mes traductions", "Mes traductions")}
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
            <>
              <NavLink
                to={{
                  pathname: "/register",
                }}
              >
                <FButton
                  type="signup"
                  name={"person-add-outline"}
                  className="mr-10"
                  onClick={() => logger.info("Click on Inscription")}
                >
                  {windowWidth >= breakpoints.tabletUp &&
                    t("Toolbar.Inscription", "Inscription")}
                </FButton>
              </NavLink>
              <NavLink
                to={{
                  pathname: "/login",
                }}
              >
                <FButton type="login" name={"log-in-outline"}>
                  {t("Toolbar.Connexion", "Connexion")}
                </FButton>
              </NavLink>
            </>
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
    dispositifs: state.activeDispositifs,
    user: state.user.user,
    traducteur: state.user.traducteur,
    expertTrad: state.user.expertTrad,
    contributeur: state.user.contributeur,
    admin: state.user.admin,
    membreStruct: state.user.membreStruct,
  };
};

const mapDispatchToProps = {
  toggleLangueModal: toggleLangueModalActionCreator,
  fetchUser: fetchUserActionCreator,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(windowSize(Toolbar)))
);
