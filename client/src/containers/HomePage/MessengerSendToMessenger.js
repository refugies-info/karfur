import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MessengerSendToMessenger extends Component {
  static propTypes = {
    pageId: PropTypes.string.isRequired,
    appId: PropTypes.string.isRequired,

    dataRef: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    enforceLogin: PropTypes.bool,
    ctaText: PropTypes.oneOf([
      'GET_THIS_IN_MESSENGER',
      'RECEIVE_THIS_IN_MESSENGER',
      'SEND_THIS_TO_ME',
      'GET_CUSTOMER_ASSISTANCE',
      'GET_CUSTOMER_SERVICE',
      'GET_SUPPORT',
      'LET_US_CHAT',
      'SEND_ME_MESSAGES',
      'ALERT_ME_IN_MESSENGER',
      'SEND_ME_UPDATES',
      'MESSAGE_ME',
      'LET_ME_KNOW',
      'KEEP_ME_UPDATED',
      'TELL_ME_MORE',
      'SUBSCRIBE_IN_MESSENGER',
      'SUBSCRIBE_TO_UPDATES',
      'GET_MESSAGES',
      'SUBSCRIBE',
      'GET_STARTED_IN_MESSENGER',
      'LEARN_MORE_IN_MESSENGER',
      'GET_STARTED',
      'SEND_TO_MESSENGER',
    ]),
    autoLogAppEvents: PropTypes.bool,
    xfbml: PropTypes.bool,
    version: PropTypes.string,
    language: PropTypes.string,
    debug: PropTypes.bool,
  };

  static defaultProps = {
    dataRef: undefined,
    color: 'blue',
    size: 'large',
    enforceLogin: false,
    ctaText: undefined,
    autoLogAppEvents: true,
    xfbml: true,
    version: '2.11',
    language: 'en_US',
    debug: false,
  };

  componentDidMount() {
    if (document.getElementById('facebook-jssdk')) {
      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
  }

  setFbAsyncInit() {
    const { appId, autoLogAppEvents, xfbml, version } = this.props;
    console.log('ici')
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
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = `https://connect.facebook.net/${language}/sdk${
        debug ? '/debug' : ''
      }.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
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
      dataRef !== undefined ? `data-ref="${dataRef}"` : '';

    const ctaTextAttribute =
      ctaText !== undefined ? `cta_text="${ctaText}"` : '';

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
    if(window.FB && window.FB.Event){
      console.log('subscribing mafak')
      window.FB.Event.subscribe('send_to_messenger', function(e) {
        console.log(e)
      });
    }
    return <div dangerouslySetInnerHTML={this.createMarkup()} />;
  }
}