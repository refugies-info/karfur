import React from 'react';
import ReactDOM from 'react-dom';
import SideDrawer from './SideDrawer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SideDrawer />, div);
  ReactDOM.unmountComponentAtNode(div);
});