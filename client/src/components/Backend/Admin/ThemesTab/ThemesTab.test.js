import React from 'react';
import ReactDOM from 'react-dom';
import ThemesTab from './ThemesTab';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ThemesTab />, div);
  ReactDOM.unmountComponentAtNode(div);
});