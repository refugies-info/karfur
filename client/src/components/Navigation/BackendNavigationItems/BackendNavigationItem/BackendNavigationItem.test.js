import React from 'react';
import ReactDOM from 'react-dom';
import BackendNavigationItem from './BackendNavigationItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BackendNavigationItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});