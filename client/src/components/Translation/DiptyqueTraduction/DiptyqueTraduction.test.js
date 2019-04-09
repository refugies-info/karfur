import React from 'react';
import ReactDOM from 'react-dom';
import DiptyqueTraduction from './DiptyqueTraduction';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DiptyqueTraduction />, div);
  ReactDOM.unmountComponentAtNode(div);
});