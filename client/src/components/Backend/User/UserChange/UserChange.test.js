import React from 'react';
import ReactDOM from 'react-dom';
import UserChange from './UserChange';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserChange />, div);
  ReactDOM.unmountComponentAtNode(div);
});