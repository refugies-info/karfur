import React from 'react';
import ReactDOM from 'react-dom';
import CreationTForm from './CreationTForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CreationTForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});