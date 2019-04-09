import React from 'react';
import ReactDOM from 'react-dom';
import TranslationModal from './TranslationModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TranslationModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});