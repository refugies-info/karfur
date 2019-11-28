import React from 'react';
import ReactDOM from 'react-dom';
import LanguesList from './LanguesList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LanguesList />, div);
  ReactDOM.unmountComponentAtNode(div);
});