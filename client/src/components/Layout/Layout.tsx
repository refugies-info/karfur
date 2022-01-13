import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import { useDispatch, useSelector } from "react-redux";
import DirectionProvider, { DIRECTIONS } from "react-with-direction/dist/DirectionProvider";
import Navbar from "components/Navigation/Navbar/Navbar";
import SideDrawer from "components/Navigation/SideDrawer/SideDrawer";

// actions
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import {
  fetchLanguesActionCreator,
  toggleLangueModalActionCreator,
  toggleLangueActionCreator,
} from "services/Langue/langue.actions";
import { setUserStructureActionCreator } from "services/UserStructure/userStructure.actions";
import { fetchUserActionCreator } from "services/User/user.actions";

// selectors
import { ttsActiveSelector } from "services/Tts/tts.selector";
import { languei18nSelector } from "services/Langue/langue.selectors";
import { showLangModalSelector, allLanguesSelector } from "services/Langue/langue.selectors";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";

import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import MobileAppModal from "components/Modals/MobileAppModal/MobileAppModal";
import { readAudio } from "lib/readAudio";
// import routes from "routes";
import Footer from "containers/Footer/Footer";
import { toggleSpinner } from "services/Tts/tts.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isMobileOnly } from "react-device-detect";
// import "./Layout.module.scss";

const Layout = (props: any) => {
  const [showSideDrawerLeft, setShowSideDrawerLeft] = useState(false);
  const [showSideDrawerRight, setShowSideDrawerRight] = useState(false);
  const [traducteur, setTraducteur] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  /* const audio = new Audio(); */
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const ttsActive = useSelector(ttsActiveSelector)
  const languei18nCode = useSelector(languei18nSelector)
  const showLangModal = useSelector(showLangModalSelector)
  const langues = useSelector(allLanguesSelector)
  const dispositifs = useSelector(activeDispositifsSelector)
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES))


  useEffect(() => {
    dispatch(fetchUserActionCreator());
    dispatch(fetchActiveDispositifsActionsCreator());
    dispatch(fetchLanguesActionCreator());
    /* const storedLanguei18nCode = localStorage.getItem("languei18nCode");
    if (storedLanguei18nCode && storedLanguei18nCode !== "fr") {
      this.changeLanguage(storedLanguei18nCode);
    } else if (!storedLanguei18nCode) {
      this.props.toggleLangueModal();
    }
 */
    // window.scrollTo(0, 0);
  }, []);

  const forceStopAudio = () => {
/*     audio.pause();
    audio.currentTime = 0; */
  };

  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  const sideDrawerClosedHandler = (dir: "right"|"left") => {
    if (dir === "right") {
      setShowSideDrawerRight(false)
    } else {
      setShowSideDrawerLeft(false)
    }
  };

  const sideDrawerToggleHandler = (dir: "right"|"left") => {
    if (dir === "right") {
      setShowSideDrawerRight(!showSideDrawerRight)
    } else {
      setShowSideDrawerLeft(!showSideDrawerLeft)
    }
  };

  const changeLanguage = (lng: string) => {
    dispatch(toggleLangueActionCreator(lng));
/*     if (this.props.i18n.getResourceBundle(lng, "translation")) {
      this.props.i18n.changeLanguage(lng);
    } */
    if (showLangModal) {
      dispatch(toggleLangueModalActionCreator());
    }
  };
  const computeFullSentence = (nodeList: any) => {
    let sentence = "";

    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].data) {
        sentence = sentence + nodeList[i].data;
      } else if (nodeList[i].childNodes.length > 0) {
        sentence = sentence + nodeList[i].childNodes[0].data;
      }
    }

    return sentence;
  };

  const toggleHover = (e: any) => {
    if (ttsActive) {
      if (e.target && e.target.firstChild && e.target.firstChild.nodeValue) {
        readAudio(
          computeFullSentence(e.target.childNodes),
          i18n.language
        );
      } else if (e.target.textContent) {
        readAudio(e.target.textContent, i18n.language);
      } else {
        forceStopAudio();
      }
    }
  };

  const toggleMobileAppModal = () => {
    setShowMobileModal(!showMobileModal);
  }

  return (
    <DirectionProvider direction={isRTL ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
      <div onMouseOver={toggleHover}>
        <Navbar
          {...props}
          drawerToggleClicked={sideDrawerToggleHandler}
        />
        <div className="app-body">
          <SideDrawer
            side="left"
            open={showSideDrawerLeft}
            closed={() => sideDrawerClosedHandler("left")}
          />

          <main
            className={
              "Content"
/*               (this.props.location &&
              this.props.location.pathname.includes("/advanced-search")
                ? " advanced-search"
                : "") */
            }
          >
            {props.children}
          </main>
        </div>

        <Footer />

        <LanguageModal
          show={showLangModal}
          current_language={i18n.language}
          toggle={() => dispatch(toggleLangueModalActionCreator())}
          changeLanguage={changeLanguage}
          langues={langues}
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
