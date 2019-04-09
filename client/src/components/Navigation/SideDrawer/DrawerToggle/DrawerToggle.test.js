import React from 'react';
import ReactDOM from 'react-dom';
import DrawerToggle from './DrawerToggle';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DrawerToggle />, div);
  ReactDOM.unmountComponentAtNode(div);
});