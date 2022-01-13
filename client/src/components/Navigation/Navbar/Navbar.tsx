//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import i18n from "i18n";
import { useSelector, useDispatch } from "react-redux";
import API from "utils/API";
import AudioBtn from "containers/UI/AudioBtn/AudioBtn";
import marioProfile from "assets/mario-profile.jpg";
import Logo from "components/Logo/Logo";
import LanguageBtn from "components/FigmaUI/LanguageBtn/LanguageBtn";
import FButton from "components/FigmaUI/FButton/FButton";
import AdvancedSearchBar from "containers/UI/AdvancedSearchBar/AdvancedSearchBar";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { fetchUserActionCreator } from "services/User/user.actions";
import { breakpoints } from "utils/breakpoints.js";
import styled from "styled-components";
import Streamline from "assets/streamline";
import {
  userStructureHasResponsibleSeenNotification,
  userStructureDisposAssociesSelector,
  userStructureSelector,
} from "services/UserStructure/userStructure.selectors";
import { userSelector } from "services/User/user.selectors";
import { colors } from "colors";
import { logger } from "logger";
import { getNbNewNotifications } from "containers/Backend/UserNotifications/lib";
import { isMobile } from "react-device-detect";
import styles from "./Navbar.module.scss";

const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconButton = styled.div`
  background-color: ${colors.noir};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 50px;
  width: 50px;
`;

const Navbar = (props) => {
  const [visible, setVisible] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const user = useSelector(userSelector);
  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenNotification = useSelector(userStructureHasResponsibleSeenNotification);
  const userStructure = useSelector(userStructureSelector);

  const disconnect = () => {
    API.logout();
    dispatch(fetchUserActionCreator());
    this.props.setUserStructure(null);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    if (
      (router.pathname.includes("dispositif") &&
        router.state &&
        router.state.editable) ||
      (router.pathname.includes("demarche") &&
        router.state &&
        router.state.editable) ||
      router.pathname.includes("user-profile") ||
      router.pathname.includes("advanced-search") ||
      router.pathname.includes("qui-sommes-nous") ||
      router.pathname === "/dispositif" ||
      router.pathname === "/demarche"
    ) {
      setScroll(true);
    }

    return window.removeEventListener("scroll", handleScroll);
  }, []);

/*   componentDidUpdate(prevProps) {
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
  } */

  const toggle = () => setDropdownOpen(!dropdownOpen)

  const navigateTo = (route) => {
    router.push(route);
  };

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 70;
    setVisible(true);
  };

  const goBack = () => {
    if (
      router.state &&
      router.state.previousRoute &&
      router.state.previousRoute === "advanced-search"
    ) {
      this.props.history.go(-1);
    } else {
      this.props.history.push({ pathname: "/advanced-search" });
    }
  };

  const path = router.pathname || "";
  const { windowWidth } = props;
  const userImg = user && user.picture ? user.picture.secure_url : marioProfile;
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const pathName = user.membreStruct
    ? "/backend/user-dash-notifications"
    : "/backend/user-favorites";

  const nbNewNotifications = getNbNewNotifications(
    dispositifsAssocies,
    hasResponsibleSeenNotification
  );
  const isUserOnContentPage = path.includes("dispositif") || path.includes("demarche");

  return (
    <header
      className={
        styles.navbar +
        (visible || !scroll ? "" : " toolbar-hidden") +
        (isRTL ? " isRTL" : "")
      }
    >
      {isUserOnContentPage && isMobile ? (
        <div style={{ height: "50px" }}>
          <FButton
            type="light-action"
            name="arrow-back"
            onClick={this.goBack}
          >
            {t("Retour", "Retour")}
          </FButton>
        </div>
      ) : (
        <div className="left_buttons">
          <Logo reduced={windowWidth < breakpoints.phoneDown} isRTL={isRTL} />
          {path !== "/" &&
            path !== "/homepage" &&
            windowWidth >= breakpoints.phoneDown && (
              <NavLink to="/" className="home-btn">
                <FButton type="login" name="home-outline">
                  {windowWidth >= breakpoints.lgLimit &&
                    windowWidth > 1280 && (
                      <b className="home-texte">
                        {t("Toolbar.Accueil", "Accueil")}
                      </b>
                    )}
                </FButton>
              </NavLink>
            )}
        </div>
      )}

      <div className="center-buttons">
        <AudioBtn windowWidth={windowWidth} />
        <LanguageBtn
          hideText={windowWidth < breakpoints.tabletUp || windowWidth < 1024}
        />
        {isMobile ? (
          <IconButton
            onClick={() => {
              this.props.history.push({
                pathname: "/advanced-search",
                state: "clean-filters",
              });
            }}
          >
            <EVAIcon name="search" size="large" fill={colors.blanc} />
          </IconButton>
        ) : (
          <AdvancedSearchBar
            visible={visible}
            scroll={scroll}
            loupe
            windowWidth={windowWidth}
            className="search-bar inner-addon right-addon mr-10 rsz"
          />
        )}

        {!isMobile && (
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
        )}

        {!isMobile ? (
          API.isAuth() ? (
            <Link
              className="user-picture-link"
              href={{
                pathname: pathName,
              }}
            >
              <a>
                {user.membreStruct && nbNewNotifications > 0 &&
                userStructure ? (
                  <div className="overlay">
                    <img
                      src={userImg}
                      className="user-picture-with-overlay"
                      alt="user"
                    />
                    <div className="middle">{nbNewNotifications}</div>
                  </div>
                ) : (
                  <img src={userImg} className="user-picture" alt="user" />
                )}
              </a>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <FButton
                  type="signup"
                  name={"person-add-outline"}
                  className="mr-10"
                  onClick={() => logger.info("Click on Inscription")}
                >
                  {windowWidth >= breakpoints.tabletUp &&
                    windowWidth > 1280 &&
                    t("Toolbar.Inscription", "Inscription")}
                </FButton>
              </Link>
              <Link href="/login">
                <FButton type="login" name={"log-in-outline"}>
                  {windowWidth > 1280 && t("Toolbar.Connexion", "Connexion")}
                </FButton>
              </Link>
            </>
          )
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
