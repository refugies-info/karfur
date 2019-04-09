import React from 'react';
import ReactDOM from 'react-dom';
import CustomAccordion from './CustomAccordion';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CustomAccordion />, div);
  ReactDOM.unmountComponentAtNode(div);
});