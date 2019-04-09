import React from 'react';
import ReactDOM from 'react-dom';
import NavigationItems from './NavigationItems';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavigationItems />, div);
  ReactDOM.unmountComponentAtNode(div);
});