import React, { useState, useEffect, useCallback } from "react";
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
import Footer from "components/Layout/Footer";
import { readAudio, stopAudio } from "lib/readAudio";
import { isContentPage } from "lib/isContentPage";
import { toggleSpinner } from "services/Tts/tts.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { userDetailsSelector } from "services/User/user.selectors";
import { useChangeLanguage, useRTL } from "hooks";
import locale from "utils/locale";
import { themesSelector } from "services/Themes/themes.selectors";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { SubscribeNewsletterModal } from "components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import NewProfileModal from "components/Modals/NewProfileModal";
import DownloadAppModal from "components/Modals/DownloadAppModal";
import styles from "./Layout.module.scss";
import AppLoader from "./AppLoader";
import AutoAddFavorite from "./AutoAddFavorite";
import DownloadAppBanner from "./DownloadAppBanner";
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

  // Language modal
  const showLangModal = useSelector(showLangModalSelector);
  const { changeLanguage } = useChangeLanguage();

  const changeLanguageCallback = useCallback(
    (lng: string) => {
      changeLanguage(lng, "replace", () => setLanguageLoaded(true));
      if (showLangModal) {
        dispatch(toggleLangueModalActionCreator());
      }
    },
    [dispatch, changeLanguage, showLangModal],
  );

  const toggleLanguageModal = useCallback(() => {
    const storedLanguei18nCode = locale.getFromCache();
    if (!storedLanguei18nCode) {
      // nothing in cache, save FR
      changeLanguageCallback("fr");
    } else {
      // else, close modal
      dispatch(toggleLangueModalActionCreator());
    }
  }, [dispatch, changeLanguageCallback]);

  const toggleMobileAppModal = () => {
    setShowMobileModal(!showMobileModal);
  };

  useEffect(() => {
    // wait 5 seconds before showing modal
    const waitAndShow = () => {
      setTimeout(() => {
        dispatch(toggleLangueModalActionCreator(true));
      }, 5000);
    };

    // Language popup
    const storedLanguei18nCode = locale.getFromCache();
    const isSharedSmsLink = new URLSearchParams(window.location.search).get("share") === "sms";

    if (storedLanguei18nCode && storedLanguei18nCode !== "fr" && storedLanguei18nCode !== router.locale) {
      // if locale saved and not same as in URL
      changeLanguageCallback(storedLanguei18nCode);
    } else if (!storedLanguei18nCode && !isSharedSmsLink) {
      // if no locale selected and not a shared link
      if (!showLangModal) {
        if (isMobileOnly) waitAndShow();
        else dispatch(toggleLangueModalActionCreator(true));
      }
    } else if (isSharedSmsLink && router.locale === "fr") {
      // if shared link and FR
      waitAndShow();
    } else {
      // set locale
      const locale = router.locale || "fr";
      if (!["fr", "default"].includes(locale)) {
        dispatch(toggleLangueActionCreator(locale));
      }
      setLanguageLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile popup
  useEffect(() => {
    if (!languageLoaded || !isMobileOnly || showMobileModal !== null) return;

    const historyLength = props.history.length;
    // if user lands on homepage
    if (
      (historyLength === 1 && props.history[0] === "/") || // homepage first
      (historyLength === 2 && props.history[1] === "/" && props.history[0].match(/^\/[a-z][a-z]/gm)) // homepage and select language
    ) {
      setTimeout(() => {
        toggleMobileAppModal();
      }, 10000);
    }

    // if previous page was a content page (but not current one)
    else if (historyLength > 1 && isContentPage(props.history[1]) && !isContentPage(props.history[0])) {
      toggleMobileAppModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLangModal, languageLoaded, props.history]);

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

  return (
    <div dir={isRTL ? "rtl" : "ltr"} onMouseOver={toggleHover} onTouchStart={toggleHover}>
      <DownloadAppBanner />
      <Navbar />
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
        toggle={toggleLanguageModal}
        changeLanguage={changeLanguageCallback}
        languages={langues}
        isLanguagesLoading={isLanguagesLoading}
      />
      <DownloadAppModal show={!!showMobileModal} toggle={toggleMobileAppModal} />
      <NewProfileModal />
      <SubscribeNewsletterModal />
    </div>
  );
};

export default Layout;
