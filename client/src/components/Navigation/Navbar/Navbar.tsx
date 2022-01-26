import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import i18n from "i18n";
import { useSelector, useDispatch } from "react-redux";
import API from "utils/API";
import AudioBtn from "components/UI/AudioBtn/AudioBtn";
import Logo from "components/Logo/Logo";
import LanguageBtn from "components/FigmaUI/LanguageBtn/LanguageBtn";
import FButton from "components/FigmaUI/FButton/FButton";
import AdvancedSearchBar from "components/UI/AdvancedSearchBar/AdvancedSearchBar";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
// import { fetchUserActionCreator } from "services/User/user.actions";
import {
  toggleTTSActionCreator,
  toggleSpinner,
} from "services/Tts/tts.actions";
import { breakpoints } from "utils/breakpoints.js";
import styled from "styled-components";
import Streamline from "assets/streamline";
import {
  userStructureHasResponsibleSeenNotification,
  userStructureDisposAssociesSelector,
  userStructureSelector,
} from "services/UserStructure/userStructure.selectors";
import { userSelector } from "services/User/user.selectors";
import {
  ttsActiveSelector,
  ttsLoadingSelector,
} from "services/Tts/tts.selector";
import { colors } from "colors";
import { logger } from "logger";
import { getNbNewNotifications } from "containers/Backend/UserNotifications/lib";
import { isMobile } from "react-device-detect";
import styles from "./Navbar.module.scss";
import marioProfile from "assets/mario-profile.jpg";

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

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [scroll, setScroll] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const user = useSelector(userSelector);
  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenNotification = useSelector(
    userStructureHasResponsibleSeenNotification
  );
  const userStructure = useSelector(userStructureSelector);
  const ttsActive = useSelector(ttsActiveSelector);
  const ttsLoading = useSelector(ttsLoadingSelector);

  // scroll
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY < 70);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      router.pathname.includes("dispositif") /*  &&
        location.state &&
        location.state.editable */ ||
      router.pathname.includes("demarche") /* &&
        location.state &&
        location.state.editable */ ||
      router.pathname.includes("user-profile") ||
      router.pathname.includes("advanced-search") ||
      router.pathname.includes("qui-sommes-nous") ||
      router.pathname === "/dispositif" ||
      router.pathname === "/demarche"
    ) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  }, [router.pathname]);

  const goBack = () => {
    router.back();
    /* if (
      location.state &&
      location.state.previousRoute &&
      location.state.previousRoute === "advanced-search"
    ) {
      this.props.history.go(-1);
    } else {
      this.props.history.push({ pathname: "/advanced-search" });
    } */
  };

  const path = router.pathname || "";
  const windowWidth = 1300; // TODO : fix that
  const userImg =
    user.user && user.user.picture
      ? user.user.picture.secure_url
      : marioProfile;
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  /*   const pathName = user.membreStruct
    ? "/backend/user-dash-notifications"
    : "/backend/user-favorites"; */

  const nbNewNotifications = getNbNewNotifications(
    dispositifsAssocies,
    hasResponsibleSeenNotification
  );
  const isUserOnContentPage =
    path.includes("dispositif") || path.includes("demarche");
  return (
    <header
      className={`${styles.navbar} ${visible || !scroll ? "" : styles.hidden} ${
        isRTL ? styles.rtl : ""
      }`}
    >
      {isUserOnContentPage && isMobile ? (
        <div style={{ height: 50 }}>
          <FButton type="light-action" name="arrow-back" onClick={goBack}>
            {t("Retour", "Retour")}
          </FButton>
        </div>
      ) : (
        <div className={styles.left_buttons}>
          <Logo />
          {path !== "/" && path !== "/homepage" && (
            <Link href="/" passHref>
              <FButton
                type="login"
                name="home-outline"
                tag="a"
                className={styles.home_btn}
                tabIndex="1"
              >
                {windowWidth >= breakpoints.lgLimit && windowWidth > 1280 && (
                  <b>{t("Toolbar.Accueil", "Accueil")}</b>
                )}
              </FButton>
            </Link>
          )}
        </div>
      )}

      <div className={styles.center_buttons}>
        <AudioBtn
          enabled={["fr", "en", "ar", "ru"].includes(i18n.language)}
          toggleAudio={() => dispatch(toggleTTSActionCreator())}
          ttsActive={ttsActive}
          ttsLoading={ttsLoading}
        />
        <LanguageBtn hideTextOnMobile={true} />
        {isMobile ? (
          <IconButton
            onClick={() => {
              router.push({
                pathname: "/advanced-search",
                // state: "clean-filters",
              });
            }}
          >
            <EVAIcon name="search" size="large" fill={colors.blanc} />
          </IconButton>
        ) : (
          <AdvancedSearchBar
            visible={visible}
            scroll={scroll}
            // className="search-bar inner-addon right-addon mr-10 rsz"
          />
        )}

        {!isMobile && (
          <button
            onClick={() => {
              if (router.pathname === "/advanced-search") {
                router.replace("/advanced-search");
                // window.location.reload();
              } else {
                router.push("/advanced-search");
              }
            }}
            className={`${styles.advanced_search_btn} ${
              isRTL ? styles.advanced_search_btn_rtl : ""
            }`}
          >
            <InnerButton isRTL={isRTL}>
              <div
                className={styles.menu_btn}
                style={!isRTL ? { marginRight: 10 } : { marginLeft: 10 }}
              >
                <Streamline name={"menu"} stroke={"white"} />
              </div>
              {t("Toolbar.Tout voir", "Tout voir")}
            </InnerButton>
          </button>
        )}

        {!isMobile ? (
          API.isAuth() ? (
            <Link href="/backend">
              <a className={styles.user_picture_link}>
                {user.membreStruct &&
                nbNewNotifications > 0 &&
                userStructure ? (
                  <div className={styles.overlay}>
                    <Image
                      src={userImg}
                      className={styles.user_picture_with_overlay}
                      alt="user"
                      width={52}
                      height={52}
                    />
                    <div className={styles.middle}>{nbNewNotifications}</div>
                  </div>
                ) : (
                  <Image
                    src={userImg}
                    className={styles.user_picture}
                    alt="user"
                    width={52}
                    height={52}
                  />
                )}
              </a>
            </Link>
          ) : (
            <>
              <Link href="/register" passHref>
                <FButton
                  type="signup"
                  name="person-add-outline"
                  className="mr-10"
                  onClick={() => logger.info("Click on Inscription")}
                >
                  {windowWidth >= breakpoints.tabletUp &&
                    windowWidth > 1280 &&
                    t("Toolbar.Inscription", "Inscription")}
                </FButton>
              </Link>
              <Link href="/login" passHref>
                <FButton type="login" name="log-in-outline">
                  {windowWidth > 1280 && t("Toolbar.Connexion", "Connexion")}
                </FButton>
              </Link>
            </>
          )
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
