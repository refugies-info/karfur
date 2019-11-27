import React from 'react';
import ReactDOM from 'react-dom';
import LanguesTab from './LanguesTab';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LanguesTab />, div);
  ReactDOM.unmountComponentAtNode(div);
});