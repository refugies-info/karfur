import React from 'react';
import ReactDOM from 'react-dom';
import CustomTabPane from './CustomTabPane';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CustomTabPane />, div);
  ReactDOM.unmountComponentAtNode(div);
});