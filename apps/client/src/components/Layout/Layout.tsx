import { cn } from "@refugies-info/ui";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import Footer from "~/components/Layout/Footer";
import DownloadAppModal from "~/components/Modals/DownloadAppModal";
import LanguageModal from "~/components/Modals/LanguageModal/LanguageModal";
import NewProfileModal from "~/components/Modals/NewProfileModal";
import { SubscribeNewsletterModal } from "~/components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import Navbar from "~/components/Navigation/Navbar";
import { useChangeLanguage, useRTL } from "~/hooks";
import { ConsentBannerAndConsentManagement } from "~/hooks/useConsentContext";
import { isContentPage } from "~/lib/isContentPage";
import { readAudio, stopAudio } from "~/lib/readAudio";
import { setAnalyticsUserId } from "~/lib/tracking";
// actions
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "~/services/Langue/langue.actions";
// selectors
import { allLanguesSelector, showLangModalSelector } from "~/services/Langue/langue.selectors";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import {
  hasErroredSelector,
  isLoadingSelector,
} from "~/services/LoadingStatus/loadingStatus.selectors";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import { hasThemesLoadedSelector } from "~/services/Themes/themes.selectors";
import { toggleSpinner } from "~/services/Tts/tts.actions";
import { ttsActiveSelector } from "~/services/Tts/tts.selector";
import { fetchUserActionCreator } from "~/services/User/user.actions";
import { userDetailsSelector } from "~/services/User/user.selectors";
import { fetchUserFavoritesActionCreator } from "~/services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { userFavoritesSelector } from "~/services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import locale from "~/utils/locale";
import AutoAddFavorite from "./AutoAddFavorite";
import DownloadAppBanner from "./DownloadAppBanner";
import styles from "./Layout.module.scss";

interface Props {
  children: any;
  history: string[];
  className?: string;
}

// TODO : refator to avoid  overcomplex code to show MobileModal + move it's logic to it's own component

const Layout = (props: Props) => {
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
  const [languageLoaded, setLanguageLoaded] = useState(false);

  // Use refs to track modal state and timeout
  const manuallyClosedRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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

  const toggleMobileAppModal = useCallback(() => {
    setShowMobileModal((prevState) => {
      // If we're closing the modal, mark it as manually closed
      if (prevState) {
        manuallyClosedRef.current = true;
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
      return !prevState;
    });
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    const currentTimeout = timeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

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

    if (
      storedLanguei18nCode &&
      storedLanguei18nCode !== "fr" &&
      storedLanguei18nCode !== router.locale
    ) {
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

  const shouldShowMobilePopup = isMobileOnly && !showMobileModal && languageLoaded;

  // Mobile popup
  const [currentPath, prevPath] = useMemo(() => {
    const validHistory = props.history.filter((path) => path !== undefined && path !== null);
    const lastTwo = validHistory.slice(-2);
    return [lastTwo[0], lastTwo[1]] as [string, string | undefined];
  }, [props.history]);

  useEffect(() => {
    // Skip all popup logic if mobile popup shouldn't be shown
    if (!shouldShowMobilePopup) return;
    if (!currentPath) return;
    if (manuallyClosedRef.current) return; // Skip if modal was manually closed

    let timeoutId: number | undefined;
    const handleMobilePopup = () => {
      if (currentPath === "/" || (prevPath?.match(/^\/[a-z][a-z]\/?$/) && currentPath === "/")) {
        if (!timeoutId) {
          timeoutId = window.setTimeout(toggleMobileAppModal, 10000);
        }
      }
      // Coming from content page to non-content page
      else if (
        prevPath &&
        isContentPage(prevPath) &&
        !isContentPage(currentPath) &&
        currentPath !== prevPath
      ) {
        toggleMobileAppModal();
      }
    };

    handleMobilePopup();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };
  }, [shouldShowMobilePopup, currentPath, prevPath, toggleMobileAppModal]);

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
  const hasThemesLoaded = useSelector(hasThemesLoadedSelector);
  const isThemesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_THEMES));
  const hasThemesError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_THEMES));
  useEffect(() => {
    if (languageLoaded && !hasThemesLoaded && !isThemesLoading && !hasThemesError) {
      dispatch(fetchThemesActionCreator());
    }
  }, [languageLoaded, hasThemesLoaded, isThemesLoading, hasThemesError, dispatch]);

  // LANGUAGES
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));
  const hasLanguagesError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_LANGUES));
  useEffect(() => {
    if (langues.length === 0 && !isLanguagesLoading && !hasLanguagesError) {
      dispatch(fetchLanguesActionCreator());
    }
  }, [langues.length, isLanguagesLoading, hasLanguagesError, dispatch]);

  // USER FAVORITES
  const userFavorites = useSelector(userFavoritesSelector);
  const isUserFavoritesLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_FAVORITES),
  );
  const hasUserFavoritesError = useSelector(
    hasErroredSelector(LoadingStatusKey.FETCH_USER_FAVORITES),
  );
  useEffect(() => {
    if (user && userFavorites === null && !isUserFavoritesLoading && !hasUserFavoritesError) {
      dispatch(fetchUserFavoritesActionCreator(router.locale || "fr"));
    }
  }, [user, userFavorites, isUserFavoritesLoading, hasUserFavoritesError, dispatch, router.locale]);

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
        readAudio(sentence, router.locale, null, ttsActive, (val: boolean) =>
          dispatch(toggleSpinner(val)),
        );
      } else {
        stopAudio();
      }
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} onMouseOver={toggleHover} onTouchStart={toggleHover}>
      {!showLangModal && <ConsentBannerAndConsentManagement />}
      <DownloadAppBanner />
      <Navbar />
      <main id="contenu" className={cn(styles.content, props.className)}>
        {props.children}
      </main>
      <Footer />
      <AutoAddFavorite />

      <DownloadAppModal show={showMobileModal} toggle={toggleMobileAppModal} />
      <NewProfileModal />
      <SubscribeNewsletterModal />
      <LanguageModal
        show={showLangModal}
        currentLanguage={router.locale || "fr"}
        toggle={toggleLanguageModal}
        changeLanguage={changeLanguageCallback}
        languages={langues}
        isLanguagesLoading={isLanguagesLoading}
      />
    </div>
  );
};

export default Layout;
