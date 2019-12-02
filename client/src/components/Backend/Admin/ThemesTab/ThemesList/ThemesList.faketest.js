import React from 'react';
import ReactDOM from 'react-dom';
import ThemesList from './ThemesList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ThemesList />, div);
  ReactDOM.unmountComponentAtNode(div);
});