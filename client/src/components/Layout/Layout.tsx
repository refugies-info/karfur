import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import { useRouter } from "next/router";

// actions
import {
  fetchActiveDispositifsActionsCreator
} from "services/ActiveDispositifs/activeDispositifs.actions";
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
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";

import Navbar from "components/Navigation/Navbar/Navbar";
import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import MobileAppModal from "components/Modals/MobileAppModal/MobileAppModal";
import Footer from "components/Layout/Footer";
import { readAudio, stopAudio } from "lib/readAudio";
import { toggleSpinner } from "services/Tts/tts.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { userDetailsSelector } from "services/User/user.selectors";
import useRTL from "hooks/useRTL";
import { getPath, PathNames } from "routes";

interface Props {
  children: any
  history: string[]
}

const Layout = (props: Props) => {
  const [showMobileModal, setShowMobileModal] = useState<boolean|null>(null);
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const isRTL = useRTL();
  const dispatch = useDispatch();
  const router = useRouter();

  const ttsActive = useSelector(ttsActiveSelector);
  const showLangModal = useSelector(showLangModalSelector);

  const changeLanguage = (lng: string) => {
    dispatch(toggleLangueActionCreator(lng));

    const { pathname, query } = router;
    router.replace({
      pathname: getPath(pathname as PathNames, lng),
      query
    }, undefined, { locale: lng }).then(() => {
      setLanguageLoaded(true);
    });

    if (showLangModal) {
      dispatch(toggleLangueModalActionCreator());
    }
  };

  const toggleMobileAppModal = () => {
    setShowMobileModal(!showMobileModal);
  }

  useEffect(() => {
    // Language popup
    const storedLanguei18nCode = localStorage.getItem("languei18nCode");
    if (storedLanguei18nCode && storedLanguei18nCode !== "fr" && storedLanguei18nCode !== router.locale) {
      changeLanguage(storedLanguei18nCode);
    } else if (!storedLanguei18nCode) {
      dispatch(toggleLangueModalActionCreator());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Mobile popup
    if (languageLoaded
      && isMobileOnly
      && !localStorage.getItem("hideMobileAppModal")
      && !showLangModal
      && showMobileModal === null
    ) {
      localStorage.setItem("hideMobileAppModal", "true");
      toggleMobileAppModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLangModal, languageLoaded])

  // USER
  const user = useSelector(userDetailsSelector);
  const isUserLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const hasUserError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_USER));
  useEffect(() => {
    if (!user && !isUserLoading && !hasUserError) {
      dispatch(fetchUserActionCreator());
    }
  }, [
    user,
    isUserLoading,
    hasUserError,
    dispatch
  ]);

  // DISPOSITIFS
  const dispositifs = useSelector(activeDispositifsSelector);
  const isDispositifsLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  const hasDispositifsError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  useEffect(() => {
    if (dispositifs.length === 0 && !isDispositifsLoading && !hasDispositifsError) {
      dispatch(fetchActiveDispositifsActionsCreator());
    }
  }, [
    dispositifs.length,
    isDispositifsLoading,
    hasDispositifsError,
    dispatch
  ]);

  // LANGUAGES
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));
  const hasLanguagesError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_LANGUES));
  useEffect(() => {
    if (langues.length === 0 && !isLanguagesLoading && !hasLanguagesError) {
      dispatch(fetchLanguesActionCreator());
    }
  }, [
    langues.length,
    isLanguagesLoading,
    hasLanguagesError,
    dispatch
  ]);

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
        : (e?.target?.textContent || null);

      if (sentence) {
        readAudio(
          sentence,
          router.locale,
          null,
          false,
          ttsActive,
          (val: boolean) => dispatch(toggleSpinner(val))
        );
      } else {
        stopAudio();
      }
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} onMouseOver={toggleHover}>
      <Navbar history={props.history} />
      <div className="app-body">
        <main className="content">
          {props.children}
        </main>
      </div>

      <Footer />

      <LanguageModal
        show={showLangModal}
        currentLanguage={router.locale || "fr"}
        toggle={() => dispatch(toggleLangueModalActionCreator())}
        changeLanguage={changeLanguage}
        languages={langues}
        isLanguagesLoading={isLanguagesLoading}
      />
      <MobileAppModal
        show={!!showMobileModal}
        toggle={toggleMobileAppModal}
      />
    </div>
  );

}

export default Layout
