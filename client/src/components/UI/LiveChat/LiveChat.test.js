import React from 'react';
import ReactDOM from 'react-dom';
import LiveChat from './LiveChat';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LiveChat />, div);
  ReactDOM.unmountComponentAtNode(div);
});