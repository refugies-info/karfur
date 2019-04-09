import React from 'react';
import ReactDOM from 'react-dom';
import AvancementLangue from './AvancementLangue';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AvancementLangue />, div);
  ReactDOM.unmountComponentAtNode(div);
});