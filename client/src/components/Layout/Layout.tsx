import React, { useState, useEffect, useCallback } from "react";
import i18n from "i18n";
import { useDispatch, useSelector } from "react-redux";
import DirectionProvider, { DIRECTIONS } from "react-with-direction/dist/DirectionProvider";
import Navbar from "components/Navigation/Navbar/Navbar";

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
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";

import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import MobileAppModal from "components/Modals/MobileAppModal/MobileAppModal";
import Footer from "components/Layout/Footer";
import { readAudio, stopAudio } from "lib/readAudio";
import { toggleSpinner } from "services/Tts/tts.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";

interface Props {
  children: any
}

const Layout = (props: Props) => {
  const [showMobileModal, setShowMobileModal] = useState(false);
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const dispatch = useDispatch();

  const ttsActive = useSelector(ttsActiveSelector);
  const showLangModal = useSelector(showLangModalSelector);
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));


  const switchToLanguage = useCallback((lng: string) => {
    dispatch(toggleLangueActionCreator(lng));
    if (i18n.getResourceBundle(lng, "translation")) {
      i18n.changeLanguage(lng);
    }
  }, [dispatch]);

  const changeLanguage = (lng: string) => {
    switchToLanguage(lng);
    if (showLangModal) {
      dispatch(toggleLangueModalActionCreator());
    }
  };

  useEffect(() => {
    dispatch(fetchUserActionCreator());
    dispatch(fetchActiveDispositifsActionsCreator());
    dispatch(fetchLanguesActionCreator());

    const storedLanguei18nCode = localStorage.getItem("languei18nCode");
    if (storedLanguei18nCode && storedLanguei18nCode !== "fr") {
      switchToLanguage(storedLanguei18nCode);
    } else if (!storedLanguei18nCode) {
      dispatch(toggleLangueModalActionCreator());
    }
  }, [dispatch, switchToLanguage]);

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
          i18n.language,
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

  const toggleMobileAppModal = () => {
    setShowMobileModal(!showMobileModal);
  }

  return (
    <DirectionProvider direction={isRTL ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
      <div onMouseOver={toggleHover}>
        <Navbar />
        <div className="app-body">
          <main className="content">
            {props.children}
          </main>
        </div>

        <Footer />

        <LanguageModal
          show={showLangModal}
          currentLanguage={i18n.language}
          toggle={() => dispatch(toggleLangueModalActionCreator())}
          changeLanguage={changeLanguage}
          languages={langues}
          isLanguagesLoading={isLanguagesLoading}
        />
        <MobileAppModal
          show={showMobileModal}
          toggle={toggleMobileAppModal}
        />
      </div>
    </DirectionProvider>
  );

}

export default Layout
