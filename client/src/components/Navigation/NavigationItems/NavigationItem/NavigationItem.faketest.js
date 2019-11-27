import React from 'react';
import ReactDOM from 'react-dom';
import NavigationItem from './NavigationItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavigationItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});