import React from 'react';
import ReactDOM from 'react-dom';
import Parcours from './Forms';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Parcours />, div);
  ReactDOM.unmountComponentAtNode(div);
});
