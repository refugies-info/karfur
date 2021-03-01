import React, { Component } from "react";

export default class MessengerSendToMessenger extends Component {
  static defaultProps = {
    dataRef: undefined,
    color: "blue",
    size: "large",
    enforceLogin: false,
    ctaText: undefined,
    autoLogAppEvents: true,
    xfbml: true,
    version: "3.3",
    language: "fr_FR",
    debug: false,
  };

  componentDidMount() {
    if (document.getElementById("facebook-jssdk")) {
      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
  }

  setFbAsyncInit() {
    const { appId, autoLogAppEvents, xfbml, version } = this.props;
    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        autoLogAppEvents,
        xfbml,
        version: `v${version}`,
      });
    };
  }

  loadSdkAsynchronously() {
    const { language, debug } = this.props;
    /* eslint-disable */
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = `https://connect.facebook.net/${language}/sdk${
        debug ? "/debug" : ""
      }.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
    /* eslint-enable */
  }

  createMarkup() {
    const {
      pageId,
      appId,
      dataRef,
      color,
      size,
      enforceLogin,
      ctaText,
    } = this.props;

    const dataRefAttribute =
      dataRef !== undefined ? `data-ref="${dataRef}"` : "";

    const ctaTextAttribute =
      ctaText !== undefined ? `cta_text="${ctaText}"` : "";

    return {
      __html: `<div
        class="fb-send-to-messenger"
        page_id="${pageId}"
        messenger_app_id="${appId}"
        color="${color}"
        size="${size}"
        enforce_login="${enforceLogin}"
        ${dataRefAttribute}
        ${ctaTextAttribute}
      ></div>`,
    };
  }

  render() {
    return <div dangerouslySetInnerHTML={this.createMarkup()} />;
  }
}
