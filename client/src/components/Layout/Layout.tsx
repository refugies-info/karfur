import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import { useRouter } from "next/router";

// actions
import {
  fetchLanguesActionCreator,
  toggleLangueModalActionCreator,
  toggleLangueActionCreator,
} from "services/Langue/langue.actions";
import { fetchUserActionCreator } from "services/User/user.actions";

// selectors
import { ttsActiveSelector } from "services/Tts/tts.selector";
import { showLangModalSelector, allLanguesSelector } from "services/Langue/langue.selectors";
import { hasErroredSelector, isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";

import Navbar from "components/Navigation/Navbar";
import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import MobileAppModal from "components/Modals/MobileAppModal/MobileAppModal";
import Footer from "components/Layout/Footer";
import { readAudio, stopAudio } from "lib/readAudio";
import { toggleSpinner } from "services/Tts/tts.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { userDetailsSelector } from "services/User/user.selectors";
import { useChangeLanguage, useRTL } from "hooks";
import locale from "utils/locale";
import { themesSelector } from "services/Themes/themes.selectors";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { SubscribeNewsletterModal } from "components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import NewProfileModal from "components/Modals/NewProfileModal";
import styles from "./Layout.module.scss";
import AppLoader from "./AppLoader";
import TempBanner from "./TempBanner";
import AutoAddFavorite from "./AutoAddFavorite";
import { setAnalyticsUserId } from "lib/tracking";

interface Props {
  children: any;
  history: string[];
}

const Layout = (props: Props) => {
  const [showMobileModal, setShowMobileModal] = useState<boolean | null>(null);
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const isRTL = useRTL();
  const dispatch = useDispatch();
  const router = useRouter();

  const ttsActive = useSelector(ttsActiveSelector);
  const showLangModal = useSelector(showLangModalSelector);

  const { changeLanguage } = useChangeLanguage();
  const changeLanguageCallback = (lng: string) => {
    changeLanguage(lng, "replace", () => setLanguageLoaded(true));
    if (showLangModal) {
      dispatch(toggleLangueModalActionCreator());
    }
  };

  const toggleMobileAppModal = () => {
    setShowMobileModal(!showMobileModal);
  };

  useEffect(() => {
    // Language popup
    const storedLanguei18nCode = locale.getFromCache();
    if (storedLanguei18nCode && storedLanguei18nCode !== "fr" && storedLanguei18nCode !== router.locale) {
      changeLanguageCallback(storedLanguei18nCode);
    } else if (!storedLanguei18nCode) {
      if (!showLangModal) {
        dispatch(toggleLangueModalActionCreator());
      }
    } else {
      const locale = router.locale || "fr";
      if (!["fr", "default"].includes(locale)) {
        dispatch(toggleLangueActionCreator(locale));
      }
      setLanguageLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Mobile popup
    if (
      languageLoaded &&
      isMobileOnly &&
      !localStorage.getItem("hideMobileAppModal") &&
      !showLangModal &&
      showMobileModal === null
    ) {
      setTimeout(() => {
        // open modal after 1 min
        localStorage.setItem("hideMobileAppModal", "true");
        toggleMobileAppModal();
      }, 60000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLangModal, languageLoaded]);

  // USER
  const user = useSelector(userDetailsSelector);
  const isUserLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const hasUserError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_USER));
  useEffect(() => {
    if (!user && !isUserLoading && !hasUserError) {
      dispatch(fetchUserActionCreator());
    }
    if (user) {
      setAnalyticsUserId(user.email);
    }
  }, [user, isUserLoading, hasUserError, dispatch]);

  // THEMES
  const themes = useSelector(themesSelector);
  const isThemesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_THEMES));
  const hasThemesError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_THEMES));
  useEffect(() => {
    if (languageLoaded && themes.length === 0 && !isThemesLoading && !hasThemesError) {
      dispatch(fetchThemesActionCreator());
    }
  }, [languageLoaded, themes.length, isThemesLoading, hasThemesError, dispatch]);

  // LANGUAGES
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));
  const hasLanguagesError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_LANGUES));
  useEffect(() => {
    if (langues.length === 0 && !isLanguagesLoading && !hasLanguagesError) {
      dispatch(fetchLanguesActionCreator());
    }
  }, [langues.length, isLanguagesLoading, hasLanguagesError, dispatch]);

  const computeFullSentence = (nodeList: any) => {
    let sentence = "";

    for (const node of nodeList) {
      if (node.data) {
        sentence = sentence + node.data;
      } else if (node.childNodes.length > 0) {
        sentence = sentence + node.childNodes[0].data;
      }
    }
    return sentence;
  };

  const toggleHover = (e: any) => {
    if (ttsActive) {
      const sentence = e?.target?.firstChild?.nodeValue
        ? computeFullSentence(e.target.childNodes)
        : e?.target?.textContent || null;

      if (sentence) {
        readAudio(sentence, router.locale, null, ttsActive, (val: boolean) => dispatch(toggleSpinner(val)));
      } else {
        stopAudio();
      }
    }
  };

  // only on desktop, if user has no email and is not currently setting it
  const showEmailModal =
    !isMobileOnly && !!user && !user?.email && !window.location.pathname.includes("backend/user-profile");

  return (
    <div dir={isRTL ? "rtl" : "ltr"} onMouseOver={toggleHover} onTouchStart={toggleHover}>
      <Navbar />
      <TempBanner />
      <AppLoader>
        <div className={styles.main}>
          <main className={styles.content}>{props.children}</main>
        </div>
      </AppLoader>
      <Footer />
      <AutoAddFavorite />
      <LanguageModal
        show={showLangModal}
        currentLanguage={router.locale || "fr"}
        toggle={() => dispatch(toggleLangueModalActionCreator())}
        changeLanguage={changeLanguageCallback}
        languages={langues}
        isLanguagesLoading={isLanguagesLoading}
      />
      <MobileAppModal show={!!showMobileModal} toggle={toggleMobileAppModal} />
      <NewProfileModal />
      <SubscribeNewsletterModal />
    </div>
  );
};

export default Layout;
