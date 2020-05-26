import React, { Component, Suspense } from "react";
import i18n from "../../i18n";
import { withTranslation } from "react-i18next";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import DirectionProvider, {
  DIRECTIONS,
} from "react-with-direction/dist/DirectionProvider";
import track from "react-tracking";
// import { AppAside, AppFooter } from '@coreui/react';
import { connect } from "react-redux";
import Cookies from "js-cookie";

import Toolbar from "../Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import {
  fetch_langues,
  fetch_dispositifs,
  toggle_lang_modal,
  toggle_langue,
} from "../../services/actions/index";
import { fetch_structures } from "../../services/Structures/structures.actions";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import LanguageModal from "../../components/Modals/LanguageModal/LanguageModal";
import { readAudio } from "./functions";
import routes from "../../routes";
import Footer from "../Footer/Footer";

import "./Layout.scss";

export class Layout extends Component {
  constructor(props) {
    super(props);
    this.readAudio = readAudio.bind(this);
  }

  state = {
    showSideDrawer: { left: false, right: false },
    traducteur: false,
  };
  audio = new Audio();

  componentDidMount() {
    this.props.fetchUser();
    // this.props.fetch_dispositifs();
    // this.props.fetch_structures();
    // this.props.fetch_langues().then(() => {
    //   let languei18nCode = Cookies.get("languei18nCode");
    //   if (languei18nCode && languei18nCode !== "fr") {
    //     this.changeLanguage(languei18nCode);
    //   } else if (!languei18nCode) {
    //     this.props.toggle_lang_modal();
    //   }
    // });
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ttsActive !== this.props.ttsActive && !this.props.ttsActive) {
      this.forceStopAudio();
    }
    if (this.props.location.pathname !== prevProps.location.pathname) {
      routes.map((item) => {
        if (item.path === this.props.location.pathname) {
          document.title = item.name;
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ttsActive !== this.props.ttsActive && !nextProps.ttsActive) {
      this.forceStopAudio();
    }
  }

  forceStopAudio = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
  };
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  sideDrawerClosedHandler = (dir) => {
    this.setState({
      showSideDrawer: { ...this.state.showSideDrawer, [dir]: false },
    });
  };

  sideDrawerToggleHandler = (dir) => {
    this.setState((prevState) => {
      return {
        showSideDrawer: {
          ...this.state.showSideDrawer,
          [dir]: !prevState.showSideDrawer[dir],
        },
      };
    });
  };

  changeLanguage = (lng) => {
    this.props.tracking.trackEvent({
      action: "click",
      label: "changeLanguage",
      value: lng,
    });
    this.props.toggle_langue(lng);
    if (this.props.i18n.getResourceBundle(lng, "translation")) {
      this.props.i18n.changeLanguage(lng);
    } else {
      console.log("Resource not found in i18next.");
    }
    if (this.props.showLangModal) {
      this.props.toggle_lang_modal();
    }
  };

  toggleHover = (e) => {
    if (this.props.ttsActive) {
      if (e.target && e.target.firstChild && e.target.firstChild.nodeValue) {
        this.readAudio(e.target.firstChild.nodeValue, i18n.language);
      } else {
        this.forceStopAudio();
      }
    }
  };

  render() {
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

    return (
      <DirectionProvider direction={isRTL ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
        <div onMouseOver={this.toggleHover}>
          <Suspense fallback={this.loading()}>
            <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
          </Suspense>
          <div className="app-body">
            <SideDrawer
              side="left"
              open={this.state.showSideDrawer.left}
              closed={() => this.sideDrawerClosedHandler("left")}
            />

            <main className="Content">
              {this.props.children}
              <>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => (
                          <route.component
                            socket={this.props.socket}
                            socketFn={this.props.socketFn}
                            {...props}
                          />
                        )}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to="/homepage" />
                </Switch>
              </>
            </main>
          </div>

          <Footer />

          <LanguageModal
            show={this.props.showLangModal}
            current_language={i18n.language}
            toggle={this.props.toggle_lang_modal}
            changeLanguage={this.changeLanguage}
            languages={{
              ...this.props.langues.filter((x) => x.avancement >= 0.8),
              unavailable: { unavailable: true },
            }}
          />
        </div>
      </DirectionProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ttsActive: state.tts.ttsActive,
    languei18nCode: state.langue.languei18nCode,
    showLangModal: state.langue.showLangModal,
    langues: state.langue.langues,
    dispositifs: state.dispositif.dispositifs,
  };
};

const mapDispatchToProps = {
  fetch_structures,
  fetch_langues,
  fetch_dispositifs,
  fetchUser: fetchUserActionCreator,
  toggle_lang_modal,
  toggle_langue,
};

export default track(
  {
    layout: "Layout",
  },
  { dispatchOnMount: true }
)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(withTranslation()(Layout)))
);
