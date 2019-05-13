import React, { PureComponent } from 'react';
import track from 'react-tracking';

class SendToMessenger extends PureComponent {
  componentDidUpdate() {
    const { handleParse } = this.props;
    handleParse();
  }

  render() {
    const {
      color,
      messengerAppId,
      pageId,
      children,
      dataRef,
      size,
    } = this.props;

    return (
      <div
        className="fb-send-to-messenger"
        messenger_app_id={messengerAppId}
        page_id={pageId}
        data-color={color}
        data-size={size}
        data-ref={dataRef}
      >
        {children}
      </div>
    );
  }
}

export default track({
    page: 'SendToMessenger',
  })(SendToMessenger);