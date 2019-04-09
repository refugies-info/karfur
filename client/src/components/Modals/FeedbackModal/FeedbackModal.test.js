import React from 'react';
import ReactDOM from 'react-dom';
import FeedbackModal from './FeedbackModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FeedbackModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});