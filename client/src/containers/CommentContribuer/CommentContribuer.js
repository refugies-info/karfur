import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';

import './CommentContribuer.scss';

class CommentContribuer extends Component {
  render() {
    return (
      <div className="animated fadeIn comment-contribuer texte-small">
        Cette section est encore en construction
      </div>
    );
  }
}

export default track({
  page: 'CommentContribuer',
})(withTranslation()(CommentContribuer));