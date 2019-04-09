import React from 'react';
import ReactDOM from 'react-dom';
import LanguageModal from './LanguageModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LanguageModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});