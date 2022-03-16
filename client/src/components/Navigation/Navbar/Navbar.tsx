import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import API from "utils/API";
import AudioBtn from "components/UI/AudioBtn/AudioBtn";
import Logo from "components/Logo/Logo";
import LanguageBtn from "components/UI/LanguageBtn/LanguageBtn";
import FButton from "components/UI/FButton/FButton";
import AdvancedSearchBar from "components/UI/AdvancedSearchBar/AdvancedSearchBar";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
// import { fetchUserActionCreator } from "services/User/user.actions";
import {
  toggleTTSActionCreator,
  toggleSpinner,
} from "services/Tts/tts.actions";
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
import useRTL from "hooks/useRTL";
import { hasTTSAvailable } from "data/activatedLanguages";
import { AvailableLanguageI18nCode } from "types/interface";
import history from "utils/backendHistory";

interface Props {
  history: string[]
}

const Navbar = (props: Props) => {
  const [visible, setVisible] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

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

  // Auth
  useEffect(() => {
    setIsAuth(API.isAuth());
  }, [user]);

  useEffect(() => {
    if (
      (router.pathname.includes("dispositif") && router.query.edit !== undefined) ||
      (router.pathname.includes("demarche") && router.query.edit !== undefined) ||
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
  }, [router.pathname, router.query]);

  const goBack = () => {
    if (props.history[1]?.includes("advanced-search")) {
      router.push(props.history[1]);
    } else {
      router.push({ pathname: "/advanced-search" });
    }
  };

  const goToProfile = () => {
    const pathName = user.membreStruct
      ? "/backend/user-dash-notifications"
      : "/backend/user-favorites";
    const isOnBackend = router.pathname.includes("backend");
    if (!isOnBackend) router.push(pathName);
    else if (history) history.push(pathName);
  }

  const path = router.pathname || "";
  const userImg =
    user.user && user.user.picture
      ? user.user.picture.secure_url
      : marioProfile;
  const isRTL = useRTL();


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
                <b>{t("Toolbar.Accueil", "Accueil")}</b>
              </FButton>
            </Link>
          )}
        </div>
      )}

      <div className={styles.center_buttons}>
        <AudioBtn
          enabled={hasTTSAvailable.includes((router.locale || "fr") as AvailableLanguageI18nCode)}
          toggleAudio={() => dispatch(toggleTTSActionCreator())}
          ttsActive={ttsActive}
          ttsLoading={ttsLoading}
        />
        <LanguageBtn hideTextOnMobile={true} />
        {isMobile ? (
          <button
            className={styles.mobile_search_btn}
            onClick={() => {
              router.push({ pathname: "/advanced-search" });
            }}
          >
            <EVAIcon name="search" size="large" fill={colors.gray10} />
          </button>
        ) : (
          <AdvancedSearchBar
            visible={visible}
            scroll={scroll}
            // className="search-bar inner-addon right-addon mr-10 rsz"
          />
        )}

        {!isMobile && (
          <Link href="/advanced-search">
            <a
              className={`${styles.advanced_search_btn} ${
                isRTL ? styles.advanced_search_btn_rtl : ""
              }`}
            >
              <div
                className={styles.menu_btn}
                style={!isRTL ? { marginRight: 10 } : { marginLeft: 10 }}
              >
                <Streamline name={"menu"} stroke={"white"} />
              </div>
              {t("Toolbar.Tout voir", "Tout voir")}
            </a>
          </Link>
        )}

        {!isMobile && (
          isAuth ?
          <div>
            <button onClick={goToProfile} className={styles.user_picture_link}>
              {(user.membreStruct && nbNewNotifications > 0 && userStructure) ? (
                <div className={styles.overlay}>
                  <div className={styles.user_picture_with_overlay}>
                    <Image src={userImg} alt="user" width={52} height={52} />
                  </div>
                  <div className={styles.middle}>{nbNewNotifications}</div>
                </div>
              ) : (
                <div className={styles.user_picture}>
                  <Image src={userImg} alt="user" width={52} height={52} />
                </div>
              )}
            </button>
          </div> :
          <div>
            <Link href="/register" passHref>
              <FButton
                type="signup"
                name="person-add-outline"
                tag="a"
                onClick={() => logger.info("Click on Inscription")}
                className={styles.auth_btn+ " mr-10"}
              >
                <span className={styles.auth_btn_text}>{t("Toolbar.Inscription", "Inscription")}</span>
              </FButton>
            </Link>
            <Link href="/login" passHref>
                <FButton
                  type="login"
                  name="log-in-outline"
                  tag="a"
                  className={styles.auth_btn}
                >
                <span className={styles.auth_btn_text}>{t("Toolbar.Connexion", "Connexion")}</span>
              </FButton>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
