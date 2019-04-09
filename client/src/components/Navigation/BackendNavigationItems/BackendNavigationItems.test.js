import React from 'react';
import ReactDOM from 'react-dom';
import BackendNavigationItems from './BackendNavigationItems';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BackendNavigationItems />, div);
  ReactDOM.unmountComponentAtNode(div);
});